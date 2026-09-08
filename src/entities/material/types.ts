/**
 * 자재 마스터의 업무 데이터입니다.
 * 재고 수량·입출고 이력은 inventory 도메인에서 관리합니다.
 */
export type Material = {
  id: string
  companyId: string
  siteId: string
  name: string
  category: string
  specification: string
  unit: string
  maker: string
  model: string
  standardPrice: string
  status: string
  deleteYN: string
}

export type MaterialResponse = Material & {
  companyName: string
  siteName: string
}

// 신규 등록 요청: 자재 ID는 백엔드에서 생성한다고 가정
export type MaterialCreateRequest = Omit<Material, 'id'>

// 전체 자재 정보를 보내는 PUT 방식 수정 요청
export type MaterialUpdateRequest = Material
