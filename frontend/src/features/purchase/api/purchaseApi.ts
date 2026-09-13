import type { PurchaseOrderCreateRequest, PurchaseOrderResponse } from '../../../entities/purchase-order/types'
import type { PurchaseRequestCreateRequest, PurchaseRequestResponse } from '../../../entities/purchase-request/types'
import { command, query } from '../../../shared/api/http'

export async function getPurchaseRequests(): Promise<PurchaseRequestResponse[]> {
  const response = await query<{ items: PurchaseRequestResponse[] }>('/api/purchase-requests?page=1&pageSize=100')
  return response.items
}

export async function createPurchaseRequest(request: PurchaseRequestCreateRequest): Promise<PurchaseRequestResponse> {
  return command<PurchaseRequestResponse>('/api/purchase-requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request) })
}

export async function getPurchaseOrders(): Promise<PurchaseOrderResponse[]> {
  const response = await query<{ items: PurchaseOrderResponse[] }>('/api/purchase-orders?page=1&pageSize=100')
  return response.items
}

export async function createPurchaseOrder(request: PurchaseOrderCreateRequest): Promise<PurchaseOrderResponse> {
  return command<PurchaseOrderResponse>('/api/purchase-orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request) })
}
