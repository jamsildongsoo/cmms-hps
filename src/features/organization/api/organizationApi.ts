import type { OrganizationMockData } from './mock'
import { organizationMockData } from './mock'

const USE_MOCK_DATA = true

export async function getOrganization(): Promise<OrganizationMockData> {
  if (USE_MOCK_DATA) return organizationMockData

  /* 백엔드 연계 예시
  const response = await fetch('/api/organization')
  if (!response.ok) throw new Error('조직정보를 조회할 수 없습니다.')
  return response.json() as Promise<OrganizationMockData>
  */

  throw new Error('조직정보 API가 설정되지 않았습니다.')
}
