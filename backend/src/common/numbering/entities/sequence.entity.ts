import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, Check } from 'typeorm'
import type { Relation } from 'typeorm'
import { MODULE_CODE } from '../../../../../shared/domain-codes'
import { CompanyEntity } from '../../../modules/org/entities/company.entity'

/** 회사·모듈·월별 업무번호의 마지막 발급 순번을 보관합니다. */
@Entity('document_sequence')
@Check('"lastNumber" >= 0 AND "lastNumber" <= 99999')
export class DocumentSequenceEntity {
  @PrimaryColumn('varchar', { length: 255 })
  companyId!: string

  /** MODULE_CODE key 자체가 번호에 사용하는 약칭입니다. 예: GEN, WO, INV */
  @PrimaryColumn('enum', { enum: Object.keys(MODULE_CODE) })
  module!: keyof typeof MODULE_CODE

  /** 업무번호용 YYYYMM. 결산의 YYYY-MM과는 별도 형식입니다. */
  @PrimaryColumn('varchar', { length: 6 })
  yearMonth!: string

  @Column('integer', { default: 0 })
  lastNumber!: number

  @ManyToOne(() => CompanyEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'id' }])
  company!: Relation<CompanyEntity>
}
