import type { MaterialResponse } from '../../../entities/material/types'

export const materialMockData: MaterialResponse[] = [
  {
    id: 'MAT-1001', companyId: 'COMPANY-HPS', siteId: 'SITE-SEOUL', companyName: '한국플랜트서비스', siteName: '서울 생산사업장',
    name: '베어링 6205', category: '기계부품', specification: '6205-2RS', unit: 'EA', maker: 'SKF', model: '6205-2RS', standardPrice: '18500', status: '사용중', deleteYN: 'N',
  },
  {
    id: 'MAT-1002', companyId: 'COMPANY-HPS', siteId: 'SITE-SEOUL', companyName: '한국플랜트서비스', siteName: '서울 생산사업장',
    name: '윤활유 VG 68', category: '윤활유', specification: 'ISO VG 68 / 20L', unit: '통', maker: 'K-OIL', model: 'VG68', standardPrice: '76000', status: '사용중', deleteYN: 'N',
  },
  {
    id: 'MAT-1003', companyId: 'COMPANY-HPS', siteId: 'SITE-SEOUL', companyName: '한국플랜트서비스', siteName: '서울 생산사업장',
    name: '메카니컬 씰', category: '펌프부품', specification: '45mm / SUS304', unit: 'EA', maker: 'SEALTECH', model: 'MS-45', standardPrice: '42000', status: '사용중', deleteYN: 'N',
  },
]
