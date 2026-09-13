export type StoreFileRequest = {
  companyId: string
  attachmentId: string
  itemNo: number
  fileName: string
  contentType: string
  content: Buffer
}

export type StoredFile = {
  /** 저장소 구현과 무관한 객체 식별자입니다. DB attachment_item.storagePath에 저장합니다. */
  storagePath: string
  fileName: string
  contentType: string
  fileSize: number
}

/** local, S3 등 저장소 구현이 지켜야 할 공통 계약입니다. */
export interface FileStorage {
  store(request: StoreFileRequest): Promise<StoredFile>
  read(storagePath: string): Promise<Buffer>
  remove(storagePath: string): Promise<void>
}
