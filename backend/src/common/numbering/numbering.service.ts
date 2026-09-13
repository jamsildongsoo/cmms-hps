import { Injectable } from '@nestjs/common'
import type { EntityManager } from 'typeorm'
import { AppException } from '../exception/app.exception'
import { ERROR_CODE } from '../exception/error-code'
import { DocumentSequenceEntity } from './entities/sequence.entity'
import type { NextDocumentNumberRequest } from './numbering.types'

@Injectable()
export class NumberingService {
  /** 업무 문서 저장과 동일한 PostgreSQL transaction 안에서만 호출합니다. */
  async nextInTransaction(manager: EntityManager, request: NextDocumentNumberRequest): Promise<string> {
    if (!manager.queryRunner?.isTransactionActive) {
      throw new Error('NumberingService.nextInTransaction must run inside a transaction')
    }

    const companyId = request.companyId.trim()
    if (!companyId) throw new Error('companyId is required')
    const yearMonth = request.yearMonth ?? this.currentYearMonth()
    if (!/^\d{6}$/.test(yearMonth)) throw new Error('yearMonth must be YYYYMM')

    // 행이 없을 때는 PK 충돌로 동시 생성 경쟁을 해결합니다.
    await manager
      .createQueryBuilder()
      .insert()
      .into(DocumentSequenceEntity)
      .values({ companyId, module: request.module, yearMonth, lastNumber: 0 })
      .orIgnore()
      .execute()

    const sequence = await manager
      .getRepository(DocumentSequenceEntity)
      .createQueryBuilder('sequence')
      .where('sequence.companyId = :companyId', { companyId })
      .andWhere('sequence.module = :module', { module: request.module })
      .andWhere('sequence.yearMonth = :yearMonth', { yearMonth })
      .setLock('pessimistic_write') // PostgreSQL: SELECT ... FOR UPDATE
      .getOne()

    if (!sequence) throw new Error('document sequence row was not created')
    if (sequence.lastNumber >= 99_999) {
      throw new AppException(ERROR_CODE.NUMBER_LIMIT_EXCEEDED, 409, '월별 문서번호 발급 한도를 초과했습니다.')
    }

    sequence.lastNumber += 1
    await manager.save(sequence)
    return `${companyId}-${request.module}-${yearMonth}-${String(sequence.lastNumber).padStart(5, '0')}`
  }

  private currentYearMonth(): string {
    const now = new Date()
    return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`
  }
}
