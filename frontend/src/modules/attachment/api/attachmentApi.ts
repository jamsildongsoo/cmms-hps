import type { AttachmentResponse, AttachmentUploadRequest } from '../types/types'
import { command, query } from '../../../shared/api/http'
import { getAccessToken } from '../../auth/api/auth-session'

export function getAttachments(module: string, recordId: string): Promise<AttachmentResponse | null> {
  return query<AttachmentResponse | null>(`/api/attachments/record/${encodeURIComponent(module)}/${encodeURIComponent(recordId)}`)
}

export function getAttachment(attachmentId: string): Promise<AttachmentResponse> {
  return query<AttachmentResponse>(`/api/attachments/${encodeURIComponent(attachmentId)}`)
}

export function uploadAttachment(request: AttachmentUploadRequest): Promise<AttachmentResponse> {
  const body = new FormData()
  body.append('module', request.module)
  if (request.recordId) body.append('recordId', request.recordId)
  if (request.siteId) body.append('siteId', request.siteId)
  if (request.attachmentId) body.append('attachmentId', request.attachmentId)
  body.append('file', request.file)
  return command<AttachmentResponse>('/api/attachments', { method: 'POST', body })
}

export function deleteAttachmentItem(attachmentId: string, itemNo: number): Promise<{ attachmentId: string; itemNo: number }> {
  return command<{ attachmentId: string; itemNo: number }>(`/api/attachments/${encodeURIComponent(attachmentId)}/items/${itemNo}`, { method: 'DELETE' })
}

export async function downloadAttachment(attachmentId: string, itemNo: number, fileName: string): Promise<void> {
  const headers = new Headers()
  const token = getAccessToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const response = await fetch(`/api/attachments/${encodeURIComponent(attachmentId)}/items/${itemNo}/download`, { headers, credentials: 'include' })
  if (!response.ok) throw new Error('첨부파일을 다운로드할 수 없습니다.')
  const url = URL.createObjectURL(await response.blob())
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}
