import { Injectable } from '@nestjs/common'
import type { EntityManager } from 'typeorm'
import { CompanyEntity } from '../entities/company.entity'
import { DeptEntity, SiteEntity, UserEntity, WarehouseEntity } from '../entities/organization.entity'

@Injectable()
export class OrgRepository {
  findCompanies(manager: EntityManager, companyId: string): Promise<CompanyEntity[]> {
    const query = manager.getRepository(CompanyEntity).createQueryBuilder('company')
      .where('company.id = :companyId', { companyId })
      .andWhere('company.deleteYN = :deleteYN', { deleteYN: 'N' })
    return query.orderBy('company.id', 'ASC').getMany()
  }

  findSites(manager: EntityManager, companyId: string): Promise<SiteEntity[]> {
    return manager.getRepository(SiteEntity).createQueryBuilder('site')
      .where('site.companyId = :companyId', { companyId })
      .andWhere('site.deleteYN = :deleteYN', { deleteYN: 'N' })
      .orderBy('site.id', 'ASC').getMany()
  }

  findDepts(manager: EntityManager, companyId: string): Promise<DeptEntity[]> {
    return manager.getRepository(DeptEntity).createQueryBuilder('dept')
      .where('dept.companyId = :companyId', { companyId })
      .andWhere('dept.deleteYN = :deleteYN', { deleteYN: 'N' })
      .orderBy('dept.siteId', 'ASC').addOrderBy('dept.id', 'ASC').getMany()
  }

  findWarehouses(manager: EntityManager, companyId: string): Promise<WarehouseEntity[]> {
    return manager.getRepository(WarehouseEntity).createQueryBuilder('warehouse')
      .where('warehouse.companyId = :companyId', { companyId })
      .andWhere('warehouse.deleteYN = :deleteYN', { deleteYN: 'N' })
      .orderBy('warehouse.siteId', 'ASC').addOrderBy('warehouse.id', 'ASC').getMany()
  }

  findUsers(manager: EntityManager, companyId: string): Promise<UserEntity[]> {
    return manager.getRepository(UserEntity).createQueryBuilder('user')
      .innerJoinAndSelect('user.dept', 'dept')
      .where('user.companyId = :companyId', { companyId })
      .andWhere('user.deleteYN = :deleteYN', { deleteYN: 'N' })
      .orderBy('user.id', 'ASC').getMany()
  }

  findCompany(manager: EntityManager, id: string): Promise<CompanyEntity | null> {
    return manager.getRepository(CompanyEntity).findOneBy({ id, deleteYN: 'N' })
  }

  findSite(manager: EntityManager, companyId: string, id: string): Promise<SiteEntity | null> {
    return manager.getRepository(SiteEntity).findOneBy({ companyId, id, deleteYN: 'N' })
  }

  findDept(manager: EntityManager, companyId: string, id: string): Promise<DeptEntity | null> {
    return manager.getRepository(DeptEntity).findOneBy({ companyId, id, deleteYN: 'N' })
  }

  findWarehouse(manager: EntityManager, companyId: string, id: string): Promise<WarehouseEntity | null> {
    return manager.getRepository(WarehouseEntity).findOneBy({ companyId, id, deleteYN: 'N' })
  }

  findUser(manager: EntityManager, companyId: string, id: string): Promise<UserEntity | null> {
    return manager.getRepository(UserEntity).createQueryBuilder('user')
      .innerJoinAndSelect('user.dept', 'dept')
      .where('user.companyId = :companyId', { companyId })
      .andWhere('user.id = :id', { id })
      .andWhere('user.deleteYN = :deleteYN', { deleteYN: 'N' })
      .getOne()
  }

  save<T extends object>(manager: EntityManager, entity: T): Promise<T> {
    return manager.save(entity)
  }
}
