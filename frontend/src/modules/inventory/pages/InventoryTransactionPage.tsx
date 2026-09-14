import { INVENTORY_TRANSACTION_TYPE_LABELS as labels } from '../../../../../shared/domain-codes'
import { INVENTORY_TRANSACTION_REASON_LABELS as reasonLabels } from '../../../../../shared/domain-codes'
import { useEffect, useState } from 'react'
import type { LoginInfo } from '../../auth/types/types'
import type { InventoryTransactionReason, InventoryTransactionType } from '../types/types'
import type { PurchaseOrderResponse } from '../../purchase-order/types/types'
import { getPurchaseOrders } from '../../purchase-order/api/purchaseApi'
import { createInventoryTransaction } from '../api/inventoryApi'

type Props = { session: LoginInfo }
type TransactionTab = 'receipt' | 'issue'
type ReceiptReason = 'purchase-order-receipt' | 'inventory-transfer-in' | 'inventory-adjustment'
type IssueReason = 'purchase-request-issue' | 'inventory-transfer-out'
type TransactionItemForm = { materialId: string; materialName: string; quantity: string; unit: string }

const createTransactionItems = (): TransactionItemForm[] => [{ materialId: 'MAT-1001', materialName: '', quantity: '1', unit: 'EA' }]

export default function InventoryTransactionPage({ session }: Props) {
  const [activeTab, setActiveTab] = useState<TransactionTab>('receipt')
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderResponse[]>([])
  const [receiptReason, setReceiptReason] = useState<ReceiptReason>('purchase-order-receipt')
  const [issueReason, setIssueReason] = useState<IssueReason>('purchase-request-issue')
  const [warehouseId, setWarehouseId] = useState('WH-01')
  const [referenceId, setReferenceId] = useState('')
  const [occurredAt, setOccurredAt] = useState(new Date().toISOString().slice(0, 10))
  const [transactionItems, setTransactionItems] = useState<TransactionItemForm[]>(createTransactionItems)

  useEffect(() => { void getPurchaseOrders().then(setPurchaseOrders) }, [])

  const resetForm = () => {
    setReceiptReason('purchase-order-receipt')
    setIssueReason('purchase-request-issue')
    setWarehouseId('WH-01')
    setReferenceId('')
    setOccurredAt(new Date().toISOString().slice(0, 10))
    setTransactionItems(createTransactionItems())
  }

  const changeTab = (tab: TransactionTab) => {
    setActiveTab(tab)
    setReferenceId('')
    setTransactionItems(createTransactionItems())
  }

  const changeReason = (reason: ReceiptReason | IssueReason) => {
    if (activeTab === 'receipt') setReceiptReason(reason as ReceiptReason)
    else setIssueReason(reason as IssueReason)
    setReferenceId('')
    setTransactionItems(createTransactionItems())
  }

  const selectPurchaseOrder = (purchaseOrderId: string) => {
    const order = purchaseOrders.find((item) => item.id === purchaseOrderId)
    setReferenceId(purchaseOrderId)
    if (!order) return
    setWarehouseId(order.warehouseId)
    setTransactionItems(order.items.map((item) => ({ materialId: item.materialId, materialName: item.materialName ?? '', quantity: String(item.quantity), unit: item.unit })))
  }

  const updateTransactionItem = (index: number, field: keyof TransactionItemForm, value: string) => setTransactionItems((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item))
  const addTransactionItem = () => setTransactionItems((current) => [...current, { materialId: '', materialName: '', quantity: '', unit: 'EA' }])
  const removeTransactionItem = (index: number) => setTransactionItems((current) => current.length === 1 ? current : current.filter((_, itemIndex) => itemIndex !== index))

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const items = transactionItems.filter((item) => item.materialId && item.quantity)
    if (!items.length) return
    const transactionType: InventoryTransactionType = activeTab
    const transactionReason: InventoryTransactionReason = activeTab === 'receipt' ? receiptReason : issueReason
    const referenceType = transactionReason === 'purchase-order-receipt' ? 'purchase-order' : transactionReason.includes('transfer') ? 'inventory-transfer' : activeTab === 'issue' ? 'purchase-request' : 'inventory-adjustment'
    // TODO: 백엔드에서는 입고/출고 헤더와 품목을 하나의 거래로 저장하고 재고 잔액을 갱신합니다.
    await Promise.all(items.map((item) => createInventoryTransaction({ companyId: session.companyId, warehouseId, materialId: item.materialId, transactionType, transactionReason, quantity: Number(item.quantity), amount: 0, referenceType, referenceId: referenceId || '-', occurredAt }, session.userId)))
    resetForm()
  }

  return (
    <main className="page page-screen">
      <header className="page-header"><div><p className="eyebrow">Inventory</p><h1>재고처리</h1></div><div className="page-actions"><button className="button button--neutral button--form-action" type="button" onClick={resetForm}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.34-5.66M4 4v5h5" /></svg>초기화</button><button className="button button--primary button--form-action" type="submit" form="inventory-transaction-form"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 4h12l2 2v14H5V4Zm3 0v6h6V4M8 16h8" /></svg>{labels[activeTab]} 저장</button></div></header>
      <div className="tabs" role="tablist" aria-label="재고처리 구분">{(['receipt', 'issue'] as TransactionTab[]).map((tab) => <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} type="button" role="tab" aria-selected={activeTab === tab} onClick={() => changeTab(tab)}>{labels[tab]}</button>)}</div>
      <form id="inventory-transaction-form" onSubmit={submit}>
        <section className="card filter-card"><h2 className="card-title">{labels[activeTab]} 헤더정보</h2><div className="form-grid form-grid--4">
          <label className="field">처리일<input required type="date" value={occurredAt} onChange={(event) => setOccurredAt(event.target.value)} /></label>
          <label className="field">처리창고<select value={warehouseId} onChange={(event) => setWarehouseId(event.target.value)}><option value="WH-HQ">본사 창고</option><option value="WH-01">1번 창고</option></select></label>
          <label className="field">처리유형<select value={activeTab === 'receipt' ? receiptReason : issueReason} onChange={(event) => changeReason(event.target.value as ReceiptReason | IssueReason)}>{activeTab === 'receipt' ? <><option value="purchase-order-receipt">{reasonLabels['purchase-order-receipt']}</option><option value="inventory-transfer-in">{reasonLabels['inventory-transfer-in']}</option><option value="inventory-adjustment">{reasonLabels['inventory-adjustment']}</option></> : <><option value="purchase-request-issue">{reasonLabels['purchase-request-issue']}</option><option value="inventory-transfer-out">{reasonLabels['inventory-transfer-out']}</option></>}</select></label>
          {activeTab === 'receipt' && receiptReason === 'purchase-order-receipt' ? <label className="field field--span-2">참고 구매오더<select value={referenceId} onChange={(event) => selectPurchaseOrder(event.target.value)}><option value="">구매오더를 선택하세요</option>{purchaseOrders.filter((item) => item.status !== 'received').map((item) => <option key={item.id} value={item.id}>{item.id} / {item.name}</option>)}</select></label> : <label className="field field--span-2">참고문서번호<input value={referenceId} onChange={(event) => setReferenceId(event.target.value)} placeholder="참고문서가 있으면 입력하세요" /></label>}
        </div></section>
        <section className="card request-items-section"><div className="section-header"><h2 className="card-title">{labels[activeTab]} 품목</h2><button className="action-link" type="button" onClick={addTransactionItem}>+ 행 추가</button></div><div className="table-scroll"><table className="data-table data-table--compact data-table--form table--fixed"><colgroup><col className="table-col--action" /><col className="table-col--value" /><col className="table-col--text" /><col className="table-col--value" /><col className="table-col--unit" /><col className="table-col--action" /></colgroup><thead><tr><th>번호</th><th>자재번호</th><th>자재명</th><th>수량</th><th>단위</th><th>삭제</th></tr></thead><tbody>{transactionItems.map((item, index) => <tr key={`transaction-item-${index}`}><td>{index + 1}</td><td><input value={item.materialId} onChange={(event) => updateTransactionItem(index, 'materialId', event.target.value)} placeholder="자재번호" aria-label={`${index + 1}번 자재번호`} /></td><td>{item.materialName || '-'}</td><td><input min="1" type="number" value={item.quantity} onChange={(event) => updateTransactionItem(index, 'quantity', event.target.value)} placeholder="수량" aria-label={`${index + 1}번 수량`} /></td><td>{item.unit || '-'}</td><td><button className="button button--danger" type="button" onClick={() => removeTransactionItem(index)} aria-label={`${index + 1}번 행 삭제`}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 7h14M10 11v6m4-6v6M9 7V4h6v3m-8 0 1 13h8l1-13" /></svg></button></td></tr>)}</tbody></table></div></section>
      </form>
    </main>
  )
}
