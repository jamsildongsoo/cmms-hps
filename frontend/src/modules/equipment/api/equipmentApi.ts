import type { Equipment, EquipmentListResponse, EquipmentResponse } from '../types/types'
import { command, query } from '../../../shared/api/http'

export async function getEquipments(params: { page?: number; pageSize?: number; searchType?: 'id' | 'name'; searchValue?: string } = {}): Promise<EquipmentListResponse> {
  const queryParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => { if (value !== undefined && value !== '') queryParams.set(key, String(value)) })
  return query<EquipmentListResponse>(`/api/equipments?${queryParams.toString()}`)
}

export function getEquipment(id: string): Promise<EquipmentResponse> {
  return query<EquipmentResponse>(`/api/equipments/${encodeURIComponent(id)}`)
}

export function createEquipment(dto: Omit<Equipment, 'id' | 'companyId'>): Promise<EquipmentResponse> {
  return command<EquipmentResponse>('/api/equipments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dto) })
}

export function updateEquipment(id: string, dto: Partial<Omit<Equipment, 'id' | 'companyId'>>): Promise<EquipmentResponse> {
  return command<EquipmentResponse>(`/api/equipments/${encodeURIComponent(id)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dto) })
}

export function deleteEquipment(id: string): Promise<{ id: string; deleteYN: 'Y' }> {
  return command<{ id: string; deleteYN: 'Y' }>(`/api/equipments/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
