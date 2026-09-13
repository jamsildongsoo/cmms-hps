import type { Relation } from 'typeorm'
import { CompanyEntity } from '../../org/entities/company.entity'
import { AuditedEntity } from '../../../common/audit/audited.entity'
import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm'

@Entity('code')
export class CodeEntity extends AuditedEntity {
  @PrimaryColumn('varchar', { length: 255 })
  id!: string
  
  @PrimaryColumn('varchar', { length: 255 })
  companyId!: string

  @Column('varchar', { length: 255 })
  name!: string

  @Column('boolean', { default: false })  // Indicates whether this code group is a system-defined group. System code groups cannot be deleted.
  system!: boolean

  @Column('boolean', { default: true })
  active!: boolean

  @Column('varchar', { length: 1, default: 'N' })
  deleteYN!: string

  @ManyToOne(() => CompanyEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'id' }])
  company!: Relation<CompanyEntity>

}

@Entity('code_item')
export class CodeItemEntity extends AuditedEntity {
  @PrimaryColumn('varchar', { length: 255 })
  companyId!: string

  @PrimaryColumn('varchar', { length: 255 })
  codeId!: string

  @PrimaryColumn('varchar', { length: 255 })
  id!: string

  @Column('varchar', { length: 255 })
  label!: string

  @Column('integer', { default: 0 })
  sortOrder!: number

  @Column('boolean', { default: true })
  active!: boolean
  @ManyToOne(() => CodeEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'codeId', referencedColumnName: 'id' }])
  code!: Relation<CodeEntity>

  @ManyToOne(() => CompanyEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'id' }])
  company!: Relation<CompanyEntity>
}
