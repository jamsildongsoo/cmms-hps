import { UserEntity } from '../../org/entities/organization.entity'
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm'
import type { Relation } from 'typeorm'
import { AuditedEntity } from '../../../common/audit/audited.entity'

@Entity('board_post')
export class BoardPostEntity extends AuditedEntity {
  @PrimaryColumn('varchar', { length: 255 })
  id!: string

  @PrimaryColumn('varchar', { length: 255 })
  companyId!: string

  @Column('varchar', { length: 255 })
  title!: string

  @Column('text')
  content!: string

  @Column('varchar', { length: 255 })
  authorId!: string

  @Column('varchar', { length: 255 })
  authorName!: string

  @Column('integer')
  viewCount!: number

  @Column('varchar', { length: 1, default: 'N' })
  deleteYN!: string

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'companyId' }, { name: 'authorId', referencedColumnName: 'id' }])
  author!: Relation<UserEntity>
}
