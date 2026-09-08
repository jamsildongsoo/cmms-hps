import type { ApprovalResponse } from '../../../entities/approval/types'

const participant = (approvalId: string, sequenceNo: number, userId: string, userName: string, deptName: string, title: string, type: ApprovalResponse['participants'][number]['type'], status: ApprovalResponse['participants'][number]['status']): ApprovalResponse['participants'][number] => ({
  id: `${approvalId}-${sequenceNo}`, approvalId, sequenceNo, userId, userName, deptName, title, type, status,
})

export const approvalMockData: ApprovalResponse[] = [
  {
    id: 'APR-2026-0001', companyId: 'COMPANY-HPS', module: 'purchase-request', recordId: 'PR-2026-0002', title: '안전보호구 구매', status: 'draft', requesterId: 'USER-1003', requesterName: '최관리', requesterDeptName: '경영관리팀', requesterTitle: '담당', currentStep: 0, totalSteps: 3,
    participants: [participant('APR-2026-0001', 0, 'USER-1003', '최관리', '경영관리팀', '담당', 'requester', 'none'), participant('APR-2026-0001', 1, 'USER-1002', '김경영', '경영관리팀', '팀장', 'approval', 'pending'), participant('APR-2026-0001', 2, 'USER-1001', '박대표', '대표이사', '대표이사', 'agreement', 'pending')],
  },
  {
    id: 'APR-2026-0002', companyId: 'COMPANY-HPS', module: 'work-permit', recordId: 'PTW-2026-0001', title: '펌프 정비 작업허가', status: 'inProgress', requesterId: 'USER-1005', requesterName: '정운영', requesterDeptName: '기술운영팀', requesterTitle: '담당', requestedAt: '2026-09-05', currentStep: 2, totalSteps: 4,
    participants: [participant('APR-2026-0002', 0, 'USER-1005', '정운영', '기술운영팀', '담당', 'requester', 'approved'), participant('APR-2026-0002', 1, 'USER-1004', '이기술', '기술운영팀', '팀장', 'approval', 'approved'), participant('APR-2026-0002', 2, 'USER-1002', '김경영', '경영관리팀', '팀장', 'agreement', 'pending'), participant('APR-2026-0002', 3, 'USER-1003', '최관리', '경영관리팀', '담당', 'reference', 'read')],
  },
  {
    id: 'APR-2026-0003', companyId: 'COMPANY-HPS', module: 'purchase-request', recordId: 'PR-2026-0001', title: '펌프 정비용 베어링 구매', status: 'approved', requesterId: 'USER-1005', requesterName: '정운영', requesterDeptName: '기술운영팀', requesterTitle: '담당', requestedAt: '2026-09-01', completedAt: '2026-09-03', currentStep: 2, totalSteps: 2,
    participants: [participant('APR-2026-0003', 0, 'USER-1005', '정운영', '기술운영팀', '담당', 'requester', 'approved'), participant('APR-2026-0003', 1, 'USER-1004', '이기술', '기술운영팀', '팀장', 'approval', 'approved'), participant('APR-2026-0003', 2, 'USER-1001', '박대표', '대표이사', '대표이사', 'approval', 'approved')], attachments: [{ id: 'ATT-0001', fileName: '베어링_규격서.pdf', fileSize: 248000, contentType: 'application/pdf', uploadedAt: '2026-09-01' }],
  },
  {
    id: 'APR-2026-0004', companyId: 'COMPANY-HPS', module: 'work-order', recordId: 'WO-2026-0001', title: '냉각수 펌프 예방정비', status: 'requested', requesterId: 'USER-1004', requesterName: '이기술', requesterDeptName: '기술운영팀', requesterTitle: '팀장', requestedAt: '2026-09-06', currentStep: 1, totalSteps: 2,
    participants: [participant('APR-2026-0004', 0, 'USER-1004', '이기술', '기술운영팀', '팀장', 'requester', 'approved'), participant('APR-2026-0004', 1, 'USER-1001', '박대표', '대표이사', '대표이사', 'approval', 'pending'), participant('APR-2026-0004', 2, 'USER-1003', '최관리', '경영관리팀', '담당', 'reference', 'none')],
  },
]
