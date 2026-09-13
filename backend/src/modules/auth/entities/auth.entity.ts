import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm'
import type { Relation } from 'typeorm'
import { AuditedEntity } from '../../../common/audit/audited.entity'
import { UserEntity } from '../../org/entities/organization.entity'

@Entity('user_auth')
export class UserAuthEntity extends AuditedEntity {
  @PrimaryColumn('varchar', { length: 255 })
  userId!: string

  @PrimaryColumn('varchar', { length: 255 })
  companyId!: string

  @Column('varchar', { length: 255 })
  loginId!: string

  @Column('varchar', { length: 255, nullable: true })
  passwordHash!: string | null

  @Column('timestamptz', { nullable: true })
  passwordChangedAt!: Date | null

  @Column('integer', { default: 0 })
  failedLoginCount!: number

  @Column('timestamptz', { nullable: true })
  lockedUntil!: Date | null

  @Column('timestamptz', { nullable: true })
  lastLoginAt!: Date | null

  @Column('boolean', { default: true })
  active!: boolean

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'userId', referencedColumnName: 'id' }])
  user!: Relation<UserEntity>
}

@Entity('auth_login_history')
export class AuthLoginHistoryEntity {
  @PrimaryColumn('varchar', { length: 255 })
  id!: string

  @Column('varchar', { length: 255 })
  companyId!: string

  @Column('varchar', { length: 255, nullable: true })
  userId!: string | null

  @Column('varchar', { length: 255 })
  loginId!: string

  @Column('varchar', { length: 255 })
  result!: string

  @Column('varchar', { length: 255, nullable: true })
  failureReason!: string | null

  @Column('timestamptz')
  occurredAt!: Date

  @Column('varchar', { length: 45, nullable: true })
  ipAddress!: string | null

  @Column('varchar', { length: 1000, nullable: true })
  userAgent!: string | null

  @Column('varchar', { length: 255, nullable: true })
  sessionId!: string | null

  @Column('timestamptz')
  createdAt!: Date

  @Column('varchar', { length: 255 })
  createdBy!: string
}

@Entity('auth_session')
export class AuthSessionEntity {
  @PrimaryColumn('varchar', { length: 255 })
  id!: string

  @Column('varchar', { length: 255 })
  companyId!: string

  @Column('varchar', { length: 255 })
  userId!: string

  @Column('varchar', { length: 255 })
  refreshTokenHash!: string

  @Column('timestamptz')
  issuedAt!: Date

  @Column('timestamptz')
  expiresAt!: Date

  @Column('timestamptz', { nullable: true })
  lastUsedAt!: Date | null

  @Column('timestamptz', { nullable: true })
  revokedAt!: Date | null

  @Column('varchar', { length: 45, nullable: true })
  ipAddress!: string | null

  @Column('varchar', { length: 1000, nullable: true })
  userAgent!: string | null

  @Column('timestamptz')
  createdAt!: Date

  @Column('varchar', { length: 255 })
  createdBy!: string
}
