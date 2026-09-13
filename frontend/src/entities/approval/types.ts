export type ApprovalStatus = 'draft' | 'requested' | 'inProgress' | 'approved' | 'rejected' | 'cancelled'
export type ApprovalAction = 'submit' | 'approve' | 'reject'
export type ApprovalParticipantType = 'requester' | 'approval' | 'agreement' | 'reference'
export type ApprovalParticipantStatus = 'none' | 'pending' | 'approved' | 'rejected' | 'read'
export type ApprovalModule = string
export type ApprovalFolder = 'submitted' | 'pending' | 'completed' | 'reference'

export type Approval = {
  id: string
  companyId: string
  module: ApprovalModule
  recordId: string | null
  recordSiteId?: string | null
  status: ApprovalStatus
  requesterId: string
  title: string
  content?: string
  requestedAt?: string
  completedAt?: string
  currentStep: number
  totalSteps: number
}

export type ApprovalParticipant = {
  id: string
  companyId: string
  // id는 Approval.id와 같은 결재번호입니다. PK: companyId + id + sequenceNo
  sequenceNo: number
  userId: string
  userName: string
  deptName: string
  title: string
  type: ApprovalParticipantType
  status: ApprovalParticipantStatus
  processedAt?: string
  comment?: string
}

// export type ApprovalHistory = {
//   id: string
//   approvalId: string
//   step: number
//   approverId: string
//   action: ApprovalAction
//   comment: string
//   processedAt: string
// }

export type ApprovalResponse = Approval & {
  requesterName: string
  requesterDeptName: string
  requesterTitle: string
  approverName?: string
  participants: ApprovalParticipant[]
}

export type ApprovalCreateRequest = Omit<
  Approval,
  'id' | 'status' | 'requestedAt' | 'completedAt' | 'currentStep' | 'totalSteps'
>

export type ApprovalActionRequest = {
  action: Exclude<ApprovalAction, 'submit'>
  comment?: string
}
