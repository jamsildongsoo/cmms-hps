import type { EquipmentResponse } from '../../../entities/equipment/types'

export const equipmentMockData: EquipmentResponse[] = [
  {
    id: 'EQ-1001', companyId: 'COMPANY-HPS', siteId: 'SITE-SEOUL', companyName: '한국플랜트서비스', siteName: '서울 생산사업장',
    name: '냉각수 펌프', location: '생산동 1층', type: '펌프', installedAt: '2026-09-01', maker: 'ABC', model: 'CP-100', specification: '30kW / 380V', serialNumber: 'CP100-260901', permitRequired: 'N', summary: '생산라인 냉각수 순환 설비', status: '사용중',
  },
  {
    id: 'EQ-1002', companyId: 'COMPANY-HPS', siteId: 'SITE-SEOUL', companyName: '한국플랜트서비스', siteName: '서울 생산사업장',
    name: '압축공기 컴프레서', location: '유틸리티동 2층', type: '컴프레서', installedAt: '2025-11-15', maker: 'K-TECH', model: 'AC-220', specification: '220kW / 8bar', serialNumber: 'AC220-251115', permitRequired: 'Y', summary: '공정용 압축공기 공급 설비', status: '사용중',
  },
  {
    id: 'EQ-1003', companyId: 'COMPANY-HPS', siteId: 'SITE-SEOUL', companyName: '한국플랜트서비스', siteName: '서울 생산사업장',
    name: '열교환기', location: '생산동 3층', type: '열교환기', installedAt: '2024-06-20', maker: 'HPS', model: 'HX-450', specification: '450m² / 10bar', serialNumber: 'HX450-240620', permitRequired: 'Y', summary: '공정 냉각수 열교환 설비', status: '점검중',
  },
]
