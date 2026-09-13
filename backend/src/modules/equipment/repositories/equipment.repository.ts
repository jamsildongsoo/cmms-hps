import { Injectable } from '@nestjs/common'
import type { EntityManager } from 'typeorm'
import { EquipmentEntity } from '../entities/equipment.entity'
import type { EquipmentSearchType } from '../dto/equipment.dto'

@Injectable()
export class EquipmentRepository {
  findAll(manager: EntityManager, companyId: string, page: number, pageSize: number, searchType?: EquipmentSearchType, searchValue?: string): Promise<[EquipmentEntity[], number]> {
    const query = manager.getRepository(EquipmentEntity)
      .createQueryBuilder('equipment')
      .innerJoinAndSelect('equipment.site', 'site')
      .innerJoinAndSelect('site.company', 'company')
      .innerJoinAndSelect('equipment.typeItem', 'typeItem')
      .where('equipment.companyId = :companyId', { companyId })
      .andWhere('equipment.deleteYN = :deleteYN', { deleteYN: 'N' })
      .orderBy('equipment.id', 'ASC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
    if (searchType && searchValue) {
      const column = searchType === 'id' ? 'equipment.id' : 'equipment.name'
      query.andWhere(`${column} ILIKE :searchValue`, { searchValue: `%${searchValue}%` })
    }
    return query.getManyAndCount()
  }

  findOne(manager: EntityManager, companyId: string, id: string): Promise<EquipmentEntity | null> {
    return manager.getRepository(EquipmentEntity)
      .createQueryBuilder('equipment')
      .innerJoinAndSelect('equipment.site', 'site')
      .innerJoinAndSelect('site.company', 'company')
      .innerJoinAndSelect('equipment.typeItem', 'typeItem')
      .where('equipment.companyId = :companyId', { companyId })
      .andWhere('equipment.id = :id', { id })
      .andWhere('equipment.deleteYN = :deleteYN', { deleteYN: 'N' })
      .getOne()
  }

  save(manager: EntityManager, entity: EquipmentEntity): Promise<EquipmentEntity> {
    return manager.save(entity)
  }
}
