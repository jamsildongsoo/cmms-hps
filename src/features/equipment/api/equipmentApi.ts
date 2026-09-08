import type { EquipmentResponse } from '../../../entities/equipment/types'
import { equipmentMockData } from './mock'

const USE_MOCK_DATA = true

export async function getEquipments(): Promise<EquipmentResponse[]> {
  if (USE_MOCK_DATA) return equipmentMockData

  /* 백엔드 연계 예시
  const response = await fetch('/api/equipments')
  if (!response.ok) throw new Error('설비 목록을 조회할 수 없습니다.')
  return response.json() as Promise<EquipmentResponse[]>
  */

  throw new Error('설비 API가 설정되지 않았습니다.')
}
