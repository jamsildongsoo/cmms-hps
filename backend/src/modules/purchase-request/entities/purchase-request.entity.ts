import { UserEntity, SiteEntity, DeptEntity } from '../../org/entities/organization.entity'
import { MaterialEntity } from '../../material/entities/material.entity'
import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm'
import type { Relation } from 'typeorm'
import { PURCHASE_REQUEST_STATUS_LABELS } from '../../../../../shared/domain-codes'
import type { PurchaseRequestStatus } from '../../../../../shared/domain-codes'
import { AuditedEntity } from '../../../common/audit/audited.entity'

@Entity('purchase_request')
export class PurchaseRequestEntity extends AuditedEntity {
  @PrimaryColumn('varchar', { length: 255 })
  id!: string

  @PrimaryColumn('varchar', { length: 255 })
  companyId!: string

  @Column('varchar', { length: 255 })
  siteId!: string

  @Column('varchar', { length: 255 })
  deptId!: string

  @Column('varchar', { length: 255 })
  requesterId!: string

  @Column('varchar', { length: 255, nullable: true })
  purchaserId!: string | null

  @Column('varchar', { length: 255 })
  name!: string

  @Column('date')
  requestDate!: string

  @Column('date')
  requiredDate!: string

  @Column('date', { nullable: true })
  expectedDeliveryDate!: string | null

  @Column('boolean')
  deliveryConfirmed!: boolean

  @Column('text')
  purpose!: string

  @Column('text')
  remarks!: string

  @Column('enum', { enum: Object.keys(PURCHASE_REQUEST_STATUS_LABELS) })
  status!: PurchaseRequestStatus

  @Column('varchar', { length: 1, default: 'N' })
  deleteYN!: string

  @OneToMany(() => PurchaseRequestItemEntity, (child) => child.parent)
  items!: Relation<PurchaseRequestItemEntity[]>

  @ManyToOne(() => SiteEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'siteId', referencedColumnName: 'id' }])
  site!: Relation<SiteEntity>

  @ManyToOne(() => DeptEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'deptId', referencedColumnName: 'id' }])
  dept!: Relation<DeptEntity>

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'requesterId', referencedColumnName: 'id' }])
  requester!: Relation<UserEntity>

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'purchaserId', referencedColumnName: 'id' }])
  purchaser!: Relation<UserEntity> | null
}

@Entity('purchase_request_item')
export class PurchaseRequestItemEntity {
  @PrimaryColumn('varchar', { length: 255 })
  purchaseRequestId!: string

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

  @Column('date')
  requiredDate!: string

  @Column('text')
  purpose!: string

  @ManyToOne(() => PurchaseRequestEntity, (parent) => parent.items, { onDelete: 'RESTRICT', nullable: false })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'purchaseRequestId', referencedColumnName: 'id' }])
  parent!: Relation<PurchaseRequestEntity>

  @ManyToOne(() => MaterialEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'materialId', referencedColumnName: 'id' }])
  material!: Relation<MaterialEntity>
}
