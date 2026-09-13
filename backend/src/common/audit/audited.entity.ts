import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

/** 사용자는 요청 DTO가 아닌 인증 컨텍스트에서 서비스가 설정합니다. */
export abstract class AuditedEntity {
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date

  @Column('varchar', { length: 255 })
  createdBy!: string

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date

  @Column('varchar', { length: 255 })
  updatedBy!: string
}
