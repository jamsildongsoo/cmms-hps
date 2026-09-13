import type { ApprovalActionRequest, ApprovalFolder, ApprovalParticipant, ApprovalResponse } from '../../../entities/approval/types'
import { command, query } from '../../../shared/api/http'

type BackendParticipant = Omit<ApprovalParticipant, 'type' | 'status'> & { actionCode: 'S' | 'A' | 'G' | 'E'; status: 'P' | 'Y' | 'N' }
type BackendApproval = Omit<ApprovalResponse, 'status' | 'participants' | 'attachments'> & { status: 'D' | 'P' | 'C' | 'R' | 'X'; participants: BackendParticipant[] }

export function getApprovals(folder?: ApprovalFolder): Promise<ApprovalResponse[]> {
  const suffix = folder ? `?folder=${encodeURIComponent(folder)}` : ''
  return query<BackendApproval[]>(`/api/approvals${suffix}`).then((items) => items.map(toApproval))
}
export function getApproval(id: string): Promise<ApprovalResponse> { return query<BackendApproval>(`/api/approvals/${encodeURIComponent(id)}`).then(toApproval) }

export function createApprovalDraft(input: Pick<ApprovalResponse, 'module' | 'recordId' | 'title' | 'content'> & { participants: Array<Pick<ApprovalParticipant, 'userId' | 'type'>>; submit?: boolean }): Promise<ApprovalResponse> {
  return command<BackendApproval>('/api/approvals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...input, participants: input.participants.filter((item) => item.type !== 'requester').map((item) => ({ userId: item.userId, actionCode: toActionCode(item.type) })) }) }).then(toApproval)
}

export function saveApprovalDraft(id: string, input: Pick<ApprovalResponse, 'title' | 'content'> & { participants?: Array<Pick<ApprovalParticipant, 'userId' | 'type'>> }): Promise<ApprovalResponse> {
  return command<BackendApproval>(`/api/approvals/${encodeURIComponent(id)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...input, participants: input.participants?.filter((item) => item.type !== 'requester').map((item) => ({ userId: item.userId, actionCode: toActionCode(item.type) })) }) }).then(toApproval)
}

export function submitApproval(id: string): Promise<ApprovalResponse> { return command<BackendApproval>(`/api/approvals/${encodeURIComponent(id)}/submit`, { method: 'POST' }).then(toApproval) }
export function processApproval(id: string, action: ApprovalActionRequest): Promise<ApprovalResponse> { return command<BackendApproval>(`/api/approvals/${encodeURIComponent(id)}/process`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(action) }).then(toApproval) }
export function deleteApproval(id: string): Promise<{ id: string }> { return command<{ id: string }>(`/api/approvals/${encodeURIComponent(id)}`, { method: 'DELETE' }) }

function toApproval(value: BackendApproval): ApprovalResponse {
  return {
    ...value,
    status: ({ D: 'draft', P: 'inProgress', C: 'approved', R: 'rejected', X: 'cancelled' } as const)[value.status],
    participants: value.participants.map((participant) => ({
      ...participant,
      type: ({ S: 'requester', A: 'approval', G: 'agreement', E: 'reference' } as const)[participant.actionCode],
      status: ({ P: 'pending', Y: participant.actionCode === 'S' ? 'none' : 'approved', N: 'rejected' } as const)[participant.status],
    })),
  }
}

function toActionCode(type: ApprovalParticipant['type']): 'A' | 'G' | 'E' { return type === 'agreement' ? 'G' : type === 'reference' ? 'E' : 'A' }
