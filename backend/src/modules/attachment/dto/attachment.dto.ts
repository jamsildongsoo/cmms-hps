export type CreateAttachmentDto = {
  /** 호출 모듈이 전달하는 값이며 공통부에서 허용목록을 검사하지 않습니다. */
  module: string
  recordId?: string | null
  siteId?: string | null
  attachmentId?: string
}

export type AttachmentItemResponse = {
  attachmentId: string
  itemNo: number
  fileName: string
  fileSize: number
  contentType: string
}

export type AttachmentResponse = {
  id: string
  companyId: string
  siteId: string | null
  module: string
  recordId: string | null
  deleteYN: string
  items: AttachmentItemResponse[]
}
