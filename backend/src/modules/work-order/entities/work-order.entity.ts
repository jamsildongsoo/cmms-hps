import { UserEntity, SiteEntity, DeptEntity } from '../../org/entities/organization.entity'
import { EquipmentEntity } from '../../equipment/entities/equipment.entity'
import { AuditedEntity } from '../../../common/audit/audited.entity'
import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm'
import type { Relation } from 'typeorm'
import { WORK_ORDER_PHASE_TYPE_LABELS } from '../../../../../shared/domain-codes'
import type { WorkOrderPhaseType } from '../../../../../shared/domain-codes'
import { CodeItemEntity } from '../../code/entities/common-code.entity'

@Entity('work_order')
export class WorkOrderEntity extends AuditedEntity {
  @PrimaryColumn('varchar', { length: 255 })
  id!: string

  @PrimaryColumn('varchar', { length: 255 })
  companyId!: string

  @PrimaryColumn('varchar', { length: 255 })
  siteId!: string

  @Column('varchar', { length: 255 })
  deptId!: string

  @Column('varchar', { length: 255 })
  name!: string

  @Column('varchar', { length: 255 })
  equipmentId!: string

  @Column('varchar', { length: 255 })
  type!: string

  @Column('varchar', { length: 255 })
  code!: string

  @Column('varchar', { length: 255 })
  priority!: string

  @Column('boolean')
  permitRequired!: boolean

  @Column('varchar', { length: 255 })
  status!: string

  @Column('varchar', { length: 1, default: 'N' })
  deleteYN!: string

  @OneToMany(() => WorkOrderPhaseEntity, (child) => child.parent)
  phases!: Relation<WorkOrderPhaseEntity[]>

  @OneToMany(() => WorkOrderItemEntity, (child) => child.parent)
  items!: Relation<WorkOrderItemEntity[]>

  @ManyToOne(() => CodeItemEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'code', referencedColumnName: 'codeId' }, { name: 'type', referencedColumnName: 'id' }])
  typeItem!: Relation<CodeItemEntity>

  @ManyToOne(() => SiteEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'siteId', referencedColumnName: 'id' }])
  site!: Relation<SiteEntity>

  @ManyToOne(() => EquipmentEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'equipmentId', referencedColumnName: 'id' }])
  equipment!: Relation<EquipmentEntity>

  @ManyToOne(() => DeptEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'deptId', referencedColumnName: 'id' }])
  dept!: Relation<DeptEntity>
}

@Entity('work_order_phase')
export class WorkOrderPhaseEntity {
  @PrimaryColumn('varchar', { length: 255 })
  workOrderId!: string

  @PrimaryColumn('varchar', { length: 255 })
  siteId!: string

  @PrimaryColumn('varchar', { length: 255 })
  companyId!: string

  @PrimaryColumn('enum', { enum: Object.keys(WORK_ORDER_PHASE_TYPE_LABELS) })
  phase!: WorkOrderPhaseType

  @Column('date')
  date!: string

  @Column('varchar', { length: 255 })
  workerId!: string

  @Column('numeric', { precision: 20, scale: 6 })
  manHours!: string

  @Column('varchar', { length: 255 })
  manHoursUnit!: string

  @Column('numeric', { precision: 20, scale: 6 })
  cost!: string

  @Column('text')
  summary!: string

  @ManyToOne(() => WorkOrderEntity, (parent) => parent.phases, { onDelete: 'RESTRICT', nullable: false })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'siteId', referencedColumnName: 'siteId' }, { name: 'workOrderId', referencedColumnName: 'id' }])
  parent!: Relation<WorkOrderEntity>

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'workerId', referencedColumnName: 'id' }])
  worker!: Relation<UserEntity>
}

@Entity('work_order_item')
export class WorkOrderItemEntity {
  @PrimaryColumn('varchar', { length: 255 })
  workOrderId!: string

  @PrimaryColumn('varchar', { length: 255 })
  siteId!: string

  @PrimaryColumn('varchar', { length: 255 })
  companyId!: string

  @PrimaryColumn('varchar', { length: 255 })
  id!: string

  @Column('varchar', { length: 255 })
  name!: string

  @Column('varchar', { length: 255 })
  method!: string

  @Column('varchar', { length: 255 })
  result!: string

  @ManyToOne(() => WorkOrderEntity, (parent) => parent.items, { onDelete: 'RESTRICT', nullable: false })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'siteId', referencedColumnName: 'siteId' }, { name: 'workOrderId', referencedColumnName: 'id' }])
  parent!: Relation<WorkOrderEntity>
}
