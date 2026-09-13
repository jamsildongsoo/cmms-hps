import { Injectable } from '@nestjs/common'
import type { EntityManager } from 'typeorm'
import { MaterialEntity } from '../entities/material.entity'
import type { MaterialListQuery } from '../dto/material.dto'

@Injectable()
export class MaterialRepository {
  findList(manager: EntityManager, companyId: string, page: number, pageSize: number, query: MaterialListQuery) {
    const builder = manager.getRepository(MaterialEntity).createQueryBuilder('material')
      .innerJoinAndSelect('material.site', 'site').innerJoinAndSelect('site.company', 'company').innerJoinAndSelect('material.typeItem', 'typeItem')
      .where('material.companyId = :companyId', { companyId }).andWhere('material.deleteYN = :deleteYN', { deleteYN: 'N' })
      .orderBy('material.id', 'ASC').skip((page - 1) * pageSize).take(pageSize)
    if (query.searchType && query.searchValue) builder.andWhere(`material.${query.searchType === 'id' ? 'id' : 'name'} ILIKE :searchValue`, { searchValue: `%${query.searchValue}%` })
    return builder.getManyAndCount()
  }
  findOne(manager: EntityManager, companyId: string, id: string) { return manager.getRepository(MaterialEntity).createQueryBuilder('material').innerJoinAndSelect('material.site', 'site').innerJoinAndSelect('site.company', 'company').innerJoinAndSelect('material.typeItem', 'typeItem').where('material.companyId = :companyId', { companyId }).andWhere('material.id = :id', { id }).andWhere('material.deleteYN = :deleteYN', { deleteYN: 'N' }).getOne() }
  save(manager: EntityManager, entity: MaterialEntity) { return manager.save(entity) }
}
