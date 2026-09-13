import type { MaterialListResponse, MaterialResponse } from '../../../entities/material/types'
import { command, query } from '../../../shared/api/http'

export async function getMaterials(params: { page?: number; pageSize?: number; searchType?: 'id' | 'name'; searchValue?: string } = {}): Promise<MaterialListResponse> {
  const queryParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => { if (value !== undefined && value !== '') queryParams.set(key, String(value)) })
  return query<MaterialListResponse>(`/api/materials?${queryParams.toString()}`)
}
export function getMaterial(id: string): Promise<MaterialResponse> { return query<MaterialResponse>(`/api/materials/${encodeURIComponent(id)}`) }
export function createMaterial(dto: Omit<MaterialResponse, 'id' | 'companyId' | 'companyName' | 'siteName'>) { return command<MaterialResponse>('/api/materials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dto) }) }
export function updateMaterial(id: string, dto: Partial<Omit<MaterialResponse, 'id' | 'companyId' | 'companyName' | 'siteName'>>) { return command<MaterialResponse>(`/api/materials/${encodeURIComponent(id)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dto) }) }
