export type AttachmentModule =
  | 'equipment'
  | 'pm-record'
  | 'work-order'
  | 'work-permit'
  | 'purchase-request'
  | 'purchase-order'
  | 'approval'

export type AttachmentGroupCode = 'general' | 'before' | 'during' | 'after' | 'approval'

export type AttachmentGroup = {
  id: string
  companyId: string
  siteId: string
  module: AttachmentModule
  recordId: string
  groupCode: AttachmentGroupCode
}

export type Attachment = {
  id: string
  groupId: string
  fileName: string
  fileSize: number
  contentType: string
  storagePath: string
  uploadedBy: string
  uploadedAt: string
}

export type AttachmentGroupResponse = AttachmentGroup & {
  attachments: Attachment[]
}

export type AttachmentGroupCreateRequest = Omit<AttachmentGroup, 'id'>

export type AttachmentUploadRequest = {
  groupId: string
  file: File
}
