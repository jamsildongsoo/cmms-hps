import type { ApprovalParticipantType, ApprovalStatus } from './types'

export const APPROVAL_MODULE_LABELS: Record<string, string> = { GEN: '일반', general: '일반', APR: '결재', BRD: '게시판', PR: '구매요청', PO: '구매오더', PM: '예방점검', WO: '작업오더', WP: '작업허가' }
export const APPROVAL_STATUS_LABELS: Record<ApprovalStatus, string> = { draft: '임시저장', requested: '상신', inProgress: '진행중', approved: '승인', rejected: '반려', cancelled: '취소' }
export const APPROVAL_PARTICIPANT_TYPE_LABELS: Record<ApprovalParticipantType, string> = { requester: '기안', approval: '결재', agreement: '합의', reference: '참조' }
export const APPROVAL_PARTICIPANT_OPTIONS: Array<{ value: Exclude<ApprovalParticipantType, 'requester'>; label: string }> = [
  { value: 'approval', label: '결재' }, { value: 'agreement', label: '합의' }, { value: 'reference', label: '참조' },
]
