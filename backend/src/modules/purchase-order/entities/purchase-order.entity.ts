import { PurchaseRequestEntity } from '../../purchase-request/entities/purchase-request.entity'
import { WarehouseEntity, UserEntity, SiteEntity, DeptEntity } from '../../org/entities/organization.entity'
import { MaterialEntity } from '../../material/entities/material.entity'
import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm'
import type { Relation } from 'typeorm'
import { PURCHASE_ORDER_STATUS_LABELS } from '../../../../../shared/domain-codes'
import type { PurchaseOrderStatus } from '../../../../../shared/domain-codes'
import { AuditedEntity } from '../../../common/audit/audited.entity'

@Entity('purchase_order')
export class PurchaseOrderEntity extends AuditedEntity {
  @PrimaryColumn('varchar', { length: 255 })
  id!: string

  @PrimaryColumn('varchar', { length: 255 })
  companyId!: string

  @Column('varchar', { length: 255 })
  siteId!: string

  @Column('varchar', { length: 255 })
  deptId!: string

  @Column('varchar', { length: 255 })
  warehouseId!: string

  @Column('varchar', { length: 255 })
  purchaserId!: string

  @Column('varchar', { length: 255, nullable: true })
  purchaseRequestId!: string | null

  @Column('varchar', { length: 255 })
  vendorId!: string

  @Column('date')
  orderDate!: string

  @Column('date')
  expectedDeliveryDate!: string

  @Column('varchar', { length: 255 })
  name!: string

  @Column('text')
  remarks!: string

  @Column('enum', { enum: Object.keys(PURCHASE_ORDER_STATUS_LABELS) })
  status!: PurchaseOrderStatus

  @Column('varchar', { length: 1, default: 'N' })
  deleteYN!: string

  @OneToMany(() => PurchaseOrderItemEntity, (child) => child.parent)
  items!: Relation<PurchaseOrderItemEntity[]>

  @ManyToOne(() => SiteEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'siteId', referencedColumnName: 'id' }])
  site!: Relation<SiteEntity>

  @ManyToOne(() => DeptEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'deptId', referencedColumnName: 'id' }])
  dept!: Relation<DeptEntity>

  @ManyToOne(() => WarehouseEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'warehouseId', referencedColumnName: 'id' }])
  warehouse!: Relation<WarehouseEntity>

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'purchaserId', referencedColumnName: 'id' }])
  purchaser!: Relation<UserEntity>

  @ManyToOne(() => PurchaseRequestEntity, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'purchaseRequestId', referencedColumnName: 'id' }])
  purchaseRequest!: Relation<PurchaseRequestEntity> | null
}

@Entity('purchase_order_item')
export class PurchaseOrderItemEntity {
  @PrimaryColumn('varchar', { length: 255 })
  purchaseOrderId!: string

  @PrimaryColumn('varchar', { length: 255 })
  companyId!: string

  @PrimaryColumn('varchar', { length: 255 })
  id!: string

  @Column('varchar', { length: 255 })
  materialId!: string

  @Column('numeric', { precision: 20, scale: 6 })
  quantity!: string

  @Column('varchar', { length: 255 })
  unit!: string

  @Column('numeric', { precision: 20, scale: 6 })
  unitPrice!: string

  @Column('numeric', { precision: 20, scale: 6 })
  amount!: string

  @Column('date')
  expectedDeliveryDate!: string

  @ManyToOne(() => PurchaseOrderEntity, (parent) => parent.items, { onDelete: 'RESTRICT', nullable: false })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'purchaseOrderId', referencedColumnName: 'id' }])
  parent!: Relation<PurchaseOrderEntity>

  @ManyToOne(() => MaterialEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'materialId', referencedColumnName: 'id' }])
  material!: Relation<MaterialEntity>
}
