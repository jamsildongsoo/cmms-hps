export type CreateMaterialDto = {
  siteId: string
  name: string
  code: string
  type: string
  specification: string
  unit: string
  maker: string
  model: string
  standardPrice: string
  status: string
}
export type UpdateMaterialDto = Partial<CreateMaterialDto>
export type MaterialListQuery = { page?: string; pageSize?: string; searchType?: 'id' | 'name'; searchValue?: string }
