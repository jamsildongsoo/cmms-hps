import { useEffect, useState } from 'react'
import type { InventoryLedgerEntry } from '../../entities/inventory/types'
import { getInventoryLedger } from '../../features/inventory/api/inventoryApi'

export default function InventoryLedgerPage() {
  const [ledger, setLedger] = useState<InventoryLedgerEntry[]>([])
  const [keyword, setKeyword] = useState('')

  useEffect(() => { void getInventoryLedger().then(setLedger) }, [])

  const filteredLedger = ledger.filter((item) => !keyword || item.materialId.includes(keyword) || item.warehouseId.includes(keyword) || item.referenceId.includes(keyword))

  return (
    <main className="page page-screen">
      <header className="page-header"><div><p className="eyebrow">Inventory Ledger</p><h1>재고원장</h1></div></header>
      <section className="card filter-card"><div className="form-grid form-grid--4"><label className="field">조회 시작일<input type="date" /></label><label className="field">조회 종료일<input type="date" /></label><label className="field field--span-2">검색어<input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="자재번호·창고번호·연계번호" /></label></div></section>
      <section className="card table-card"><div className="section-header"><h2 className="card-title">재고 거래 이력</h2></div><div className="table-scroll"><table className="data-table"><thead><tr><th>처리일</th><th>구분</th><th>창고</th><th>자재</th><th>수량</th><th>금액</th><th>연계번호</th><th>처리자</th></tr></thead><tbody>{filteredLedger.map((item) => <tr key={item.id}><td>{item.occurredAt}</td><td>{item.transactionType === 'receipt' ? '입고' : item.transactionType === 'issue' ? '출고' : item.transactionType}</td><td>{item.warehouseId}</td><td>{item.materialId}</td><td>{item.quantity}</td><td>{item.amount.toLocaleString()}</td><td>{item.referenceId}</td><td>{item.createdBy}</td></tr>)}</tbody></table></div></section>
    </main>
  )
}
