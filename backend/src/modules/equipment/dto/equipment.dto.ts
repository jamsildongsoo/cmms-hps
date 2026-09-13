export type CreateEquipmentDto = {
  siteId: string
  name: string
  location: string
  code: string
  type: string
  installedAt: string
  maker: string
  model: string
  specification: string
  serialNumber: string
  permitRequired: string
  summary: string
  status: string
}

export type UpdateEquipmentDto = Partial<CreateEquipmentDto>

export type EquipmentSearchType = 'id' | 'name'

export type EquipmentListQuery = {
  page?: string
  pageSize?: string
  searchType?: EquipmentSearchType
  searchValue?: string
}
