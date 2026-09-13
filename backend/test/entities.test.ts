import 'reflect-metadata'
import assert from 'node:assert/strict'
import { before, test } from 'node:test'
import { DataSource } from 'typeorm'
import {
  CMMS_ENTITIES, ApprovalEntity, ApprovalParticipantEntity, CodeItemEntity,
  EquipmentEntity, MaterialEntity, PmRecordEntity, WorkOrderEntity,
  WorkPermitEntity,
  WorkOrderPhaseEntity, InventoryClosingBalanceEntity, InventoryClosingPeriodEntity,
  AttachmentItemEntity, PurchaseOrderItemEntity,
} from '../src/persistence/entities'
import { APPROVAL_PARTICIPANTS_ACTION, MODULE_CODE } from '../../shared/domain-codes'

class MetadataDataSource extends DataSource {
  async validateMetadata() { await this.buildMetadatas() }
}
const source = new MetadataDataSource({ type: 'postgres', entities: CMMS_ENTITIES, synchronize: false })
before(async () => { await source.validateMetadata() })

const pk = (entity: Parameters<typeof source.getMetadata>[0]) =>
  source.getMetadata(entity).primaryColumns.map((column) => column.propertyName).sort()

test('all entities build with PostgreSQL metadata; no shadow FK columns are generated', () => {
  assert.equal(source.entityMetadatas.length, CMMS_ENTITIES.length)
  for (const entity of source.entityMetadatas) {
    assert.ok(entity.primaryColumns.length > 0, entity.name)
    assert.equal(new Set(entity.columns.map((column) => column.databaseName)).size, entity.columns.length)
    for (const fk of entity.foreignKeys) {
      assert.ok(fk.columnNames.includes('companyId'), `${entity.name}: ${fk.name} must include tenant`)
      assert.equal(fk.onDelete, 'RESTRICT')
      for (const column of fk.columns) assert.equal(column.isVirtual, false, `${entity.name}: ${column.propertyName}`)
    }
  }
})

test('participants use the parent approval number and sequence as a composite key', () => {
  assert.deepEqual(pk(ApprovalEntity), ['companyId', 'id'])
  assert.deepEqual(pk(ApprovalParticipantEntity), ['companyId', 'id', 'sequenceNo'])
  const metadata = source.getMetadata(ApprovalParticipantEntity)
  assert.equal(metadata.findColumnWithPropertyName('approvalId'), undefined)
  const parent = metadata.foreignKeys.find((key) => key.referencedEntityMetadata.target === ApprovalEntity)!
  assert.deepEqual(parent.columnNames, ['companyId', 'id'])
  assert.deepEqual(parent.referencedColumnNames, ['companyId', 'id'])
  assert.ok(metadata.checks.some((check) => check.expression === '"sequenceNo" >= 0'))
})

test('database enums store shared codes, not translated labels', () => {
  const approval = source.getMetadata(ApprovalEntity)
  assert.deepEqual(approval.findColumnWithPropertyName('module')?.enum, Object.values(MODULE_CODE))
  assert.deepEqual(source.getMetadata(ApprovalParticipantEntity).findColumnWithPropertyName('actionCode')?.enum,
    Object.values(APPROVAL_PARTICIPANTS_ACTION))
  assert.ok(approval.findColumnWithPropertyName('module')?.enum?.includes('work-order-plan'))
  assert.ok(!approval.findColumnWithPropertyName('module')?.enum?.includes('작업계획'))
})

test('operational types share one company-scoped code and item table', () => {
  assert.deepEqual(pk(CodeItemEntity), ['codeId', 'companyId', 'id'])
  for (const [entity, field] of [
    [EquipmentEntity, 'type'], [MaterialEntity, 'type'],
    [PmRecordEntity, 'type'], [WorkOrderEntity, 'type'], [WorkPermitEntity, 'type'],
  ] as const) {
    const meta = source.getMetadata(entity)
    const fk = meta.foreignKeys.find((key) => key.referencedEntityMetadata.target === CodeItemEntity)!
    assert.deepEqual(fk.columnNames, ['companyId', 'code', field])
    assert.equal(meta.findColumnWithPropertyName('code')?.type, 'varchar')
    assert.equal(meta.findColumnWithPropertyName('classificationGroup'), undefined)
    assert.equal(source.getMetadata(CodeItemEntity).findColumnWithPropertyName('codeId')?.type, 'varchar')
    assert.equal(source.getMetadata(CodeItemEntity).findColumnWithPropertyName('id')?.type, 'varchar')
  }
})

test('work phases retain site-scoped parent identity; closing snapshots retain warehouse identity', () => {
  assert.deepEqual(pk(WorkOrderPhaseEntity), ['companyId', 'phase', 'siteId', 'workOrderId'])
  const meta = source.getMetadata(InventoryClosingBalanceEntity)
  const closing = meta.foreignKeys.find((key) => key.referencedEntityMetadata.target === InventoryClosingPeriodEntity)!
  assert.deepEqual(closing.columnNames, ['companyId', 'warehouseId', 'yearMonth'])
  assert.ok(source.getMetadata(InventoryClosingPeriodEntity).uniques.some((key) =>
    key.columns.map((column) => column.propertyName).join(',') === 'companyId,warehouseId,yearMonth'))
})

test('file sizes are integer bytes and monetary values retain decimal precision', () => {
  assert.equal(source.getMetadata(AttachmentItemEntity).findColumnWithPropertyName('fileSize')?.type, 'bigint')
  const price = source.getMetadata(PurchaseOrderItemEntity).findColumnWithPropertyName('unitPrice')!
  assert.equal(price.type, 'numeric')
  assert.equal(price.precision, 20)
  assert.equal(price.scale, 6)
})

test('polymorphic document references retain the site portion of work document keys', () => {
  const approval = source.getMetadata(ApprovalEntity)
  assert.ok(approval.findColumnWithPropertyName('recordSiteId'))
  assert.ok(approval.checks.some((check) =>
    check.expression === '"module" NOT IN (\'work-order-plan\', \'work-order-result\', \'work-permit\') OR "recordSiteId" IS NOT NULL'))
})
