import type { LoginInfo } from '../../../entities/auth/types'
import { setAuthSession, clearAuthSession } from '../auth-session'

export type LoginRequest = {
  companyId: string
  id: string
  password: string
}

export async function login(request: LoginRequest): Promise<LoginInfo> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ companyId: request.companyId, loginId: request.id, password: request.password }),
  })

  if (!response.ok) {
    throw new Error('로그인에 실패했습니다.')
  }

  const result = await response.json() as {
    accessToken: string
    refreshToken: string
    sessionId: string
    actor: Pick<LoginInfo, 'companyId' | 'siteId' | 'deptId' | 'userId' | 'roleId' | 'scopeLevel' | 'permissions'>
    profile: Pick<LoginInfo, 'companyName' | 'siteName' | 'deptName' | 'userName'>
  }
  setAuthSession({ accessToken: result.accessToken, refreshToken: result.refreshToken, sessionId: result.sessionId })
  return { ...result.actor, ...result.profile }
}

export function logout(): void {
  clearAuthSession()
}
