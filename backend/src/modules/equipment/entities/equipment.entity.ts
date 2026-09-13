import { SiteEntity } from '../../org/entities/organization.entity'
import { AuditedEntity } from '../../../common/audit/audited.entity'
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm'
import type { Relation } from 'typeorm'
import { CodeItemEntity } from '../../code/entities/common-code.entity'

@Entity('equipment')
export class EquipmentEntity extends AuditedEntity {
  @PrimaryColumn('varchar', { length: 255 })
  id!: string

  @PrimaryColumn('varchar', { length: 255 })
  companyId!: string

  @Column('varchar', { length: 255 })
  siteId!: string

  @Column('varchar', { length: 255 })
  name!: string

  @Column('varchar', { length: 255 })
  location!: string

  @Column('varchar', { length: 25 })
  type!: string

  @Column('varchar', { length: 255 })
  code!: string

  @Column('date')
  installedAt!: string

  @Column('varchar', { length: 255 })
  maker!: string

  @Column('varchar', { length: 255 })
  model!: string

  @Column('varchar', { length: 255 })
  specification!: string

  @Column('varchar', { length: 255 })
  serialNumber!: string

  @Column('varchar', { length: 255 })
  permitRequired!: string

  @Column('text')
  summary!: string

  @Column('varchar', { length: 255 })
  status!: string

  @Column('varchar', { length: 1, default: 'N' })
  deleteYN!: string

  @ManyToOne(() => CodeItemEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'code', referencedColumnName: 'codeId' }, { name: 'type', referencedColumnName: 'id' }])
  typeItem!: Relation<CodeItemEntity>

  @ManyToOne(() => SiteEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'siteId', referencedColumnName: 'id' }])
  site!: Relation<SiteEntity>
}
