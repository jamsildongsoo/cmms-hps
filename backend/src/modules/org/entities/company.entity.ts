import { Column, Entity, PrimaryColumn } from 'typeorm'
import { AuditedEntity } from '../../../common/audit/audited.entity'

@Entity('company')
export class CompanyEntity extends AuditedEntity {
  @PrimaryColumn('varchar', { length: 255 })
  id!: string

  @Column('varchar', { length: 255 })
  name!: string

  @Column('varchar', { length: 1, default: 'N' })
  deleteYN!: string
}
