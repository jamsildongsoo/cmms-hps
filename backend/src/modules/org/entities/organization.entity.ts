import { CompanyEntity } from './company.entity'
import { AuditedEntity } from '../../../common/audit/audited.entity'
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm'
import type { Relation } from 'typeorm'
import { USER_ROLE_LABELS, USER_SCOPE_LEVEL_LABELS } from '../../../../../shared/domain-codes'
import type { UserRole, UserPermission, UserScopeLevel } from '../../../../../shared/domain-codes'

@Entity('site')
export class SiteEntity extends AuditedEntity {
  @PrimaryColumn('varchar', { length: 255 })
  id!: string

  @PrimaryColumn('varchar', { length: 255 })
  companyId!: string

  @Column('varchar', { length: 255 })
  name!: string

  @Column('varchar', { length: 1, default: 'N' })
  deleteYN!: string

  @ManyToOne(() => CompanyEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'id' }])
  company!: Relation<CompanyEntity>
}

@Entity('dept')
export class DeptEntity extends AuditedEntity {
  @PrimaryColumn('varchar', { length: 255 })
  id!: string

  @PrimaryColumn('varchar', { length: 255 })
  companyId!: string

  @Column('varchar', { length: 255 })
  siteId!: string

  @Column('varchar', { length: 255 })
  name!: string

  @Column('varchar', { length: 255, nullable: true })
  parentId!: string | null

  @Column('varchar', { length: 1, default: 'N' })
  deleteYN!: string

  @ManyToOne(() => SiteEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'siteId', referencedColumnName: 'id' }])
  site!: Relation<SiteEntity>

  @ManyToOne(() => DeptEntity, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'parentId', referencedColumnName: 'id' }])
  parentDept!: Relation<DeptEntity> | null
}

@Entity('warehouse')
export class WarehouseEntity extends AuditedEntity {
  @PrimaryColumn('varchar', { length: 255 })
  id!: string

  @PrimaryColumn('varchar', { length: 255 })
  companyId!: string

  @Column('varchar', { length: 255 })
  siteId!: string

  @Column('varchar', { length: 255 })
  name!: string

  @Column('varchar', { length: 1, default: 'N' })
  deleteYN!: string

  @ManyToOne(() => SiteEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'siteId', referencedColumnName: 'id' }])
  site!: Relation<SiteEntity>
}

@Entity('user')
export class UserEntity extends AuditedEntity {
  @PrimaryColumn('varchar', { length: 255 })
  id!: string

  @PrimaryColumn('varchar', { length: 255 })
  companyId!: string

  @Column('varchar', { length: 255 })
  deptId!: string

  @Column('varchar', { length: 255 })
  name!: string

  @Column('varchar', { length: 255 })
  email!: string

  @Column('varchar', { length: 255 })
  phone!: string

  @Column('varchar', { length: 255 })
  title!: string

  @Column('varchar', { length: 255 })
  position!: string

  @Column('varchar', { length: 255 }) // 휴직 등 
  useYN!: string

  @Column('enum', { enum: Object.keys(USER_ROLE_LABELS) })
  roleId!: UserRole

  @Column('jsonb')
  permissions!: UserPermission[]

  @Column('enum', { enum: Object.keys(USER_SCOPE_LEVEL_LABELS) })
  scopeLevel!: UserScopeLevel

  @Column('varchar', { length: 1, default: 'N' })
  deleteYN!: string

  @ManyToOne(() => DeptEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'deptId', referencedColumnName: 'id' }])
  dept!: Relation<DeptEntity>
}

// user_auth는 별도로 선언되어 있음 
