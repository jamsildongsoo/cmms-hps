export type PmRecord = {
  id: string
  companyId: string
  siteId: string
  deptId: string
  name: string
  summary: string //점검요약 
  equipmentId: string
  code: string
  type: string
  date: string // YYYY-MM-DD
  workerId: string
  decision: string  //양호, 이상, 보류
  deleteYN: string
  items: PmRecordItem[]
  // autility fields - frontend에는 활용하지 않음 
  // createdAt: string
  // createdBy: string
  // updatedAt: string
  // updatedBy: string
}

export type PmRecordItem = {
  id: string
  inspectionName: string
  inspectionMethod: string
  standardValue: string
  result: string
  unit: string
  // item은 감사필드 없음. hard deletion으로 삭제됨.
}

export type PmRecordCreateRequest = Omit<PmRecord, 'id'> & {
  items: Array<Omit<PmRecordItem, 'id'>>
}

export type PmRecordUpdateRequest = PmRecord

export type PmRecordResponse = PmRecord & {
  workerName: string
  equipmentName: string
  maker: string
  model: string
  approvalStatus: string
}
export type PmRecordListResponse = { items: PmRecordResponse[]; page: number; pageSize: number; total: number; totalPages: number }
