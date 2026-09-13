import { randomUUID } from 'node:crypto'
import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import type { ActorContext } from '../../../common/context/actor-context'
import { AppException } from '../../../common/exception/app.exception'
import { ERROR_CODE } from '../../../common/exception/error-code'
import { FileStorageService } from '../../../common/file-storage/file-storage.service'
import { AttachmentEntity, AttachmentItemEntity } from '../entities/attachment.entity'
import type { AttachmentResponse, CreateAttachmentDto } from '../dto/attachment.dto'
import { AttachmentRepository } from '../repositories/attachment.repository'

type UploadFile = { originalname: string; mimetype: string; buffer: Buffer }

@Injectable()
export class AttachmentService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly repository: AttachmentRepository,
    private readonly storage: FileStorageService,
  ) {}

  async findByRecord(actor: ActorContext, module: string, recordId: string): Promise<AttachmentResponse | null> {
    const normalizedModule = this.text(module, 'module')
    const normalizedRecordId = this.text(recordId, 'recordId')
    const entity = await this.repository.findByRecord(this.dataSource.manager, actor.companyId, normalizedModule, normalizedRecordId)
    return entity ? this.toResponse(entity) : null
  }

  async findById(actor: ActorContext, attachmentId: string): Promise<AttachmentResponse> {
    const entity = await this.require(this.dataSource.manager, actor.companyId, attachmentId)
    return this.toResponse(entity)
  }

  async upload(actor: ActorContext, dto: CreateAttachmentDto, file: UploadFile): Promise<AttachmentResponse> {
    if (!file?.buffer) throw new AppException(ERROR_CODE.VALIDATION_FAILED, 400, '파일이 필요합니다.')
    const module = this.text(dto.module, 'module')
    const recordId = dto.recordId?.trim() || null
    const requestedAttachmentId = dto.attachmentId?.trim() || null
    let storedPath: string | null = null

    try {
      return await this.dataSource.transaction(async (manager) => {
        let attachment = requestedAttachmentId
          ? await this.require(manager, actor.companyId, requestedAttachmentId, true)
          : recordId
            ? await this.repository.findByRecord(manager, actor.companyId, module, recordId)
            : null

        if (attachment) {
          // 같은 첨부 묶음의 itemNo 채번을 직렬화합니다. PostgreSQL SELECT ... FOR UPDATE입니다.
          attachment = await this.require(manager, actor.companyId, attachment.id, true)
        } else {
          const now = new Date()
          attachment = manager.create(AttachmentEntity, {
            id: randomUUID(),
            companyId: actor.companyId,
            siteId: dto.siteId?.trim() || actor.siteId,
            module,
            recordId,
            deleteYN: 'N',
            createdAt: now,
            createdBy: actor.userId,
            updatedBy: actor.userId,
          })
          await this.repository.saveAttachment(manager, attachment)
        }

        const itemNo = Math.max(0, ...(attachment.items ?? []).map((item) => item.itemNo)) + 1
        const stored = await this.storage.store({
          companyId: actor.companyId,
          attachmentId: attachment.id,
          itemNo,
          fileName: file.originalname,
          contentType: file.mimetype,
          content: file.buffer,
        })
        storedPath = stored.storagePath

        const item = manager.create(AttachmentItemEntity, {
          companyId: actor.companyId,
          attachmentId: attachment.id,
          itemNo,
          fileName: stored.fileName,
          fileSize: String(stored.fileSize),
          contentType: stored.contentType,
          storagePath: stored.storagePath,
        })
        await this.repository.saveItem(manager, item)
        attachment.updatedBy = actor.userId
        await this.repository.saveAttachment(manager, attachment)
        const result = await this.repository.findById(manager, actor.companyId, attachment.id)
        return this.toResponse(result ?? attachment)
      })
    } catch (error) {
      if (storedPath) await this.storage.remove(storedPath).catch(() => undefined)
      throw error
    }
  }

  async readItem(actor: ActorContext, attachmentId: string, itemNo: string): Promise<{ item: AttachmentItemEntity; content: Buffer }> {
    const normalizedItemNo = this.itemNo(itemNo)
    const attachment = await this.require(this.dataSource.manager, actor.companyId, attachmentId)
    const item = attachment.items.find((candidate) => candidate.itemNo === normalizedItemNo)
    if (!item) throw new AppException(ERROR_CODE.FILE_NOT_FOUND, 404, '첨부파일을 찾을 수 없습니다.')
    return { item, content: await this.storage.read(item.storagePath) }
  }

  async removeItem(actor: ActorContext, attachmentId: string, itemNo: string): Promise<{ attachmentId: string; itemNo: number }> {
    const normalizedItemNo = this.itemNo(itemNo)
    let storagePath: string | null = null
    const result = await this.dataSource.transaction(async (manager) => {
      const attachment = await this.require(manager, actor.companyId, attachmentId, true)
      const item = attachment.items.find((candidate) => candidate.itemNo === normalizedItemNo)
      if (!item) throw new AppException(ERROR_CODE.FILE_NOT_FOUND, 404, '첨부파일을 찾을 수 없습니다.')
      storagePath = item.storagePath
      await this.repository.removeItem(manager, item)
      if (attachment.items.length <= 1) {
        attachment.deleteYN = 'Y'
        attachment.updatedBy = actor.userId
        await this.repository.saveAttachment(manager, attachment)
      }
      return { attachmentId: attachment.id, itemNo: normalizedItemNo }
    })
    if (storagePath) await this.storage.remove(storagePath)
    return result
  }

  private async require(manager: Parameters<AttachmentRepository['findById']>[0], companyId: string, id: string, forUpdate = false): Promise<AttachmentEntity> {
    const entity = await this.repository.findById(manager, companyId, this.text(id, 'attachmentId'), forUpdate)
    if (!entity) throw new AppException(ERROR_CODE.FILE_NOT_FOUND, 404, '첨부 묶음을 찾을 수 없습니다.')
    return entity
  }

  private toResponse(entity: AttachmentEntity): AttachmentResponse {
    return {
      id: entity.id,
      companyId: entity.companyId,
      siteId: entity.siteId,
      module: entity.module,
      recordId: entity.recordId,
      deleteYN: entity.deleteYN,
      items: (entity.items ?? []).map((item) => ({ attachmentId: item.attachmentId, itemNo: item.itemNo, fileName: item.fileName, fileSize: Number(item.fileSize), contentType: item.contentType })),
    }
  }

  private text(value: string | null | undefined, field: string): string {
    const normalized = value?.trim()
    if (!normalized) throw new AppException(ERROR_CODE.VALIDATION_FAILED, 400, `${field}가 필요합니다.`)
    return normalized
  }

  private itemNo(value: string): number {
    const parsed = Number(value)
    if (!Number.isSafeInteger(parsed) || parsed <= 0) throw new AppException(ERROR_CODE.VALIDATION_FAILED, 400, 'itemNo가 올바르지 않습니다.')
    return parsed
  }
}
