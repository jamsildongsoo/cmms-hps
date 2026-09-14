import type { PurchaseOrderStatus, PurchaseOrderSource } from '../../../../../shared/domain-codes'
export type { PurchaseOrderStatus, PurchaseOrderSource } from '../../../../../shared/domain-codes'

export type PurchaseOrder = {
  id: string
  companyId: string
  siteId: string
  deptId: string
  warehouseId: string
  purchaserId: string
  source: PurchaseOrderSource
  purchaseRequestId?: string
  vendorId: string
  orderDate: string
  expectedDeliveryDate: string
  name: string
  remarks: string
  status: PurchaseOrderStatus
  deleteYN: string
  items: PurchaseOrderItem[]
}

export type PurchaseOrderItem = {
  id: string
  materialId: string
  quantity: number
  unit: string
  unitPrice: number
  amount: number
  expectedDeliveryDate: string
  materialName?: string
}

export type PurchaseOrderResponse = PurchaseOrder & {
  departmentName: string
  warehouseName: string
  purchaserName: string
  vendorName: string
  approvalStatus: string
  items: PurchaseOrderItemResponse[]
}

export type PurchaseOrderItemResponse = PurchaseOrderItem & {
  materialName: string
  specification: string
}

export type PurchaseOrderCreateRequest = Omit<
  PurchaseOrder,
  'id' | 'status' | 'deleteYN' | 'items'
> & {
  items: Array<Omit<PurchaseOrderItem, 'id' | 'amount'>>
}

export type PurchaseOrderUpdateRequest = PurchaseOrder
