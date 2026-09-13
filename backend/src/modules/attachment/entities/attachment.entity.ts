import { SiteEntity } from '../../org/entities/organization.entity'
import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany, JoinColumn, Unique } from 'typeorm'
import type { Relation } from 'typeorm'
import { AuditedEntity } from '../../../common/audit/audited.entity'

@Entity('attachment')
@Unique('uq_attachment_record', ['companyId', 'module', 'recordId'])
export class AttachmentEntity extends AuditedEntity {
  @PrimaryColumn('varchar', { length: 255 })
  id!: string

  @PrimaryColumn('varchar', { length: 255 })
  companyId!: string

  @Column('varchar', { length: 255, nullable: true })
  siteId!: string | null

  /** 호출 모듈이 전달한 식별자를 그대로 저장합니다. */
  @Column('varchar', { length: 255 })
  module!: string

  @Column('varchar', { length: 255, nullable: true })
  recordId!: string | null

  @Column('varchar', { length: 1, default: 'N' })
  deleteYN!: string

  @OneToMany(() => AttachmentItemEntity, (child) => child.parent)
  items!: Relation<AttachmentItemEntity[]>

  @ManyToOne(() => SiteEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'siteId', referencedColumnName: 'id' }])
  site!: Relation<SiteEntity>
}

@Entity('attachment_item')
export class AttachmentItemEntity {
  @PrimaryColumn('varchar', { length: 255 })
  companyId!: string

  @PrimaryColumn('varchar', { length: 255 })
  attachmentId!: string

  /** 한 첨부 묶음 안에서 표시하는 파일 순번입니다. */
  @PrimaryColumn('integer')
  itemNo!: number

  @Column('varchar', { length: 255 })
  fileName!: string

  @Column('bigint')
  fileSize!: string

  @Column('varchar', { length: 255 })
  contentType!: string

  @Column('varchar', { length: 255 })
  storagePath!: string

  @ManyToOne(() => AttachmentEntity, (parent) => parent.items, { onDelete: 'RESTRICT', nullable: false })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'attachmentId', referencedColumnName: 'id' }])
  parent!: Relation<AttachmentEntity>
}
