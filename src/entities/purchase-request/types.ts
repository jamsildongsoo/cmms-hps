export type PurchaseRequestStatus = 'draft' | 'requested' | 'approved' | 'rejected' | 'partiallyOrdered' | 'ordered' | 'partiallyDelivered' | 'delivered' | 'cancelled'

export type PurchaseRequest = {
  id: string
  companyId: string
  siteId: string
  departmentId: string
  requesterId: string
  purchaserId?: string
  name: string
  requestDate: string
  requiredDate: string
  expectedDeliveryDate?: string
  deliveryConfirmed: boolean
  purpose: string
  remarks: string
  status: PurchaseRequestStatus
  deleteYN: string
  items: PurchaseRequestItem[]
}

export type PurchaseRequestItem = {
  id: string
  materialId: string
  quantity: number
  unit: string
  requiredDate: string
  purpose: string
}

export type PurchaseRequestResponse = PurchaseRequest & {
  departmentName: string
  requesterName: string
  approvalStatus: string
  purchaseOrderId?: string
  items: PurchaseRequestItemResponse[]
}

export type PurchaseRequestItemResponse = PurchaseRequestItem & {
  materialName: string
  specification: string
}

export type PurchaseRequestCreateRequest = Omit<
  PurchaseRequest,
  'id' | 'status' | 'deleteYN' | 'items'
> & {
  items: Array<Omit<PurchaseRequestItem, 'id'>>
}

export type PurchaseRequestUpdateRequest = PurchaseRequest
