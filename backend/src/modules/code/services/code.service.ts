import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import type { ActorContext } from '../../../common/context/actor-context'
import { AppException } from '../../../common/exception/app.exception'
import { ERROR_CODE } from '../../../common/exception/error-code'
import { CodeEntity, CodeItemEntity } from '../entities/common-code.entity'
import type { CreateCodeDto, CreateCodeItemDto, UpdateCodeDto, UpdateCodeItemDto } from '../dto/code.dto'
import { CodeRepository } from '../repositories/code.repository'

@Injectable()
export class CodeService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly repository: CodeRepository,
  ) {}

  async findCodes(actor: ActorContext) {
    return this.repository.findCodes(this.dataSource.manager, actor.companyId)
  }

  async findCode(actor: ActorContext, codeId: string): Promise<CodeEntity> {
    const code = await this.repository.findCode(this.dataSource.manager, actor.companyId, this.id(codeId, 'codeId'))
    if (!code) throw new AppException(ERROR_CODE.RESOURCE_NOT_FOUND, 404, '코드를 찾을 수 없습니다.')
    return code
  }

  async createCode(actor: ActorContext, dto: CreateCodeDto): Promise<CodeEntity> {
    const id = this.id(dto.id, 'id')
    const name = this.text(dto.name, 'name')
    return this.dataSource.transaction(async (manager) => {
      const entity = manager.create(CodeEntity, {
        id,
        companyId: actor.companyId,
        name,
        system: false,
        active: true,
        deleteYN: 'N',
        createdBy: actor.userId,
        updatedBy: actor.userId,
      })
      return this.repository.saveCode(manager, entity)
    })
  }

  async updateCode(actor: ActorContext, codeId: string, dto: UpdateCodeDto): Promise<CodeEntity> {
    return this.dataSource.transaction(async (manager) => {
      const code = await this.requireCode(manager, actor.companyId, this.id(codeId, 'codeId'))
      this.assertNonSystem(code)
      if (dto.name !== undefined) code.name = this.text(dto.name, 'name')
      if (dto.active !== undefined) code.active = dto.active
      code.updatedBy = actor.userId
      return this.repository.saveCode(manager, code)
    })
  }

  async deleteCode(actor: ActorContext, codeId: string): Promise<{ id: string; deleteYN: 'Y' }> {
    return this.dataSource.transaction(async (manager) => {
      const code = await this.requireCode(manager, actor.companyId, this.id(codeId, 'codeId'))
      this.assertNonSystem(code)
      code.deleteYN = 'Y'
      code.active = false
      code.updatedBy = actor.userId
      await this.repository.saveCode(manager, code)
      return { id: code.id, deleteYN: 'Y' as const }
    })
  }

  async findItems(actor: ActorContext, codeId: string) {
    const normalizedCodeId = this.id(codeId, 'codeId')
    await this.requireCode(this.dataSource.manager, actor.companyId, normalizedCodeId)
    return this.repository.findItems(this.dataSource.manager, actor.companyId, normalizedCodeId)
  }

  async findItem(actor: ActorContext, codeId: string, itemId: string): Promise<CodeItemEntity> {
    const normalizedCodeId = this.id(codeId, 'codeId')
    await this.requireCode(this.dataSource.manager, actor.companyId, normalizedCodeId)
    const item = await this.repository.findItem(this.dataSource.manager, actor.companyId, normalizedCodeId, this.id(itemId, 'itemId'))
    if (!item) throw new AppException(ERROR_CODE.RESOURCE_NOT_FOUND, 404, '코드 항목을 찾을 수 없습니다.')
    return item
  }

  async createItem(actor: ActorContext, codeId: string, dto: CreateCodeItemDto): Promise<CodeItemEntity> {
    const normalizedCodeId = this.id(codeId, 'codeId')
    const id = this.id(dto.id, 'id')
    const label = this.text(dto.label, 'label')
    const sortOrder = this.sortOrder(dto.sortOrder)
    return this.dataSource.transaction(async (manager) => {
      await this.requireCode(manager, actor.companyId, normalizedCodeId)
      const entity = manager.create(CodeItemEntity, {
        companyId: actor.companyId,
        codeId: normalizedCodeId,
        id,
        label,
        sortOrder,
        active: true,
        createdBy: actor.userId,
        updatedBy: actor.userId,
      })
      return this.repository.saveItem(manager, entity)
    })
  }

  async updateItem(actor: ActorContext, codeId: string, itemId: string, dto: UpdateCodeItemDto): Promise<CodeItemEntity> {
    const normalizedCodeId = this.id(codeId, 'codeId')
    return this.dataSource.transaction(async (manager) => {
      await this.requireCode(manager, actor.companyId, normalizedCodeId)
      const item = await this.repository.findItem(manager, actor.companyId, normalizedCodeId, this.id(itemId, 'itemId'))
      if (!item) throw new AppException(ERROR_CODE.RESOURCE_NOT_FOUND, 404, '코드 항목을 찾을 수 없습니다.')
      if (dto.label !== undefined) item.label = this.text(dto.label, 'label')
      if (dto.sortOrder !== undefined) item.sortOrder = this.sortOrder(dto.sortOrder)
      if (dto.active !== undefined) item.active = dto.active
      item.updatedBy = actor.userId
      return this.repository.saveItem(manager, item)
    })
  }

  async deleteItem(actor: ActorContext, codeId: string, itemId: string): Promise<{ codeId: string; id: string }> {
    const normalizedCodeId = this.id(codeId, 'codeId')
    return this.dataSource.transaction(async (manager) => {
      await this.requireCode(manager, actor.companyId, normalizedCodeId)
      const item = await this.repository.findItem(manager, actor.companyId, normalizedCodeId, this.id(itemId, 'itemId'))
      if (!item) throw new AppException(ERROR_CODE.RESOURCE_NOT_FOUND, 404, '코드 항목을 찾을 수 없습니다.')
      await this.repository.removeItem(manager, item)
      return { codeId: normalizedCodeId, id: item.id }
    })
  }

  private async requireCode(manager: Parameters<CodeRepository['findCode']>[0], companyId: string, codeId: string): Promise<CodeEntity> {
    const code = await this.repository.findCode(manager, companyId, codeId)
    if (!code) throw new AppException(ERROR_CODE.RESOURCE_NOT_FOUND, 404, '코드를 찾을 수 없습니다.')
    return code
  }

  private assertNonSystem(code: CodeEntity): void {
    if (code.system) throw new AppException(ERROR_CODE.AUTH_FORBIDDEN, 403, '시스템 코드는 수정하거나 삭제할 수 없습니다.')
  }

  private id(value: string, field: string): string {
    const normalized = value?.trim()
    if (!normalized || !/^[A-Za-z][A-Za-z0-9_-]{0,254}$/.test(normalized)) throw new AppException(ERROR_CODE.VALIDATION_FAILED, 400, `${field} 형식이 올바르지 않습니다.`)
    return normalized
  }

  private text(value: string, field: string): string {
    const normalized = value?.trim()
    if (!normalized || normalized.length > 255) throw new AppException(ERROR_CODE.VALIDATION_FAILED, 400, `${field}는 1~255자로 입력해야 합니다.`)
    return normalized
  }

  private sortOrder(value: number | undefined): number {
    if (value === undefined) return 0
    if (!Number.isInteger(value) || value < 0) throw new AppException(ERROR_CODE.VALIDATION_FAILED, 400, 'sortOrder는 0 이상의 정수여야 합니다.')
    return value
  }
}
