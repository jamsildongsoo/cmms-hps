import type { ApprovalActionRequest, ApprovalResponse } from '../../../entities/approval/types'
import { approvalMockData } from './mock'

const approvals = [...approvalMockData]

export async function getApprovals(): Promise<ApprovalResponse[]> {
  /* 백엔드 연계 예시
  const response = await fetch('/api/approvals', { credentials: 'include' })
  if (!response.ok) throw new Error('결재 목록을 조회할 수 없습니다.')
  return response.json() as Promise<ApprovalResponse[]>
  */
  return [...approvals]
}

export async function createApprovalDraft(approval: ApprovalResponse): Promise<ApprovalResponse> {
  /* 백엔드 연계 예시: POST /api/approvals/drafts
   * 서버에서 회사·작성자·결재선의 유효성을 검증한 뒤 저장합니다.
   */
  approvals.unshift(approval)
  return approval
}

export async function saveApprovalDraft(approval: ApprovalResponse, userId: string): Promise<ApprovalResponse> {
  if (approval.requesterId !== userId || approval.status !== 'draft') throw new Error('임시저장 문서는 작성자만 수정할 수 있습니다.')
  /* 백엔드에서는 requesterId와 status를 함께 검증한 뒤 임시저장합니다. */
  return approval
}

export async function processApproval(approvalId: string, action: ApprovalActionRequest, userId: string): Promise<ApprovalResponse> {
  const approval = approvals.find((item) => item.id === approvalId)
  if (!approval) throw new Error('결재 문서를 찾을 수 없습니다.')
  /* 백엔드에서 현재 결재자, 결재순번, 권한, 참조자 여부를 재검증해야 합니다. */
  const participant = approval.participants.find((item) => item.userId === userId && (item.type === 'approval' || item.type === 'agreement') && item.status === 'pending')
  if (!participant) return approval
  participant.status = action.action === 'reject' ? 'rejected' : 'approved'
  participant.processedAt = new Date().toISOString()
  if (action.action === 'reject') {
    approval.status = 'rejected'
    approval.completedAt = new Date().toISOString()
    return approval
  }
  const nextActionParticipant = approval.participants
    .filter((item) => item.type === 'approval' || item.type === 'agreement')
    .find((item) => item.status === 'pending')
  if (nextActionParticipant) {
    approval.status = 'inProgress'
    approval.currentStep = nextActionParticipant.sequenceNo
  } else {
    approval.status = 'approved'
    approval.completedAt = new Date().toISOString()
  }
  return approval
}
