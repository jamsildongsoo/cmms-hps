import type { UserPermission, UserRole, UserScopeLevel } from '../../../../../shared/domain-codes'

export type CreateCompanyDto = { id: string; name: string }
export type UpdateCompanyDto = { name?: string }

export type CreateSiteDto = { id: string; name: string }
export type UpdateSiteDto = { name?: string }

export type CreateDeptDto = { id: string; siteId: string; name: string; parentId?: string | null }
export type UpdateDeptDto = { siteId?: string; name?: string; parentId?: string | null }

export type CreateWarehouseDto = { id: string; siteId: string; name: string }
export type UpdateWarehouseDto = { siteId?: string; name?: string }

export type CreateUserDto = {
  id: string
  deptId: string
  name: string
  email: string
  phone: string
  title: string
  position: string
  roleId: UserRole
  scopeLevel: UserScopeLevel
}

export type UpdateUserDto = Partial<Omit<CreateUserDto, 'id'>> & {
  useYN?: string
}

export type OrganizationUserResponse = {
  id: string
  companyId: string
  siteId: string
  deptId: string
  name: string
  email: string
  phone: string
  title: string
  position: string
  useYN: string
  roleId: UserRole
  permissions: UserPermission[]
  scopeLevel: UserScopeLevel
  deleteYN: string
}
