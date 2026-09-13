import { Injectable } from '@nestjs/common'
import type { EntityManager } from 'typeorm'
import { AttachmentEntity, AttachmentItemEntity } from '../entities/attachment.entity'

@Injectable()
export class AttachmentRepository {
  findById(manager: EntityManager, companyId: string, id: string, forUpdate = false): Promise<AttachmentEntity | null> {
    const query = manager.getRepository(AttachmentEntity)
      .createQueryBuilder('attachment')
      .leftJoinAndSelect('attachment.items', 'item')
      .where('attachment.companyId = :companyId', { companyId })
      .andWhere('attachment.id = :id', { id })
      .andWhere('attachment.deleteYN = :deleteYN', { deleteYN: 'N' })
      .orderBy('item.itemNo', 'ASC')
    if (forUpdate) query.setLock('pessimistic_write')
    return query.getOne()
  }

  findByRecord(manager: EntityManager, companyId: string, module: string, recordId: string): Promise<AttachmentEntity | null> {
    return manager.getRepository(AttachmentEntity)
      .createQueryBuilder('attachment')
      .leftJoinAndSelect('attachment.items', 'item')
      .where('attachment.companyId = :companyId', { companyId })
      .andWhere('attachment.module = :module', { module })
      .andWhere('attachment.recordId = :recordId', { recordId })
      .andWhere('attachment.deleteYN = :deleteYN', { deleteYN: 'N' })
      .orderBy('item.itemNo', 'ASC')
      .getOne()
  }

  saveAttachment(manager: EntityManager, entity: AttachmentEntity): Promise<AttachmentEntity> {
    return manager.save(entity)
  }

  saveItem(manager: EntityManager, entity: AttachmentItemEntity): Promise<AttachmentItemEntity> {
    return manager.save(entity)
  }

  removeItem(manager: EntityManager, entity: AttachmentItemEntity): Promise<AttachmentItemEntity> {
    return manager.remove(entity)
  }

  findItem(manager: EntityManager, companyId: string, attachmentId: string, itemNo: number): Promise<AttachmentItemEntity | null> {
    return manager.getRepository(AttachmentItemEntity).findOneBy({ companyId, attachmentId, itemNo })
  }
}
