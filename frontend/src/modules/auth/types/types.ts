import type { UserPermission, UserRole, UserScopeLevel } from '../../org/types/types'

export type LoginInfo = {
  companyId: string
  companyName: string
  siteId: string
  siteName: string
  deptId: string
  deptName: string
  userId: string
  userName: string
  roleId: UserRole
  scopeLevel: UserScopeLevel
  permissions: UserPermission[]
}
