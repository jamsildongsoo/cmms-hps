import type { PmRecordListResponse, PmRecordResponse } from '../types/types'
import { command, query } from '../../../shared/api/http'
export function getPmRecords(params: { page?: number; pageSize?: number; searchType?: 'id' | 'name'; searchValue?: string } = {}) { const p = new URLSearchParams(); Object.entries(params).forEach(([key, value]) => { if (value !== undefined && value !== '') p.set(key, String(value)) }); return query<PmRecordListResponse>(`/api/pm-records?${p}`) }
export function getPmRecord(id: string) { return query<PmRecordResponse>(`/api/pm-records/${encodeURIComponent(id)}`) }
export function createPmRecord(body: unknown) { return command<PmRecordResponse>('/api/pm-records', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }) }
export function updatePmRecord(id: string, body: unknown) { return command<PmRecordResponse>(`/api/pm-records/${encodeURIComponent(id)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }) }
export function deletePmRecord(id: string) { return command<{ id: string }>(`/api/pm-records/${encodeURIComponent(id)}`, { method: 'DELETE' }) }
