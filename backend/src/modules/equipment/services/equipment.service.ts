import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import type { ActorContext } from '../../../common/context/actor-context'
import { NumberingService } from '../../../common/numbering/numbering.service'
import { AppException } from '../../../common/exception/app.exception'
import { ERROR_CODE } from '../../../common/exception/error-code'
import { EquipmentEntity } from '../entities/equipment.entity'
import type { CreateEquipmentDto, EquipmentListQuery, UpdateEquipmentDto } from '../dto/equipment.dto'
import { EquipmentRepository } from '../repositories/equipment.repository'

@Injectable()
export class EquipmentService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly repository: EquipmentRepository,
    private readonly numbering: NumberingService,
  ) {}

  async findAll(actor: ActorContext, query: EquipmentListQuery) {
    if (query.searchType !== undefined && query.searchType !== 'id' && query.searchType !== 'name') {
      throw new AppException(ERROR_CODE.VALIDATION_FAILED, 400, '유효하지 않은 검색구분입니다.')
    }
    const page = this.positiveInt(query.page, 1)
    const pageSize = Math.min(this.positiveInt(query.pageSize, 20), 100)
    const searchValue = query.searchValue?.trim()
    const [items, total] = await this.repository.findAll(this.dataSource.manager, actor.companyId, page, pageSize, query.searchType, searchValue)
    return { items, page, pageSize, total, totalPages: Math.ceil(total / pageSize) }
  }

  async findOne(actor: ActorContext, id: string): Promise<EquipmentEntity> {
    const equipment = await this.repository.findOne(this.dataSource.manager, actor.companyId, this.id(id, 'equipmentId'))
    if (!equipment) throw new AppException(ERROR_CODE.RESOURCE_NOT_FOUND, 404, '설비를 찾을 수 없습니다.')
    return equipment
  }

  async create(actor: ActorContext, dto: CreateEquipmentDto): Promise<EquipmentEntity> {
    this.validate(dto)
    return this.dataSource.transaction(async (manager) => {
      const now = new Date()
      const entity = manager.create(EquipmentEntity, {
        id: await this.numbering.nextInTransaction(manager, { companyId: actor.companyId, module: 'EQT' }),
        companyId: actor.companyId,
        ...this.normalize(dto),
        deleteYN: 'N',
        createdAt: now,
        createdBy: actor.userId,
        updatedBy: actor.userId,
      })
      await this.repository.save(manager, entity)
      return this.repository.findOne(manager, actor.companyId, entity.id) as Promise<EquipmentEntity>
    })
  }

  async update(actor: ActorContext, id: string, dto: UpdateEquipmentDto): Promise<EquipmentEntity> {
    return this.dataSource.transaction(async (manager) => {
      const equipment = await this.require(manager, actor.companyId, id)
      Object.assign(equipment, this.normalize(dto))
      equipment.updatedBy = actor.userId
      await this.repository.save(manager, equipment)
      return this.repository.findOne(manager, actor.companyId, equipment.id) as Promise<EquipmentEntity>
    })
  }

  async remove(actor: ActorContext, id: string): Promise<{ id: string; deleteYN: 'Y' }> {
    return this.dataSource.transaction(async (manager) => {
      const equipment = await this.require(manager, actor.companyId, id)
      equipment.deleteYN = 'Y'
      equipment.updatedBy = actor.userId
      await this.repository.save(manager, equipment)
      return { id: equipment.id, deleteYN: 'Y' as const }
    })
  }

  private async require(manager: Parameters<EquipmentRepository['findOne']>[0], companyId: string, id: string): Promise<EquipmentEntity> {
    const equipment = await this.repository.findOne(manager, companyId, this.id(id, 'equipmentId'))
    if (!equipment) throw new AppException(ERROR_CODE.RESOURCE_NOT_FOUND, 404, '설비를 찾을 수 없습니다.')
    return equipment
  }

  private normalize(dto: Partial<CreateEquipmentDto>): Partial<CreateEquipmentDto> {
    return Object.fromEntries(Object.entries(dto).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value]))
  }

  private validate(dto: CreateEquipmentDto): void {
    for (const [field, value] of Object.entries(dto)) {
      if (typeof value === 'string' && !value.trim() && field !== 'summary') {
        throw new AppException(ERROR_CODE.VALIDATION_FAILED, 400, `${field}는 필수입니다.`)
      }
    }
  }

  private id(value: string, field: string): string {
    const normalized = value?.trim()
    if (!normalized) throw new AppException(ERROR_CODE.VALIDATION_FAILED, 400, `${field}가 필요합니다.`)
    return normalized
  }

  private positiveInt(value: string | undefined, fallback: number): number {
    const parsed = Number(value)
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
  }
}
