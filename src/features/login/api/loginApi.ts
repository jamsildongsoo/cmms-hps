import type { LoginInfo } from '../../../entities/auth/types'

export type LoginRequest = {
  companyId: string
  id: string
  password: string
}

const USE_MOCK_LOGIN = true

const mockLogin = (request: LoginRequest): LoginInfo => ({
  companyId: request.companyId,
  companyName: '테스트 회사',
  siteId: 'TEST-SITE',
  siteName: '테스트 사업장',
  deptId: 'TEST-DEPT',
  deptName: '테스트 부서',
  userId: request.id,
  userName: request.id,
  roleId: 'user',
  scopeLevel: 'department',
  permissions: ['purchase.request.create'],
})

export async function login(request: LoginRequest): Promise<LoginInfo> {
  if (USE_MOCK_LOGIN) {
    // 백엔드 연결 전 임시 로그인입니다. 실제 연동 시 false로 변경합니다.
    return mockLogin(request)
  }

  /* 백엔드 로그인 연계 예시
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error('로그인에 실패했습니다.')
  }

  return response.json() as Promise<LoginInfo>
  */

  throw new Error('로그인 API가 설정되지 않았습니다.')
}
