import type { WorkOrderPhaseType } from '../../../../../shared/domain-codes'
export type { WorkOrderPhaseType } from '../../../../../shared/domain-codes'

export type WorkOrder = {
  // PK id + companyId + siteId 
  id: string
  companyId: string
  siteId: string
  deptId: string
  name: string
  equipmentId: string
  code: string
  type: string
  priority: string
  permitRequired: boolean
  status: string
  deleteYN: string
  plan: WorkOrderPhase
  result?: WorkOrderPhase
  items: WorkOrderItem[]
  // autility fields - frontend에는 활용하지 않음 
  // createdAt: string
  // createdBy: string
  // updatedAt: string
  // updatedBy: string
}

export type WorkOrderItem = {
  id: string
  name: string
  method: string
  result: string
}

export type WorkOrderPhase = {
  phase: WorkOrderPhaseType
  date: string // YYYY-MM-DD
  workerId: string
  workerName?: string
  manHours: string
  manHoursUnit: string
  cost: string
  summary: string //remarks 아닌 작업 요약 
}



export type WorkOrderCreateRequest = Omit<WorkOrder, 'id' | 'result'>
export type WorkOrderUpdateRequest = WorkOrder
export type WorkOrderResponse = WorkOrder & { equipmentName: string; maker?: string; model?: string }
export type WorkOrderListResponse = { items: WorkOrderResponse[]; page: number; pageSize: number; total: number; totalPages: number }
