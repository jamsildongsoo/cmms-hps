import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import type { ActorContext } from '../../../common/context/actor-context'
import { AppException } from '../../../common/exception/app.exception'
import { ERROR_CODE } from '../../../common/exception/error-code'
import { NumberingService } from '../../../common/numbering/numbering.service'
import { MaterialEntity } from '../entities/material.entity'
import type { CreateMaterialDto, MaterialListQuery, UpdateMaterialDto } from '../dto/material.dto'
import { MaterialRepository } from '../repositories/material.repository'

@Injectable()
export class MaterialService {
  constructor(private readonly dataSource: DataSource, private readonly repository: MaterialRepository, private readonly numbering: NumberingService) {}
  async findAll(actor: ActorContext, query: MaterialListQuery) {
    if (query.searchType && query.searchType !== 'id' && query.searchType !== 'name') throw new AppException(ERROR_CODE.VALIDATION_FAILED, 400, '유효하지 않은 검색구분입니다.')
    const page = this.positive(query.page, 1); const pageSize = Math.min(this.positive(query.pageSize, 20), 100)
    const [items, total] = await this.repository.findList(this.dataSource.manager, actor.companyId, page, pageSize, { ...query, searchValue: query.searchValue?.trim() })
    return { items, page, pageSize, total, totalPages: Math.ceil(total / pageSize) }
  }
  async findOne(actor: ActorContext, id: string) { const item = await this.repository.findOne(this.dataSource.manager, actor.companyId, this.required(id, 'materialId')); if (!item) throw new AppException(ERROR_CODE.RESOURCE_NOT_FOUND, 404, '자재를 찾을 수 없습니다.'); return item }
  async create(actor: ActorContext, dto: CreateMaterialDto) { return this.dataSource.transaction(async (manager) => { const entity = manager.create(MaterialEntity, { id: await this.numbering.nextInTransaction(manager, { companyId: actor.companyId, module: 'MAT' }), companyId: actor.companyId, ...dto, deleteYN: 'N', createdBy: actor.userId, updatedBy: actor.userId }); await this.repository.save(manager, entity); return this.findOneWithManager(manager, actor.companyId, entity.id) }) }
  async update(actor: ActorContext, id: string, dto: UpdateMaterialDto) { return this.dataSource.transaction(async (manager) => { const item = await this.require(manager, actor.companyId, id); Object.assign(item, dto); item.updatedBy = actor.userId; await this.repository.save(manager, item); return this.findOneWithManager(manager, actor.companyId, item.id) }) }
  async remove(actor: ActorContext, id: string) { return this.dataSource.transaction(async (manager) => { const item = await this.require(manager, actor.companyId, id); item.deleteYN = 'Y'; item.updatedBy = actor.userId; await this.repository.save(manager, item); return { id: item.id, deleteYN: 'Y' as const } }) }
  private async require(manager: Parameters<MaterialRepository['findOne']>[0], companyId: string, id: string) { const item = await this.repository.findOne(manager, companyId, this.required(id, 'materialId')); if (!item) throw new AppException(ERROR_CODE.RESOURCE_NOT_FOUND, 404, '자재를 찾을 수 없습니다.'); return item }
  private findOneWithManager(manager: Parameters<MaterialRepository['findOne']>[0], companyId: string, id: string) { return this.repository.findOne(manager, companyId, id) }
  private required(value: string, field: string) { const result = value?.trim(); if (!result) throw new AppException(ERROR_CODE.VALIDATION_FAILED, 400, `${field}가 필요합니다.`); return result }
  private positive(value: string | undefined, fallback: number) { const parsed = Number(value); return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback }
}
