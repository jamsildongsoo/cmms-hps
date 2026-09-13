import type { ApprovalParticipantsAction } from '../../../../../shared/domain-codes'

/** 결재함 구분. 미지정 시 전체 가시 문서를 반환합니다. */
export type ApprovalFolder = 'submitted' | 'pending' | 'completed' | 'reference'

export type ApprovalParticipantDto = {
  userId: string
  actionCode: Exclude<ApprovalParticipantsAction, 'S'>
}

export type CreateApprovalDto = {
  module: string
  recordId?: string | null
  recordSiteId?: string | null
  title: string
  content?: string | null
  participants: ApprovalParticipantDto[]
  submit?: boolean
}

export type UpdateApprovalDto = Partial<Pick<CreateApprovalDto, 'title' | 'content' | 'participants'>>

export type ProcessApprovalDto = {
  action: 'approve' | 'reject'
  comment?: string
}
