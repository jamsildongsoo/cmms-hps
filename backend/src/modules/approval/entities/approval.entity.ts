import { SiteEntity, UserEntity } from '../../org/entities/organization.entity'
import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany, JoinColumn, Check } from 'typeorm'
import type { Relation } from 'typeorm'
import { APPROVAL_PARTICIPANTS_ACTION, APPROVAL_PARTICIPANT_STATUS, APPROVAL_STATUS, MODULE_CODE } from '../../../../../shared/domain-codes'
import type {
  ApprovalParticipantStatus,
  ApprovalParticipantsAction,
  ApprovalStatus,
  ModuleCode,
} from '../../../../../shared/domain-codes'
import { AuditedEntity } from '../../../common/audit/audited.entity'

@Entity('approval')
@Check("\"module\" NOT IN ('work-order-plan', 'work-order-result', 'work-permit') OR \"recordSiteId\" IS NOT NULL")
export class ApprovalEntity extends AuditedEntity {
  @PrimaryColumn('varchar', { length: 255 })
  id!: string

  @PrimaryColumn('varchar', { length: 255 })
  companyId!: string

  /** 대상 업무 모듈 코드. 단독 결재는 GEN을 사용합니다. */
  @Column('enum', { enum: Object.values(MODULE_CODE) })
  module!: ModuleCode

  @Column('varchar', { length: 255, nullable: true })
  recordId!: string | null

  /** 원 업무의 사업장 범위가 필요한 연계 결재에서 사용하는 선택 필드입니다. */
  @Column('varchar', { length: 255, nullable: true })
  recordSiteId!: string | null

  @Column('enum', { enum: Object.values(APPROVAL_STATUS) })
  status!: ApprovalStatus

  @Column('varchar', { length: 255 })
  requesterId!: string

  @Column('varchar', { length: 255 })
  title!: string

  @Column('text', { nullable: true })
  content!: string | null

  @Column('timestamptz', { nullable: true })
  requestedAt!: Date | null

  @Column('timestamptz', { nullable: true })
  completedAt!: Date | null

  @Column('integer', { default: 0 })
  currentStep!: number

  @Column('integer', { default: 0 })
  totalSteps!: number

  @OneToMany(() => ApprovalParticipantEntity, (child) => child.parent)
  participants!: Relation<ApprovalParticipantEntity[]>

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'requesterId', referencedColumnName: 'id' }])
  requester!: Relation<UserEntity>
}

@Entity('approval_participant')
@Check('"sequenceNo" >= 0')
export class ApprovalParticipantEntity {
  @PrimaryColumn('varchar', { length: 255 })
  id!: string

  @PrimaryColumn('varchar', { length: 255 })
  companyId!: string

  @PrimaryColumn('integer')
  sequenceNo!: number

  @Column('varchar', { length: 255 })
  userId!: string

  @Column('varchar', { length: 255 }) //결재 당시 이름의 스냅샷 용도로 별도 보존함
  userName!: string

  @Column('varchar', { length: 255 }) //결재 당시 부서명의 스냅샷 용도로 별도 보존함
  deptName!: string

  @Column('varchar', { length: 255 })
  title!: string

  @Column('enum', { enum: Object.values(APPROVAL_PARTICIPANTS_ACTION) })
  actionCode!: ApprovalParticipantsAction

  @Column('enum', { enum: Object.values(APPROVAL_PARTICIPANT_STATUS) })
  status!: ApprovalParticipantStatus

  @Column('timestamptz', { nullable: true })
  processedAt!: Date | null

  @Column('text', { nullable: true })
  comment!: string | null

  @ManyToOne(() => ApprovalEntity, (parent) => parent.participants, { onDelete: 'RESTRICT', nullable: false })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'id', referencedColumnName: 'id' }])
  parent!: Relation<ApprovalEntity>

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'userId', referencedColumnName: 'id' }])
  user!: Relation<UserEntity>
}
