import { UserEntity, DeptEntity } from '../../org/entities/organization.entity'
import { EquipmentEntity } from '../../equipment/entities/equipment.entity'
import { AuditedEntity } from '../../../common/audit/audited.entity'
import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm'
import type { Relation } from 'typeorm'
import { CodeItemEntity } from '../../code/entities/common-code.entity'

@Entity('pm_record')
export class PmRecordEntity extends AuditedEntity {
  @PrimaryColumn('varchar', { length: 255 })
  id!: string

  @PrimaryColumn('varchar', { length: 255 })
  companyId!: string

  @Column('varchar', { length: 255 })
  siteId!: string

  @Column('varchar', { length: 255 })
  deptId!: string

  @Column('varchar', { length: 255 })
  name!: string

  @Column('text')
  summary!: string

  @Column('varchar', { length: 255 })
  equipmentId!: string

  @Column('varchar', { length: 255 })
  type!: string

  @Column('varchar', { length: 255 })
  code!: string

  @Column('date')
  date!: string

  @Column('varchar', { length: 255 })
  workerId!: string

  @Column('varchar', { length: 255 })
  decision!: string

  @Column('varchar', { length: 1, default: 'N' })
  deleteYN!: string

  @OneToMany(() => PmRecordItemEntity, (child) => child.parent)
  items!: Relation<PmRecordItemEntity[]>

  @ManyToOne(() => CodeItemEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'code', referencedColumnName: 'codeId' }, { name: 'type', referencedColumnName: 'id' }])
  typeItem!: Relation<CodeItemEntity>

  @ManyToOne(() => EquipmentEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'equipmentId', referencedColumnName: 'id' }])
  equipment!: Relation<EquipmentEntity>

  @ManyToOne(() => DeptEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'deptId', referencedColumnName: 'id' }])
  dept!: Relation<DeptEntity>

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'workerId', referencedColumnName: 'id' }])
  worker!: Relation<UserEntity>
}

@Entity('pm_record_item')
export class PmRecordItemEntity {
  @PrimaryColumn('varchar', { length: 255 })
  pmRecordId!: string

  @PrimaryColumn('varchar', { length: 255 })
  companyId!: string

  @PrimaryColumn('varchar', { length: 255 })
  id!: string

  @Column('varchar', { length: 255 })
  inspectionName!: string

  @Column('varchar', { length: 255 })
  inspectionMethod!: string

  @Column('varchar', { length: 255 })
  standardValue!: string

  @Column('varchar', { length: 255 })
  result!: string

  @Column('varchar', { length: 255 })
  unit!: string

  @ManyToOne(() => PmRecordEntity, (parent) => parent.items, { onDelete: 'RESTRICT', nullable: false })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'pmRecordId', referencedColumnName: 'id' }])
  parent!: Relation<PmRecordEntity>
}
