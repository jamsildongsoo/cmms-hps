import type { PurchaseOrderResponse } from '../../../entities/purchase-order/types'
import type { PurchaseRequestResponse } from '../../../entities/purchase-request/types'

export const purchaseRequestMockData: PurchaseRequestResponse[] = [
  {
    id: 'PR-2026-0001', companyId: 'COMPANY-HPS', siteId: 'SITE-01', departmentId: 'DEPT-TECH', requesterId: 'USER-1005',
    purchaserId: 'USER-1002', name: '펌프 정비용 베어링 구매', requestDate: '2026-09-01', requiredDate: '2026-09-15', expectedDeliveryDate: '2026-09-12', deliveryConfirmed: false,
    purpose: '예방정비 교체품', remarks: '', status: 'approved', deleteYN: 'N', departmentName: '기술운영팀', requesterName: '정운영', approvalStatus: '승인', purchaseOrderId: undefined,
    items: [{ id: 'PRI-0001', materialId: 'MAT-1001', materialName: '베어링 6205', specification: 'SKF', quantity: 4, unit: 'EA', requiredDate: '2026-09-15', purpose: '펌프 교체' }],
  },
  {
    id: 'PR-2026-0002', companyId: 'COMPANY-HPS', siteId: 'SITE-HQ', departmentId: 'DEPT-MGMT', requesterId: 'USER-1003',
    name: '안전보호구 구매', requestDate: '2026-09-03', requiredDate: '2026-09-20', deliveryConfirmed: false,
    purpose: '현장 지급', remarks: '신규 입사자 지급분 포함', status: 'requested', deleteYN: 'N', departmentName: '경영관리팀', requesterName: '최관리', approvalStatus: '대기',
    items: [{ id: 'PRI-0002', materialId: 'MAT-1002', materialName: '안전장갑', specification: '절단방지 5등급', quantity: 20, unit: 'EA', requiredDate: '2026-09-20', purpose: '현장 지급' }],
  },
]

export const purchaseOrderMockData: PurchaseOrderResponse[] = [
  {
    id: 'PO-2026-0001', companyId: 'COMPANY-HPS', siteId: 'SITE-01', departmentId: 'DEPT-TECH', warehouseId: 'WH-01', purchaserId: 'USER-1002',
    source: 'purchase-request', purchaseRequestId: 'PR-2026-0001', vendorId: 'VENDOR-001', orderDate: '2026-09-04', expectedDeliveryDate: '2026-09-12', name: '펌프 정비용 베어링 구매', remarks: '', status: 'issued', deleteYN: 'N',
    departmentName: '기술운영팀', warehouseName: '1번 창고', purchaserName: '김경영', vendorName: '한국베어링상사', approvalStatus: '승인',
    items: [{ id: 'POI-0001', materialId: 'MAT-1001', materialName: '베어링 6205', specification: 'SKF', quantity: 4, unit: 'EA', unitPrice: 12000, amount: 48000, expectedDeliveryDate: '2026-09-12' }],
  },
]
