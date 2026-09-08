import type { MaterialResponse } from '../../../entities/material/types'
import { materialMockData } from './mock'

const USE_MOCK_DATA = true

export async function getMaterials(): Promise<MaterialResponse[]> {
  if (USE_MOCK_DATA) return materialMockData

  /* 백엔드 연계 예시
  const response = await fetch('/api/materials')
  if (!response.ok) throw new Error('자재 목록을 조회할 수 없습니다.')
  return response.json() as Promise<MaterialResponse[]>
  */

  throw new Error('자재 API가 설정되지 않았습니다.')
}
