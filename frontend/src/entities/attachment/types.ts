export type Attachment = {
  id: string
  companyId: string
  siteId: string | null
  module: string
  recordId: string | null
  deleteYN: string
}

export type AttachmentItem = {
  attachmentId: string
  itemNo: number
  fileName: string
  fileSize: number
  contentType: string
}

export type AttachmentResponse = Attachment & {
  items: AttachmentItem[]
}

export type AttachmentCreateRequest = {
  module: string
  recordId?: string | null
  siteId?: string | null
  attachmentId?: string
}

export type AttachmentUploadRequest = {
  module: string
  recordId?: string | null
  siteId?: string | null
  attachmentId?: string
  file: File
}
