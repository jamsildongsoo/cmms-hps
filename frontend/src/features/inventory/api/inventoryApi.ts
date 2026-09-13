import type { InventoryLedgerCreateRequest, InventoryLedgerEntry } from '../../../entities/inventory/types'
import { command, query } from '../../../shared/api/http'

export async function getInventoryLedger(): Promise<InventoryLedgerEntry[]> {
  const response = await query<{ items: InventoryLedgerEntry[] }>('/api/inventory/ledger?page=1&pageSize=100')
  return response.items
}

export async function createInventoryTransaction(request: InventoryLedgerCreateRequest, _userId: string): Promise<InventoryLedgerEntry> {
  return command<InventoryLedgerEntry>('/api/inventory/transactions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...request, quantity: String(request.quantity), amount: String(request.amount) }) })
}
