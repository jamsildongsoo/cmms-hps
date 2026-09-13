export type PmRecordItemDto = { id?: string; inspectionName: string; inspectionMethod: string; standardValue: string; result: string; unit: string }
export type CreatePmRecordDto = { siteId: string; deptId: string; name: string; summary: string; equipmentId: string; code: string; type: string; date: string; workerId: string; decision: string; items: PmRecordItemDto[] }
export type UpdatePmRecordDto = Partial<CreatePmRecordDto>
export type PmRecordListQuery = { page?: string; pageSize?: string; searchType?: 'id' | 'name'; searchValue?: string }
