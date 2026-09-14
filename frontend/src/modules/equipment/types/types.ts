export type Equipment = {
  // Unique identifier for the equipment
  id: string  
  companyId: string
  siteId: string
  // Name of the equipment
  name: string
  location: string
  code: string
  type: string
  installedAt: string
  maker: string
  model: string
  specification: string
  serialNumber: string  
  permitRequired: string
  summary: string
  status: string
  // autility fields - frontend에는 활용하지 않음 
  // createdAt: string
  // createdBy: string
  // updatedAt: string
  // updatedBy: string
}

export type EquipmentResponse = Equipment & { 
  // Additional fields for the response
  companyName: string
  siteName: string
}

export type EquipmentListResponse = {
  items: EquipmentResponse[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

// 신규 등록 요청: 설비 ID는 백엔드에서 생성한다고 가정
export type EquipmentCreateRequest = Omit<Equipment, 'id'>

// 전체 설비 정보를 보내는 PUT 방식 수정 요청
export type EquipmentUpdateRequest = Equipment
