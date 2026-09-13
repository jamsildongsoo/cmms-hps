import { SiteEntity, WarehouseEntity, UserEntity } from '../../org/entities/organization.entity'
import { MaterialEntity } from '../../material/entities/material.entity'
import { PurchaseRequestEntity, PurchaseRequestItemEntity } from '../../purchase-request/entities/purchase-request.entity'
import { PurchaseOrderEntity, PurchaseOrderItemEntity } from '../../purchase-order/entities/purchase-order.entity'
import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany, JoinColumn, Unique, Check } from 'typeorm'
import type { Relation } from 'typeorm'

import { AuditedEntity } from '../../../common/audit/audited.entity'
import {
  INVENTORY_CLOSING_STATUS_LABELS,
  INVENTORY_DOCUMENT_STATUS_LABELS,
  INVENTORY_DOCUMENT_TYPE_LABELS,
  INVENTORY_REFERENCE_LABELS,
  INVENTORY_TRANSACTION_REASON_LABELS,
  INVENTORY_TRANSACTION_TYPE_LABELS,
} from '../../../../../shared/domain-codes'
import type {
  InventoryClosingStatus,
  InventoryDocumentStatus,
  InventoryDocumentType,
  InventoryReferenceType,
  InventoryTransactionReason,
  InventoryTransactionType,
} from '../../../../../shared/domain-codes'

@Entity('inventory_document')
export class InventoryDocumentEntity extends AuditedEntity {
  @PrimaryColumn('varchar', { length: 255 })
  id!: string

  @PrimaryColumn('varchar', { length: 255 })
  companyId!: string

  @Column('enum', { enum: Object.keys(INVENTORY_DOCUMENT_TYPE_LABELS) })
  documentType!: InventoryDocumentType

  @Column('enum', { enum: Object.keys(INVENTORY_TRANSACTION_REASON_LABELS) })
  transactionReason!: InventoryTransactionReason

  @Column('enum', { enum: Object.keys(INVENTORY_DOCUMENT_STATUS_LABELS) })
  status!: InventoryDocumentStatus

  @Column('varchar', { length: 255 })
  warehouseId!: string

  @Column('varchar', { length: 255, nullable: true })
  relatedWarehouseId!: string | null

  @Column('varchar', { length: 255, nullable: true })
  relatedDocumentId!: string | null

  @Column('varchar', { length: 255, nullable: true })
  purchaseRequestId!: string | null

  @Column('varchar', { length: 255, nullable: true })
  purchaseOrderId!: string | null

  @Column('date')
  documentDate!: string

  @Column('date', { nullable: true })
  expectedDeliveryDate!: string | null

  @Column('timestamptz', { nullable: true })
  shippedAt!: Date | null

  @Column('varchar', { length: 255, nullable: true })
  shippedBy!: string | null

  @Column('timestamptz', { nullable: true })
  receivedAt!: Date | null

  @Column('varchar', { length: 255, nullable: true })
  receivedBy!: string | null

  @OneToMany(() => InventoryDocumentItemEntity, (item) => item.parent)
  items!: Relation<InventoryDocumentItemEntity[]>

  @ManyToOne(() => WarehouseEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'warehouseId', referencedColumnName: 'id' }])
  warehouse!: Relation<WarehouseEntity>

  @ManyToOne(() => WarehouseEntity, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'relatedWarehouseId', referencedColumnName: 'id' }])
  relatedWarehouse!: Relation<WarehouseEntity> | null

  @ManyToOne(() => PurchaseRequestEntity, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'purchaseRequestId', referencedColumnName: 'id' }])
  purchaseRequest!: Relation<PurchaseRequestEntity> | null

  @ManyToOne(() => PurchaseOrderEntity, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'purchaseOrderId', referencedColumnName: 'id' }])
  purchaseOrder!: Relation<PurchaseOrderEntity> | null
}

@Entity('inventory_document_item')
export class InventoryDocumentItemEntity {
  @PrimaryColumn('varchar', { length: 255 })
  documentId!: string

  @PrimaryColumn('varchar', { length: 255 })
  companyId!: string

  @PrimaryColumn('varchar', { length: 255 })
  id!: string

  @Column('varchar', { length: 255 })
  materialId!: string

  @Column('varchar', { length: 255, nullable: true })
  purchaseRequestItemId!: string | null

  @Column('varchar', { length: 255, nullable: true })
  purchaseOrderItemId!: string | null

  @Column('numeric', { precision: 20, scale: 6 })
  quantity!: string

  @Column('numeric', { precision: 20, scale: 6 })
  shippedQuantity!: string

  @Column('numeric', { precision: 20, scale: 6 })
  receivedQuantity!: string

  @Column('numeric', { precision: 20, scale: 6, nullable: true })
  unitCost!: string | null

  @ManyToOne(() => InventoryDocumentEntity, (parent) => parent.items, { onDelete: 'RESTRICT', nullable: false })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'documentId', referencedColumnName: 'id' }])
  parent!: Relation<InventoryDocumentEntity>

  @ManyToOne(() => MaterialEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'materialId', referencedColumnName: 'id' }])
  material!: Relation<MaterialEntity>
}

@Entity('inventory_balance')
export class InventoryBalanceEntity {
  @PrimaryColumn('varchar', { length: 255 })
  companyId!: string

  @PrimaryColumn('varchar', { length: 255 })
  warehouseId!: string

  @PrimaryColumn('varchar', { length: 255 })
  materialId!: string

  @Column('numeric', { precision: 20, scale: 6 })
  quantity!: string

  @Column('numeric', { precision: 20, scale: 6 })
  amount!: string

  @Column('numeric', { precision: 20, scale: 6 })
  reservedQuantity!: string

  @Column('numeric', { precision: 20, scale: 6 })
  availableQuantity!: string

  @Column('timestamptz')
  updatedAt!: Date

  @ManyToOne(() => WarehouseEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'warehouseId', referencedColumnName: 'id' }])
  warehouse!: Relation<WarehouseEntity>

  @ManyToOne(() => MaterialEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'materialId', referencedColumnName: 'id' }])
  material!: Relation<MaterialEntity>
}

@Entity('inventory_ledger_entry')
@Check("\"referenceType\" <> 'work-order' OR \"referenceSiteId\" IS NOT NULL")
export class InventoryLedgerEntryEntity {
  @PrimaryColumn('varchar', { length: 255 })
  id!: string

  @PrimaryColumn('varchar', { length: 255 })
  companyId!: string

  @PrimaryColumn('varchar', { length: 255 })
  warehouseId!: string

  @Column('varchar', { length: 255 })
  materialId!: string

  @Column('enum', { enum: Object.keys(INVENTORY_TRANSACTION_TYPE_LABELS) })
  transactionType!: InventoryTransactionType

  @Column('enum', { enum: Object.keys(INVENTORY_TRANSACTION_REASON_LABELS) })
  transactionReason!: InventoryTransactionReason

  @Column('numeric', { precision: 20, scale: 6 })
  quantity!: string

  @Column('numeric', { precision: 20, scale: 6 })
  amount!: string

  @Column('numeric', { precision: 20, scale: 6, nullable: true })
  unitCost!: string | null

  @Column('varchar', { length: 255, nullable: true })
  counterpartyWarehouseId!: string | null

  @Column('varchar', { length: 255, nullable: true })
  documentId!: string | null

  @Column('varchar', { length: 255, nullable: true })
  documentItemId!: string | null

  @Column('enum', { enum: Object.keys(INVENTORY_REFERENCE_LABELS) })
  referenceType!: InventoryReferenceType

  @Column('varchar', { length: 255 })
  referenceId!: string

  @Column('varchar', { length: 255, nullable: true })
  referenceItemId!: string | null

  @Column('varchar', { length: 255, nullable: true })
  referenceSiteId!: string | null

  @ManyToOne(() => SiteEntity, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'referenceSiteId', referencedColumnName: 'id' }])
  referenceSite!: Relation<SiteEntity> | null

  @Column('timestamptz')
  occurredAt!: Date

  @Column('varchar', { length: 255, nullable: true })
  transferGroupId!: string | null

  @Column('varchar', { length: 255 })
  createdBy!: string

  @Column('timestamptz')
  createdAt!: Date

  @ManyToOne(() => WarehouseEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'warehouseId', referencedColumnName: 'id' }])
  warehouse!: Relation<WarehouseEntity>

  @ManyToOne(() => MaterialEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'materialId', referencedColumnName: 'id' }])
  material!: Relation<MaterialEntity>

  @ManyToOne(() => WarehouseEntity, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'counterpartyWarehouseId', referencedColumnName: 'id' }])
  counterpartyWarehouse!: Relation<WarehouseEntity> | null

  @ManyToOne(() => InventoryDocumentEntity, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'documentId', referencedColumnName: 'id' }])
  document!: Relation<InventoryDocumentEntity> | null
}

@Entity('inventory_closing_period')
@Unique(['companyId', 'warehouseId', 'yearMonth'])
export class InventoryClosingPeriodEntity extends AuditedEntity {
  @PrimaryColumn('varchar', { length: 255 })
  companyId!: string

  @PrimaryColumn('varchar', { length: 255 })
  warehouseId!: string

  @PrimaryColumn('varchar', { length: 6 })
  yearMonth!: string

  @Column('enum', { enum: Object.keys(INVENTORY_CLOSING_STATUS_LABELS) })
  status!: InventoryClosingStatus

  @Column('timestamptz', { nullable: true })
  closedAt!: Date | null

  @Column('varchar', { length: 255, nullable: true })
  closedBy!: string | null

  @ManyToOne(() => WarehouseEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'warehouseId', referencedColumnName: 'id' }])
  warehouse!: Relation<WarehouseEntity>
}

@Entity('inventory_closing_balance')
export class InventoryClosingBalanceEntity {
  @PrimaryColumn('varchar', { length: 255 })
  companyId!: string

  @PrimaryColumn('varchar', { length: 255 })
  warehouseId!: string

  @PrimaryColumn('varchar', { length: 6 })
  yearMonth!: string

  @PrimaryColumn('varchar', { length: 255 })
  materialId!: string

  @Column('numeric', { precision: 20, scale: 6 })
  openingQuantity!: string

  @Column('numeric', { precision: 20, scale: 6 })
  openingAmount!: string

  @Column('numeric', { precision: 20, scale: 6 })
  receiptQuantity!: string

  @Column('numeric', { precision: 20, scale: 6 })
  receiptAmount!: string

  @Column('numeric', { precision: 20, scale: 6 })
  issueQuantity!: string

  @Column('numeric', { precision: 20, scale: 6 })
  issueAmount!: string

  @Column('numeric', { precision: 20, scale: 6 })
  transferInQuantity!: string

  @Column('numeric', { precision: 20, scale: 6 })
  transferInAmount!: string

  @Column('numeric', { precision: 20, scale: 6 })
  transferOutQuantity!: string

  @Column('numeric', { precision: 20, scale: 6 })
  transferOutAmount!: string

  @Column('numeric', { precision: 20, scale: 6 })
  adjustmentQuantity!: string

  @Column('numeric', { precision: 20, scale: 6 })
  adjustmentAmount!: string

  @Column('numeric', { precision: 20, scale: 6 })
  closingQuantity!: string

  @Column('numeric', { precision: 20, scale: 6 })
  closingAmount!: string

  @ManyToOne(() => WarehouseEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'warehouseId', referencedColumnName: 'id' }])
  warehouse!: Relation<WarehouseEntity>

  @ManyToOne(() => MaterialEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'materialId', referencedColumnName: 'id' }])
  material!: Relation<MaterialEntity>

  @ManyToOne(() => InventoryClosingPeriodEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'warehouseId', referencedColumnName: 'warehouseId' }, { name: 'yearMonth', referencedColumnName: 'yearMonth' }])
  closingPeriod!: Relation<InventoryClosingPeriodEntity>
}
