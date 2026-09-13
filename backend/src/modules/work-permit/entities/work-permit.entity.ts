import { SiteEntity, DeptEntity } from '../../org/entities/organization.entity'
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm'
import type { Relation } from 'typeorm'
import type { SupplementType } from '../../../../../shared/domain-codes'
import { AuditedEntity } from '../../../common/audit/audited.entity'
import { CodeItemEntity } from '../../code/entities/common-code.entity'

@Entity('work_permit')
export class WorkPermitEntity extends AuditedEntity {
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
  type!: string

  @Column('varchar', { length: 255 })
  code!: string

  @Column('varchar', { length: 255 })
  workerId!: string

  @Column('varchar', { length: 255 })
  supervisorId!: string

  @Column('varchar', { length: 255 })
  workPlace!: string

  @Column('timestamptz')
  permitFrom!: Date

  @Column('timestamptz')
  permitTo!: Date

  @Column('text')
  summary!: string

  @Column('jsonb')
  safetyActionRequirements!: Array<{ label: string; checked: boolean }>

  @Column('text')
  specialRequirements!: string

  @Column('text')
  safetyReviewOpinion!: string

  @Column('jsonb')
  gasInspections!: Array<{ gasName: string; gasMeter: string; result: string; checkedAt: string }>

  @Column('varchar', { length: 255 })
  gasMeasurer!: string

  @Column('varchar', { length: 255 })
  gasConfirmer!: string

  @Column('varchar', { length: 255 })
  safetyCheckWitness!: string

  @Column('varchar', { length: 255 })
  safetyCheckWorker!: string

  @Column('varchar', { length: 255 })
  completionWitness!: string

  @Column('varchar', { length: 255 })
  completionWorker!: string

  @Column('varchar', { length: 255 })
  issuer!: string

  @Column('varchar', { length: 255 })
  approver!: string

  @Column('jsonb')
  permitRequired!: SupplementType[]

  @Column('jsonb')
  supplementDetails!: Partial<Record<SupplementType, string>>

  @Column('varchar', { length: 255 })
  status!: string

  @ManyToOne(() => SiteEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'siteId', referencedColumnName: 'id' }])
  site!: Relation<SiteEntity>

  @ManyToOne(() => DeptEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'deptId', referencedColumnName: 'id' }])
  dept!: Relation<DeptEntity>

  @ManyToOne(() => CodeItemEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'code', referencedColumnName: 'codeId' }, { name: 'type', referencedColumnName: 'id' }])
  typeItem!: Relation<CodeItemEntity>
}
