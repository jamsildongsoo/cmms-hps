import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import type { ActorContext } from '../../../common/context/actor-context'
import { AppException } from '../../../common/exception/app.exception'
import { ERROR_CODE } from '../../../common/exception/error-code'
import { CompanyEntity } from '../entities/company.entity'
import { DeptEntity, SiteEntity, UserEntity, WarehouseEntity } from '../entities/organization.entity'
import type { CreateCompanyDto, CreateDeptDto, CreateSiteDto, CreateUserDto, CreateWarehouseDto, OrganizationUserResponse, UpdateCompanyDto, UpdateDeptDto, UpdateSiteDto, UpdateUserDto, UpdateWarehouseDto } from '../dto/org.dto'
import { OrgRepository } from '../repositories/org.repository'

@Injectable()
export class OrgService {
  constructor(private readonly dataSource: DataSource, private readonly repository: OrgRepository) {}

  async getOrganization(actor: ActorContext) {
    const manager = this.dataSource.manager
    const [sites, depts, warehouses, users] = await Promise.all([
      this.repository.findSites(manager, actor.companyId),
      this.repository.findDepts(manager, actor.companyId),
      this.repository.findWarehouses(manager, actor.companyId),
      this.repository.findUsers(manager, actor.companyId),
    ])
    return { sites, departments: depts, warehouses, users: users.map((user) => this.userResponse(user)) }
  }

  findCompanies(actor: ActorContext) { return this.repository.findCompanies(this.dataSource.manager, actor.companyId) }
  findSites(actor: ActorContext) { return this.repository.findSites(this.dataSource.manager, actor.companyId) }
  findDepts(actor: ActorContext) { return this.repository.findDepts(this.dataSource.manager, actor.companyId) }
  findWarehouses(actor: ActorContext) { return this.repository.findWarehouses(this.dataSource.manager, actor.companyId) }
  async findUsers(actor: ActorContext) {
    const users = await this.repository.findUsers(this.dataSource.manager, actor.companyId)
    return users.map((user) => this.userResponse(user))
  }

  async createCompany(actor: ActorContext, dto: CreateCompanyDto) {
    return this.dataSource.transaction(async (manager) => this.repository.save(manager, manager.create(CompanyEntity, {
      id: this.id(dto.id, 'id'), name: this.text(dto.name, 'name'), deleteYN: 'N', createdBy: actor.userId, updatedBy: actor.userId,
    })))
  }

  async updateCompany(actor: ActorContext, id: string, dto: UpdateCompanyDto) {
    return this.dataSource.transaction(async (manager) => {
      const company = await this.requireCompany(manager, id)
      if (dto.name !== undefined) company.name = this.text(dto.name, 'name')
      company.updatedBy = actor.userId
      return this.repository.save(manager, company)
    })
  }

  async deleteCompany(actor: ActorContext, id: string) {
    return this.dataSource.transaction(async (manager) => {
      const company = await this.requireCompany(manager, id)
      company.deleteYN = 'Y'; company.updatedBy = actor.userId
      await this.repository.save(manager, company)
      return { id: company.id, deleteYN: 'Y' as const }
    })
  }

  async createSite(actor: ActorContext, dto: CreateSiteDto) {
    return this.dataSource.transaction(async (manager) => {
      await this.requireCompany(manager, actor.companyId)
      const entity = manager.create(SiteEntity, { id: this.id(dto.id, 'id'), companyId: actor.companyId, name: this.text(dto.name, 'name'), deleteYN: 'N', createdBy: actor.userId, updatedBy: actor.userId })
      return this.repository.save(manager, entity)
    })
  }

  async updateSite(actor: ActorContext, id: string, dto: UpdateSiteDto) {
    return this.dataSource.transaction(async (manager) => {
      const site = await this.requireSite(manager, actor.companyId, id)
      if (dto.name !== undefined) site.name = this.text(dto.name, 'name')
      site.updatedBy = actor.userId
      return this.repository.save(manager, site)
    })
  }

  async deleteSite(actor: ActorContext, id: string) { return this.softDelete(actor, 'site', id) }

  async createDept(actor: ActorContext, dto: CreateDeptDto) {
    return this.dataSource.transaction(async (manager) => {
      await this.requireSite(manager, actor.companyId, dto.siteId)
      if (dto.parentId) await this.requireDept(manager, actor.companyId, dto.parentId)
      const entity = manager.create(DeptEntity, { id: this.id(dto.id, 'id'), companyId: actor.companyId, siteId: this.id(dto.siteId, 'siteId'), name: this.text(dto.name, 'name'), parentId: dto.parentId ? this.id(dto.parentId, 'parentId') : null, deleteYN: 'N', createdBy: actor.userId, updatedBy: actor.userId })
      return this.repository.save(manager, entity)
    })
  }

  async updateDept(actor: ActorContext, id: string, dto: UpdateDeptDto) {
    return this.dataSource.transaction(async (manager) => {
      const dept = await this.requireDept(manager, actor.companyId, id)
      if (dto.siteId !== undefined) { await this.requireSite(manager, actor.companyId, dto.siteId); dept.siteId = this.id(dto.siteId, 'siteId') }
      if (dto.parentId !== undefined) { if (dto.parentId) await this.requireDept(manager, actor.companyId, dto.parentId); dept.parentId = dto.parentId ? this.id(dto.parentId, 'parentId') : null }
      if (dto.name !== undefined) dept.name = this.text(dto.name, 'name')
      dept.updatedBy = actor.userId
      return this.repository.save(manager, dept)
    })
  }

  async deleteDept(actor: ActorContext, id: string) { return this.softDelete(actor, 'dept', id) }

  async createWarehouse(actor: ActorContext, dto: CreateWarehouseDto) {
    return this.dataSource.transaction(async (manager) => {
      await this.requireSite(manager, actor.companyId, dto.siteId)
      const entity = manager.create(WarehouseEntity, { id: this.id(dto.id, 'id'), companyId: actor.companyId, siteId: this.id(dto.siteId, 'siteId'), name: this.text(dto.name, 'name'), deleteYN: 'N', createdBy: actor.userId, updatedBy: actor.userId })
      return this.repository.save(manager, entity)
    })
  }

  async updateWarehouse(actor: ActorContext, id: string, dto: UpdateWarehouseDto) {
    return this.dataSource.transaction(async (manager) => {
      const warehouse = await this.requireWarehouse(manager, actor.companyId, id)
      if (dto.siteId !== undefined) { await this.requireSite(manager, actor.companyId, dto.siteId); warehouse.siteId = this.id(dto.siteId, 'siteId') }
      if (dto.name !== undefined) warehouse.name = this.text(dto.name, 'name')
      warehouse.updatedBy = actor.userId
      return this.repository.save(manager, warehouse)
    })
  }

  async deleteWarehouse(actor: ActorContext, id: string) { return this.softDelete(actor, 'warehouse', id) }

  async createUser(actor: ActorContext, dto: CreateUserDto) {
    return this.dataSource.transaction(async (manager) => {
      await this.requireDept(manager, actor.companyId, dto.deptId)
      const entity = manager.create(UserEntity, { ...dto, id: this.id(dto.id, 'id'), companyId: actor.companyId, deptId: this.id(dto.deptId, 'deptId'), useYN: 'Y', permissions: [], deleteYN: 'N', createdBy: actor.userId, updatedBy: actor.userId })
      await this.repository.save(manager, entity)
      return this.userResponse((await this.requireUser(manager, actor.companyId, entity.id)))
    })
  }

  async updateUser(actor: ActorContext, id: string, dto: UpdateUserDto) {
    return this.dataSource.transaction(async (manager) => {
      const user = await this.requireUser(manager, actor.companyId, id)
      if (dto.deptId !== undefined) { await this.requireDept(manager, actor.companyId, dto.deptId); user.deptId = this.id(dto.deptId, 'deptId') }
      if (dto.name !== undefined) user.name = this.text(dto.name, 'name')
      if (dto.email !== undefined) user.email = this.text(dto.email, 'email')
      if (dto.phone !== undefined) user.phone = this.text(dto.phone, 'phone')
      if (dto.title !== undefined) user.title = this.text(dto.title, 'title')
      if (dto.position !== undefined) user.position = this.text(dto.position, 'position')
      if (dto.roleId !== undefined) user.roleId = dto.roleId
      if (dto.scopeLevel !== undefined) user.scopeLevel = dto.scopeLevel
      if (dto.useYN !== undefined) user.useYN = dto.useYN
      user.updatedBy = actor.userId
      await this.repository.save(manager, user)
      return this.userResponse((await this.requireUser(manager, actor.companyId, user.id)))
    })
  }

  async deleteUser(actor: ActorContext, id: string) { return this.softDelete(actor, 'user', id) }

  private async softDelete(actor: ActorContext, kind: 'site' | 'dept' | 'warehouse' | 'user', id: string) {
    return this.dataSource.transaction(async (manager) => {
      const entity = kind === 'site' ? await this.requireSite(manager, actor.companyId, id) : kind === 'dept' ? await this.requireDept(manager, actor.companyId, id) : kind === 'warehouse' ? await this.requireWarehouse(manager, actor.companyId, id) : await this.requireUser(manager, actor.companyId, id)
      entity.deleteYN = 'Y'; entity.updatedBy = actor.userId
      await this.repository.save(manager, entity)
      return { id: entity.id, deleteYN: 'Y' as const }
    })
  }

  private userResponse(user: UserEntity): OrganizationUserResponse {
    return { id: user.id, companyId: user.companyId, siteId: user.dept.siteId, deptId: user.deptId, name: user.name, email: user.email, phone: user.phone, title: user.title, position: user.position, useYN: user.useYN, roleId: user.roleId, permissions: user.permissions, scopeLevel: user.scopeLevel, deleteYN: user.deleteYN }
  }

  private async requireCompany(manager: Parameters<OrgRepository['findCompany']>[0], id: string) { const entity = await this.repository.findCompany(manager, this.id(id, 'companyId')); if (!entity) throw new AppException(ERROR_CODE.RESOURCE_NOT_FOUND, 404, '회사를 찾을 수 없습니다.'); return entity }
  private async requireSite(manager: Parameters<OrgRepository['findSite']>[0], companyId: string, id: string) { const entity = await this.repository.findSite(manager, companyId, this.id(id, 'siteId')); if (!entity) throw new AppException(ERROR_CODE.RESOURCE_NOT_FOUND, 404, '사업장을 찾을 수 없습니다.'); return entity }
  private async requireDept(manager: Parameters<OrgRepository['findDept']>[0], companyId: string, id: string) { const entity = await this.repository.findDept(manager, companyId, this.id(id, 'deptId')); if (!entity) throw new AppException(ERROR_CODE.RESOURCE_NOT_FOUND, 404, '부서를 찾을 수 없습니다.'); return entity }
  private async requireWarehouse(manager: Parameters<OrgRepository['findWarehouse']>[0], companyId: string, id: string) { const entity = await this.repository.findWarehouse(manager, companyId, this.id(id, 'warehouseId')); if (!entity) throw new AppException(ERROR_CODE.RESOURCE_NOT_FOUND, 404, '창고를 찾을 수 없습니다.'); return entity }
  private async requireUser(manager: Parameters<OrgRepository['findUser']>[0], companyId: string, id: string) { const entity = await this.repository.findUser(manager, companyId, this.id(id, 'userId')); if (!entity) throw new AppException(ERROR_CODE.RESOURCE_NOT_FOUND, 404, '사용자를 찾을 수 없습니다.'); return entity }
  private id(value: string, field: string): string { const normalized = value?.trim(); if (!normalized || !/^[A-Za-z][A-Za-z0-9_-]{0,254}$/.test(normalized)) throw new AppException(ERROR_CODE.VALIDATION_FAILED, 400, `${field} 형식이 올바르지 않습니다.`); return normalized }
  private text(value: string, field: string): string { const normalized = value?.trim(); if (!normalized || normalized.length > 255) throw new AppException(ERROR_CODE.VALIDATION_FAILED, 400, `${field}는 1~255자로 입력해야 합니다.`); return normalized }
}
