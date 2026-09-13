import { Injectable } from '@nestjs/common'
import type { EntityManager } from 'typeorm'
import { CodeEntity, CodeItemEntity } from '../entities/common-code.entity'

@Injectable()
export class CodeRepository {
  findCodes(manager: EntityManager, companyId: string): Promise<CodeEntity[]> {
    const query = manager.getRepository(CodeEntity).createQueryBuilder('code')
      .where('code.companyId = :companyId', { companyId })
    return query.andWhere('code.deleteYN = :deleteYN', { deleteYN: 'N' })
      .orderBy('code.id', 'ASC')
      .getMany()
  }

  findCode(manager: EntityManager, companyId: string, id: string, includeDeleted = false): Promise<CodeEntity | null> {
    const query = manager.getRepository(CodeEntity).createQueryBuilder('code')
      .where('code.companyId = :companyId', { companyId })
      .andWhere('code.id = :id', { id })
    if (!includeDeleted) query.andWhere('code.deleteYN = :deleteYN', { deleteYN: 'N' })
    return query.getOne()
  }

  findItems(manager: EntityManager, companyId: string, codeId: string): Promise<CodeItemEntity[]> {
    const query = manager.getRepository(CodeItemEntity).createQueryBuilder('item')
      .where('item.companyId = :companyId', { companyId })
      .andWhere('item.codeId = :codeId', { codeId })
    return query.orderBy('item.sortOrder', 'ASC')
      .addOrderBy('item.id', 'ASC')
      .getMany()
  }

  findItem(manager: EntityManager, companyId: string, codeId: string, id: string): Promise<CodeItemEntity | null> {
    return manager.getRepository(CodeItemEntity).findOneBy({ companyId, codeId, id })
  }

  saveCode(manager: EntityManager, entity: CodeEntity): Promise<CodeEntity> {
    return manager.save(entity)
  }

  saveItem(manager: EntityManager, entity: CodeItemEntity): Promise<CodeItemEntity> {
    return manager.save(entity)
  }

  removeItem(manager: EntityManager, entity: CodeItemEntity): Promise<CodeItemEntity> {
    return manager.remove(entity)
  }
}
