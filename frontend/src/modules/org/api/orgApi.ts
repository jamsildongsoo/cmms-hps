import type { Dept, OrgResponse, OrgUser, Site, Warehouse } from '../types/types'
import { command, query } from '../../../shared/api/http'

export function getOrganization(): Promise<OrgResponse> {
  return query<OrgResponse>('/api/org')
}

export function createSite(dto: Pick<Site, 'id' | 'name'>): Promise<Site> {
  return command<Site>('/api/org/sites', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dto) })
}

export function createDept(dto: Pick<Dept, 'id' | 'siteId' | 'name'> & { parentId?: string | null }): Promise<Dept> {
  return command<Dept>('/api/org/depts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dto) })
}

export function createWarehouse(dto: Pick<Warehouse, 'id' | 'siteId' | 'name'>): Promise<Warehouse> {
  return command<Warehouse>('/api/org/warehouses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dto) })
}

export function createUser(dto: Omit<OrgUser, 'companyId' | 'siteId' | 'permissions' | 'deleteYN' | 'useYN'>): Promise<OrgUser> {
  return command<OrgUser>('/api/org/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dto) })
}
