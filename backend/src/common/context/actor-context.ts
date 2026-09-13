import type { UserPermission, UserRole, UserScopeLevel } from '../../../../shared/domain-codes'

/** 인증된 요청 주체입니다. client가 전송한 user/company 값으로 만들지 않습니다. */
export type ActorContext = {
  userId: string
  companyId: string
  siteId: string | null
  deptId: string | null
  roleId: UserRole
  permissions: UserPermission[]
  scopeLevel: UserScopeLevel
}

export type AuthenticatedRequest = {
  user?: ActorContext
  requestId?: string
  headers: Record<string, string | string[] | undefined>
}
