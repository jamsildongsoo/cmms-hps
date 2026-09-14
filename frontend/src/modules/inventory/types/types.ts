import type { InventoryReferenceType, InventoryClosingStatus, InventoryTransactionType, InventoryTransactionReason } from '../../../../../shared/domain-codes'
export type { InventoryReferenceType, InventoryClosingStatus, InventoryTransactionType, InventoryTransactionReason } from '../../../../../shared/domain-codes'

/** 회사·창고·자재별 현재 재고 현황 */
export type InventoryBalance = {
  companyId: string
  warehouseId: string
  materialId: string
  quantity: number
  amount: number
  reservedQuantity: number
  availableQuantity: number
  updatedAt: string
}

/** 입고·출고·창고 간 이동·조정의 불변 원장 */
export type InventoryLedgerEntry = {
  id: string
  companyId: string
  warehouseId: string
  materialId: string
  transactionType: InventoryTransactionType
  transactionReason: InventoryTransactionReason
  quantity: number
  amount: number
  unitCost?: number
  counterpartyWarehouseId?: string
  referenceType: InventoryReferenceType
  referenceId: string
  /** 작업오더 연결 시 원본 문서의 사업장 ID */
  referenceSiteId?: string
  occurredAt: string
  createdBy: string
  createdAt: string
}

export type InventoryLedgerCreateRequest = Omit<
  InventoryLedgerEntry,
  'id' | 'createdBy' | 'createdAt'
>

/** 회사·창고별 월 마감 상태 */
export type InventoryClosingPeriod = {
  id: string
  companyId: string
  warehouseId: string
  yearMonth: string // YYYY-MM
  status: InventoryClosingStatus
  closedAt?: string
  closedBy?: string
}

/** 월 마감 시점의 회사·창고·자재별 수량·금액 스냅샷 */
export type InventoryClosingBalance = {
  closingPeriodId: string
  companyId: string
  warehouseId: string
  materialId: string
  openingQuantity: number
  openingAmount: number
  receiptQuantity: number
  receiptAmount: number
  issueQuantity: number
  issueAmount: number
  transferInQuantity: number
  transferInAmount: number
  transferOutQuantity: number
  transferOutAmount: number
  adjustmentQuantity: number
  adjustmentAmount: number
  closingQuantity: number
  closingAmount: number
}

export type InventoryClosingRequest = {
  companyId: string
  warehouseId: string
  yearMonth: string // YYYY-MM
}
