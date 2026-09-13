import { SiteEntity } from '../../org/entities/organization.entity'
import { AuditedEntity } from '../../../common/audit/audited.entity'
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm'
import type { Relation } from 'typeorm'
import { CodeItemEntity } from '../../code/entities/common-code.entity'

@Entity('material')
export class MaterialEntity extends AuditedEntity {
  @PrimaryColumn('varchar', { length: 255 })
  id!: string

  @PrimaryColumn('varchar', { length: 255 })
  companyId!: string

  @Column('varchar', { length: 255 })
  siteId!: string

  @Column('varchar', { length: 255 })
  name!: string

  @Column('varchar', { length: 255 })
  type!: string

  @Column('varchar', { length: 255 })
  code!: string

  @Column('varchar', { length: 255 })
  specification!: string

  @Column('varchar', { length: 255 })
  unit!: string

  @Column('varchar', { length: 255 })
  maker!: string

  @Column('varchar', { length: 255 })
  model!: string

  @Column('numeric', { precision: 20, scale: 6 })
  standardPrice!: string

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
