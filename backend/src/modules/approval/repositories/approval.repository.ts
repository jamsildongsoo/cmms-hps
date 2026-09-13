import { Injectable } from '@nestjs/common'
import type { EntityManager } from 'typeorm'
import { ApprovalEntity, ApprovalParticipantEntity } from '../entities/approval.entity'
import type { ApprovalFolder } from '../dto/approval.dto'

@Injectable()
export class ApprovalRepository {
  findList(manager: EntityManager, companyId: string, userId: string, folder?: ApprovalFolder): Promise<ApprovalEntity[]> {
    const query = manager.getRepository(ApprovalEntity)
      .createQueryBuilder('approval')
      .leftJoinAndSelect('approval.participants', 'participant')
      .leftJoinAndSelect('approval.requester', 'requester')
      .leftJoinAndSelect('requester.dept', 'requesterDept')
      .where('approval.companyId = :companyId', { companyId })
      .orderBy('approval.createdAt', 'DESC')
      .addOrderBy('participant.sequenceNo', 'ASC')

    if (folder === 'submitted') {
      query.andWhere('approval.requesterId = :userId', { userId })
    } else if (folder === 'pending') {
      query
        .andWhere('participant.userId = :userId', { userId })
        .andWhere('participant.sequenceNo = approval.currentStep')
        .andWhere('participant.actionCode IN (:...activeActions)', { activeActions: ['A', 'G'] })
        .andWhere('participant.status = :pendingStatus', { pendingStatus: 'P' })
        .andWhere('approval.status = :progressStatus', { progressStatus: 'P' })
    } else if (folder === 'completed') {
      query
        .andWhere('(approval.requesterId = :userId OR participant.userId = :userId)', { userId })
        .andWhere('approval.status IN (:...completedStatuses)', { completedStatuses: ['C', 'R', 'X'] })
    } else if (folder === 'reference') {
      query
        .andWhere('participant.userId = :userId', { userId })
        .andWhere('participant.actionCode = :referenceAction', { referenceAction: 'E' })
    } else {
      query.andWhere('(approval.requesterId = :userId OR participant.userId = :userId)', { userId })
    }

    return query.getMany()
  }

  findOne(manager: EntityManager, companyId: string, id: string, forUpdate = false): Promise<ApprovalEntity | null> {
    const query = manager.getRepository(ApprovalEntity)
      .createQueryBuilder('approval')
      .leftJoinAndSelect('approval.participants', 'participant')
      .leftJoinAndSelect('approval.requester', 'requester')
      .leftJoinAndSelect('requester.dept', 'requesterDept')
      .where('approval.companyId = :companyId', { companyId })
      .andWhere('approval.id = :id', { id })
      .orderBy('participant.sequenceNo', 'ASC')
    if (forUpdate) query.setLock('pessimistic_write')
    return query.getOne()
  }

  findUsers(manager: EntityManager, companyId: string, userIds: string[]) {
    return manager.getRepository('user')
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.dept', 'dept')
      .where('user.companyId = :companyId', { companyId })
      .andWhere('user.id IN (:...userIds)', { userIds })
      .andWhere('user.deleteYN = :deleteYN', { deleteYN: 'N' })
      .getMany()
  }

  save(manager: EntityManager, entity: ApprovalEntity): Promise<ApprovalEntity> { return manager.save(entity) }
  saveParticipant(manager: EntityManager, entity: ApprovalParticipantEntity): Promise<ApprovalParticipantEntity> { return manager.save(entity) }
  removeParticipants(manager: EntityManager, companyId: string, approvalId: string) { return manager.delete(ApprovalParticipantEntity, { companyId, id: approvalId }) }
  remove(manager: EntityManager, entity: ApprovalEntity): Promise<ApprovalEntity> { return manager.remove(entity) }
}
