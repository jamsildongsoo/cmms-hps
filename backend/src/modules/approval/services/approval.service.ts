import { randomUUID } from 'node:crypto'
import { Injectable } from '@nestjs/common'
import { DataSource, EntityManager } from 'typeorm'
import type { ActorContext } from '../../../common/context/actor-context'
import { AppException } from '../../../common/exception/app.exception'
import { ERROR_CODE } from '../../../common/exception/error-code'
import { NumberingService } from '../../../common/numbering/numbering.service'
import { APPROVAL_PARTICIPANT_STATUS, APPROVAL_PARTICIPANTS_ACTION, APPROVAL_STATUS } from '../../../../../shared/domain-codes'
import type { ModuleCode } from '../../../../../shared/domain-codes'
import type { ApprovalFolder, CreateApprovalDto, ProcessApprovalDto, UpdateApprovalDto } from '../dto/approval.dto'
import { ApprovalEntity, ApprovalParticipantEntity } from '../entities/approval.entity'
import { ApprovalRepository } from '../repositories/approval.repository'

@Injectable()
export class ApprovalService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly repository: ApprovalRepository,
    private readonly numbering: NumberingService,
  ) {}

  async findAll(actor: ActorContext, folder?: ApprovalFolder) {
    return (await this.repository.findList(this.dataSource.manager, actor.companyId, actor.userId, folder)).map((item) => this.toResponse(item))
  }

  async findOne(actor: ActorContext, id: string) {
    const approval = await this.require(this.dataSource.manager, actor.companyId, id)
    this.assertVisible(approval, actor.userId)
    return this.toResponse(approval)
  }

  async create(actor: ActorContext, dto: CreateApprovalDto) {
    this.validateDraft(dto)
    return this.dataSource.transaction(async (manager) => {
      const id = await this.numbering.nextInTransaction(manager, { companyId: actor.companyId, module: 'APR' })
      const users = await this.findParticipantUsers(manager, actor.companyId, [actor.userId, ...dto.participants.map((item) => item.userId)])
      const now = new Date()
      const activeCount = dto.participants.filter((item) => item.actionCode === APPROVAL_PARTICIPANTS_ACTION.APPROVAL || item.actionCode === APPROVAL_PARTICIPANTS_ACTION.AGREEMENT).length
      if (dto.submit && activeCount === 0) throw new AppException(ERROR_CODE.VALIDATION_FAILED, 400, '결재선이 필요합니다.')
      const approval = manager.create(ApprovalEntity, {
        id,
        companyId: actor.companyId,
        module: this.text(dto.module, 'module') as ModuleCode,
        recordId: dto.recordId?.trim() || null,
        recordSiteId: dto.recordSiteId?.trim() || null,
        title: this.text(dto.title, 'title'),
        content: dto.content?.trim() || null,
        status: dto.submit ? APPROVAL_STATUS.PROGRESS : APPROVAL_STATUS.DRAFT,
        requesterId: actor.userId,
        requestedAt: dto.submit ? now : null,
        completedAt: null,
        currentStep: dto.submit ? 1 : 0,
        totalSteps: activeCount,
        createdAt: now,
        createdBy: actor.userId,
        updatedBy: actor.userId,
      })
      await this.repository.save(manager, approval)
      await this.repository.saveParticipant(manager, manager.create(ApprovalParticipantEntity, {
        id, companyId: actor.companyId, sequenceNo: 0, userId: actor.userId,
        userName: users.find((item) => item.id === actor.userId)?.name ?? actor.userId,
        deptName: users.find((item) => item.id === actor.userId)?.dept?.name ?? '',
        title: users.find((item) => item.id === actor.userId)?.title ?? users.find((item) => item.id === actor.userId)?.position ?? '', actionCode: APPROVAL_PARTICIPANTS_ACTION.SUBMIT,
        status: APPROVAL_PARTICIPANT_STATUS.DONE, processedAt: now, comment: null,
      }))
      for (const [index, participant] of dto.participants.entries()) {
        const user = users.find((item) => item.id === participant.userId)
        if (!user) throw new AppException(ERROR_CODE.RESOURCE_NOT_FOUND, 404, '결재 대상 사용자를 찾을 수 없습니다.')
        await this.repository.saveParticipant(manager, manager.create(ApprovalParticipantEntity, {
          id, companyId: actor.companyId, sequenceNo: index + 1, userId: user.id,
          userName: user.name, deptName: user.dept.name, title: user.title || user.position,
          actionCode: participant.actionCode, status: APPROVAL_PARTICIPANT_STATUS.PENDING,
          processedAt: null, comment: null,
        }))
      }
      return this.toResponse((await this.require(manager, actor.companyId, id)))
    })
  }

  async update(actor: ActorContext, id: string, dto: UpdateApprovalDto) {
    return this.dataSource.transaction(async (manager) => {
      const approval = await this.require(manager, actor.companyId, id, true)
      this.assertOwner(approval, actor.userId)
      this.assertDraft(approval)
      if (dto.title !== undefined) approval.title = this.text(dto.title, 'title')
      if (dto.content !== undefined) approval.content = dto.content?.trim() || null
      if (dto.participants !== undefined) {
        this.validateParticipants(dto.participants)
        const users = await this.findParticipantUsers(manager, actor.companyId, [actor.userId, ...dto.participants.map((item) => item.userId)])
        await this.repository.removeParticipants(manager, actor.companyId, id)
        const requester = users.find((item) => item.id === actor.userId)
        await this.repository.saveParticipant(manager, manager.create(ApprovalParticipantEntity, { id, companyId: actor.companyId, sequenceNo: 0, userId: actor.userId, userName: requester?.name ?? actor.userId, deptName: requester?.dept?.name ?? '', title: requester?.title ?? requester?.position ?? '', actionCode: APPROVAL_PARTICIPANTS_ACTION.SUBMIT, status: APPROVAL_PARTICIPANT_STATUS.DONE, processedAt: new Date(), comment: null }))
        for (const [index, participant] of dto.participants.entries()) {
          const user = users.find((item) => item.id === participant.userId)
          if (!user) throw new AppException(ERROR_CODE.RESOURCE_NOT_FOUND, 404, '결재 대상 사용자를 찾을 수 없습니다.')
          await this.repository.saveParticipant(manager, manager.create(ApprovalParticipantEntity, { id, companyId: actor.companyId, sequenceNo: index + 1, userId: user.id, userName: user.name, deptName: user.dept.name, title: user.title || user.position, actionCode: participant.actionCode, status: APPROVAL_PARTICIPANT_STATUS.PENDING, processedAt: null, comment: null }))
        }
        approval.totalSteps = dto.participants.filter((item) => item.actionCode !== APPROVAL_PARTICIPANTS_ACTION.REFERENCE).length
      }
      approval.updatedBy = actor.userId
      await this.repository.save(manager, approval)
      return this.toResponse(await this.require(manager, actor.companyId, id))
    })
  }

  async submit(actor: ActorContext, id: string) {
    return this.dataSource.transaction(async (manager) => {
      const approval = await this.require(manager, actor.companyId, id, true)
      this.assertOwner(approval, actor.userId)
      this.assertDraft(approval)
      const active = approval.participants.filter((item) => item.actionCode === APPROVAL_PARTICIPANTS_ACTION.APPROVAL || item.actionCode === APPROVAL_PARTICIPANTS_ACTION.AGREEMENT)
      if (!active.length) throw new AppException(ERROR_CODE.VALIDATION_FAILED, 400, '결재선이 필요합니다.')
      approval.status = APPROVAL_STATUS.PROGRESS
      approval.requestedAt = new Date()
      approval.currentStep = active[0].sequenceNo
      approval.totalSteps = active.length
      approval.updatedBy = actor.userId
      await this.repository.save(manager, approval)
      return this.toResponse(await this.require(manager, actor.companyId, id))
    })
  }

  async process(actor: ActorContext, id: string, dto: ProcessApprovalDto) {
    return this.dataSource.transaction(async (manager) => {
      const approval = await this.require(manager, actor.companyId, id, true)
      if (approval.status !== APPROVAL_STATUS.PROGRESS) throw new AppException(ERROR_CODE.INVALID_STATE, 409, '진행 중인 결재만 처리할 수 있습니다.')
      const participant = approval.participants.find((item) => item.sequenceNo === approval.currentStep && item.userId === actor.userId && (item.actionCode === APPROVAL_PARTICIPANTS_ACTION.APPROVAL || item.actionCode === APPROVAL_PARTICIPANTS_ACTION.AGREEMENT) && item.status === APPROVAL_PARTICIPANT_STATUS.PENDING)
      if (!participant) throw new AppException(ERROR_CODE.AUTH_FORBIDDEN, 403, '현재 결재 순서의 대상자가 아닙니다.')
      participant.processedAt = new Date()
      participant.comment = dto.comment?.trim() || null
      participant.status = dto.action === 'reject' ? APPROVAL_PARTICIPANT_STATUS.REJECT : APPROVAL_PARTICIPANT_STATUS.DONE
      await this.repository.saveParticipant(manager, participant)
      if (dto.action === 'reject') {
        approval.status = APPROVAL_STATUS.REJECT
        approval.completedAt = new Date()
      } else {
        const next = approval.participants.find((item) => item.sequenceNo > participant.sequenceNo && (item.actionCode === APPROVAL_PARTICIPANTS_ACTION.APPROVAL || item.actionCode === APPROVAL_PARTICIPANTS_ACTION.AGREEMENT) && item.status === APPROVAL_PARTICIPANT_STATUS.PENDING)
        if (next) approval.currentStep = next.sequenceNo
        else { approval.status = APPROVAL_STATUS.CONFIRM; approval.completedAt = new Date() }
      }
      approval.updatedBy = actor.userId
      await this.repository.save(manager, approval)
      return this.toResponse(await this.require(manager, actor.companyId, id))
    })
  }

  async remove(actor: ActorContext, id: string) {
    return this.dataSource.transaction(async (manager) => {
      const approval = await this.require(manager, actor.companyId, id, true)
      this.assertOwner(approval, actor.userId)
      this.assertDraft(approval)
      await this.repository.removeParticipants(manager, actor.companyId, id)
      await this.repository.remove(manager, approval)
      return { id }
    })
  }

  private async findParticipantUsers(manager: EntityManager, companyId: string, userIds: string[]) {
    const uniqueIds = [...new Set(userIds.map((id) => this.text(id, 'userId')))]
    if (uniqueIds.length !== userIds.length) throw new AppException(ERROR_CODE.VALIDATION_FAILED, 400, '결재선에 중복 사용자가 있습니다.')
    if (uniqueIds.length === 0) return []
    return this.repository.findUsers(manager, companyId, uniqueIds)
  }

  private validateDraft(dto: CreateApprovalDto) { this.text(dto.module, 'module'); this.text(dto.title, 'title'); this.validateParticipants(dto.participants) }
  private validateParticipants(items: CreateApprovalDto['participants']) { if (!Array.isArray(items)) throw new AppException(ERROR_CODE.VALIDATION_FAILED, 400, '결재선이 필요합니다.') }
  private async require(manager: EntityManager, companyId: string, id: string, forUpdate = false) { const approval = await this.repository.findOne(manager, companyId, this.text(id, 'approvalId'), forUpdate); if (!approval) throw new AppException(ERROR_CODE.RESOURCE_NOT_FOUND, 404, '결재문을 찾을 수 없습니다.'); return approval }
  private assertOwner(approval: ApprovalEntity, userId: string) { if (approval.requesterId !== userId) throw new AppException(ERROR_CODE.AUTH_FORBIDDEN, 403, '작성자만 처리할 수 있습니다.') }
  private assertVisible(approval: ApprovalEntity, userId: string) { if (approval.requesterId !== userId && !approval.participants.some((item) => item.userId === userId)) throw new AppException(ERROR_CODE.AUTH_FORBIDDEN, 403, '조회할 수 없는 결재문입니다.') }
  private assertDraft(approval: ApprovalEntity) { if (approval.status !== APPROVAL_STATUS.DRAFT) throw new AppException(ERROR_CODE.INVALID_STATE, 409, '임시저장 상태에서만 수정할 수 있습니다.') }
  private text(value: string | null | undefined, field: string): string { const normalized = value?.trim(); if (!normalized) throw new AppException(ERROR_CODE.VALIDATION_FAILED, 400, `${field}가 필요합니다.`); return normalized }
  private toResponse(approval: ApprovalEntity) { return { ...approval, requesterName: approval.requester?.name ?? approval.requesterId, requesterDeptName: approval.requester?.dept?.name ?? '', requesterTitle: approval.requester?.title ?? approval.requester?.position ?? '', participants: [...(approval.participants ?? [])].sort((a, b) => a.sequenceNo - b.sequenceNo) } }
}
