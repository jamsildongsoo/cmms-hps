import type { InventoryLedgerCreateRequest, InventoryLedgerEntry } from '../../../entities/inventory/types'

const ledger: InventoryLedgerEntry[] = [
  { id: 'IL-0001', companyId: 'COMPANY-HPS', warehouseId: 'WH-01', materialId: 'MAT-1001', transactionType: 'receipt', transactionReason: 'purchase-order-receipt', quantity: 10, amount: 120000, unitCost: 12000, referenceType: 'purchase-order', referenceId: 'PO-2026-0001', occurredAt: '2026-09-05', createdBy: 'USER-1002', createdAt: '2026-09-05' },
]

export async function getInventoryLedger(): Promise<InventoryLedgerEntry[]> {
  return [...ledger]
}

export async function createInventoryTransaction(request: InventoryLedgerCreateRequest, userId: string): Promise<InventoryLedgerEntry> {
  const created = { ...request, id: `IL-${Date.now()}`, createdBy: userId, createdAt: new Date().toISOString().slice(0, 10) }
  ledger.push(created)
  return created
}
