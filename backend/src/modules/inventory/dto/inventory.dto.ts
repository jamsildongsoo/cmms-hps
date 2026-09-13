import type { InventoryReferenceType,InventoryTransactionReason,InventoryTransactionType } from '../../../../../shared/domain-codes'
export type InventoryListQuery={page?:string;pageSize?:string;searchType?:'materialId'|'warehouseId'|'referenceId';searchValue?:string;fromDate?:string;toDate?:string}
export type CreateInventoryTransactionDto={warehouseId:string;materialId:string;transactionType:InventoryTransactionType;transactionReason:InventoryTransactionReason;quantity:string;amount:string;unitCost?:string|null;referenceType:InventoryReferenceType;referenceId:string;occurredAt:string}
