import type { PurchaseOrderCreateRequest, PurchaseOrderResponse } from '../../../entities/purchase-order/types'
import type { PurchaseRequestCreateRequest, PurchaseRequestResponse } from '../../../entities/purchase-request/types'
import { purchaseOrderMockData, purchaseRequestMockData } from './mock'

const requests = [...purchaseRequestMockData]
const orders = [...purchaseOrderMockData]

export async function getPurchaseRequests(): Promise<PurchaseRequestResponse[]> {
  return [...requests]
}

export async function createPurchaseRequest(request: PurchaseRequestCreateRequest): Promise<PurchaseRequestResponse> {
  const created: PurchaseRequestResponse = {
    ...request, id: `PR-2026-${String(requests.length + 1).padStart(4, '0')}`, status: 'requested', deleteYN: 'N',
    departmentName: '경영관리팀', requesterName: '로그인 사용자', approvalStatus: '대기',
    items: request.items.map((item, index) => ({ ...item, id: `PRI-${Date.now()}-${index}`, materialName: item.materialId, specification: '-' })),
  }
  requests.push(created)
  return created
}

export async function getPurchaseOrders(): Promise<PurchaseOrderResponse[]> {
  return [...orders]
}

export async function createPurchaseOrder(request: PurchaseOrderCreateRequest): Promise<PurchaseOrderResponse> {
  const created: PurchaseOrderResponse = {
    ...request, id: `PO-2026-${String(orders.length + 1).padStart(4, '0')}`, status: 'draft', deleteYN: 'N',
    departmentName: '구매부서', warehouseName: request.warehouseId, purchaserName: '로그인 사용자', vendorName: request.vendorId,
    approvalStatus: '작성중', items: request.items.map((item, index) => ({ ...item, id: `POI-${Date.now()}-${index}`, amount: item.quantity * item.unitPrice, materialName: item.materialId, specification: '-' })),
  }
  orders.push(created)
  return created
}
