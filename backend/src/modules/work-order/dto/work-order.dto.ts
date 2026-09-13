import type { WorkOrderPhaseType } from '../../../../../shared/domain-codes'
export type WorkOrderPhaseDto = { phase: WorkOrderPhaseType; date: string; workerId: string; manHours: string; manHoursUnit: string; cost: string; summary: string }
export type WorkOrderItemDto = { id?: string; name: string; method: string; result: string }
export type CreateWorkOrderDto = { siteId: string; deptId: string; name: string; equipmentId: string; code: string; type: string; priority: string; permitRequired: boolean; status: string; plan: WorkOrderPhaseDto; result?: WorkOrderPhaseDto; items: WorkOrderItemDto[] }
export type UpdateWorkOrderDto = Partial<CreateWorkOrderDto>
export type WorkOrderListQuery = { page?: string; pageSize?: string; searchType?: 'id'|'name'; searchValue?: string }
