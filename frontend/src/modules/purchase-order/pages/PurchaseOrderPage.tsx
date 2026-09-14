import { PURCHASE_ORDER_SOURCE_LABELS as sourceLabels } from '../../../../../shared/domain-codes'
import { useEffect, useState } from 'react'
import type { LoginInfo } from '../../auth/types/types'
import type { PurchaseOrderResponse, PurchaseOrderSource } from '../types/types'
import type { PurchaseRequestResponse } from '../../purchase-request/types/types'
import { createPurchaseOrder, getPurchaseOrders, getPurchaseRequests } from '../api/purchaseApi'
import type { MaterialResponse } from '../../material/types/types'
import { getMaterials } from '../../material/api/materialApi'

type Props = { session: LoginInfo }

type OrderItemForm = { materialId: string; materialName: string; quantity: string; unit: string }
const createOrderItems = (): OrderItemForm[] => [{ materialId: 'MAT-1001', materialName: '', quantity: '1', unit: 'EA' }]

export default function PurchaseOrderPage({ session }: Props) {
  const [orders, setOrders] = useState<PurchaseOrderResponse[]>([])
  const [requests, setRequests] = useState<PurchaseRequestResponse[]>([])
  const [materials, setMaterials] = useState<MaterialResponse[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [source, setSource] = useState<PurchaseOrderSource>('purchase-request')
  const [requestId, setRequestId] = useState('')
  const [warehouseId, setWarehouseId] = useState('WH-01')
  const [orderItems, setOrderItems] = useState<OrderItemForm[]>(createOrderItems)
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('')
  const [searchType, setSearchType] = useState<'' | 'id' | 'name'>('')
  const [searchKeyword, setSearchKeyword] = useState('')

  useEffect(() => { void Promise.all([getPurchaseOrders(), getPurchaseRequests(), getMaterials()]).then(([orderData, requestData, materialData]) => { setOrders(orderData); setRequests(requestData); setMaterials(materialData.items) }) }, [])

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const request = requests.find((item) => item.id === requestId)
    const items = orderItems.filter((item) => item.materialId && item.quantity).map((item) => ({ materialId: item.materialId, quantity: Number(item.quantity), unit: item.unit, unitPrice: 0, expectedDeliveryDate }))
    if (!items.length) return
    const created = await createPurchaseOrder({
      companyId: session.companyId, siteId: request?.siteId ?? session.siteId, deptId: request?.deptId ?? session.deptId, warehouseId, purchaserId: session.userId,
      source, ...(source === 'purchase-request' && requestId ? { purchaseRequestId: requestId } : {}), vendorId: 'VENDOR-001', orderDate: new Date().toISOString().slice(0, 10), expectedDeliveryDate,
      name: request?.name ?? '재고기반 자재 발주', remarks: '', items,
    })
    setOrders((current) => [...current, created]); setIsAdding(false); resetForm()
  }

  const resetForm = () => { setSource('purchase-request'); setRequestId(''); setWarehouseId('WH-01'); setOrderItems(createOrderItems()); setExpectedDeliveryDate('') }
  const updateOrderItem = (index: number, field: keyof OrderItemForm, value: string) => setOrderItems((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item))
  const selectMaterial = (index: number, materialId: string) => { const selected = materials.find((item) => item.id === materialId); setOrderItems((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, materialId, materialName: selected?.name ?? '', unit: selected?.unit ?? item.unit } : item)) }
  const addOrderItem = () => setOrderItems((current) => [...current, { materialId: '', materialName: '', quantity: '', unit: 'EA' }])
  const removeOrderItem = (index: number) => setOrderItems((current) => current.length === 1 ? current : current.filter((_, itemIndex) => itemIndex !== index))
  const filteredOrders = orders.filter((item) => (!searchKeyword || !searchType || (searchType === 'id' ? item.id : item.name).includes(searchKeyword)))

  return (
    <main className="page page-screen">
      <header className="page-header"><div><p className="eyebrow">Purchase Order</p><h1>구매오더</h1></div><div className="page-actions">{isAdding ? <><button className="button button--neutral button--form-action" type="button" onClick={() => setIsAdding(false)}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>목록</button><button className="button button--neutral button--form-action" type="button" onClick={resetForm}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.34-5.66M4 4v5h5" /></svg>초기화</button><button className="button button--neutral button--form-action" type="button" onClick={() => window.print()}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 9V4h12v5M6 18H4V10h16v8h-2M6 14h12v6H6v-6Z" /></svg>인쇄</button><button className="button button--neutral button--form-action" type="submit" form="purchase-order-form"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 4h12l2 2v14H5V4Zm3 0v6h6V4M8 16h8" /></svg>저장</button><button className="button button--primary button--form-action" type="button" onClick={() => alert('결재 상신 API 연계 예정입니다. (파일럿)')}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6" /></svg>결재</button></> : <><button className="button button--neutral button--form-action" type="button" onClick={() => window.print()} aria-label="인쇄" title="인쇄"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 9V4h12v5M6 18H4V10h16v8h-2M6 14h12v6H6v-6Z" /></svg>인쇄</button><button className="button button--primary button--form-action" type="button" onClick={() => setIsAdding(true)}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>신규</button></>}</div></header>
      {isAdding && <form id="purchase-order-form" className="card filter-card" onSubmit={submit}><h2 className="card-title">구매오더 입력</h2><div className="form-grid form-grid--4">
        <label className="field">발주구분<select value={source} onChange={(event) => setSource(event.target.value as PurchaseOrderSource)}><option value="purchase-request">구매요청 전환</option><option value="inventory">재고기반 발주</option></select></label>
        <label className="field">구매요청<select disabled={source === 'inventory'} value={requestId} onChange={(event) => setRequestId(event.target.value)}><option value="">선택</option>{requests.filter((item) => !item.purchaseOrderId).map((item) => <option key={item.id} value={item.id}>{item.id} / {item.name}</option>)}</select></label>
        <label className="field">입고창고<select value={warehouseId} onChange={(event) => setWarehouseId(event.target.value)}><option value="WH-HQ">본사 창고</option><option value="WH-01">1번 창고</option></select></label>
        <label className="field">배송예정일<input required type="date" value={expectedDeliveryDate} onChange={(event) => setExpectedDeliveryDate(event.target.value)} /></label>
        <div className="field field--span-4"><div className="section-header"><h2 className="card-title">발주 품목</h2><button className="action-link" type="button" onClick={addOrderItem}>+ 행 추가</button></div><div className="table-scroll"><table className="data-table data-table--compact data-table--form table--fixed"><colgroup><col className="table-col--action" /><col className="table-col--value" /><col className="table-col--text" /><col className="table-col--value" /><col className="table-col--unit" /><col className="table-col--action" /></colgroup><thead><tr><th>번호</th><th>자재번호</th><th>자재명</th><th>발주수량</th><th>단위</th><th>삭제</th></tr></thead><tbody>{orderItems.map((item, index) => <tr key={`order-item-${index}`}><td>{index + 1}</td><td><input value={item.materialId} onChange={(event) => selectMaterial(index, event.target.value)} placeholder="자재번호" aria-label={`${index + 1}번 자재번호`} /></td><td>{item.materialName || '-'}</td><td><input min="1" type="number" value={item.quantity} onChange={(event) => updateOrderItem(index, 'quantity', event.target.value)} placeholder="수량" aria-label={`${index + 1}번 발주수량`} /></td><td>{item.unit || '-'}</td><td><button className="button button--danger" type="button" onClick={() => removeOrderItem(index)} aria-label={`${index + 1}번 행 삭제`}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 7h14M10 11v6m4-6v6M9 7V4h6v3m-8 0 1 13h8l1-13" /></svg></button></td></tr>)}</tbody></table></div></div>
      </div></form>}
      {!isAdding && <><section className="card filter-card"><div className="form-grid form-grid--5"><label className="field">검색구분<select value={searchType} onChange={(event) => setSearchType(event.target.value as '' | 'id' | 'name')}><option value="">선택</option><option value="id">번호</option><option value="name">오더명</option></select></label><label className="field field--span-2">검색어<input value={searchKeyword} onChange={(event) => setSearchKeyword(event.target.value)} placeholder="검색어를 입력하세요" /></label><div className="filter-actions"><button className="button button--primary button--form-action" type="button">조회</button></div></div></section><section className="card table-card"><div className="section-header"><h2 className="card-title">구매오더 목록</h2></div><div className="table-scroll"><table className="data-table"><thead><tr><th>오더번호</th><th>발주구분</th><th>구매요청</th><th>오더명</th><th>입고창고</th><th>구매담당자</th><th>배송예정일</th><th>상태</th></tr></thead><tbody>{filteredOrders.map((item) => <tr key={item.id}><td>{item.id}</td><td>{sourceLabels[item.source]}</td><td>{item.purchaseRequestId ?? '-'}</td><td>{item.name}</td><td>{item.warehouseName}</td><td>{item.purchaserName}</td><td>{item.expectedDeliveryDate}</td><td>{item.status}</td></tr>)}</tbody></table></div></section></>}
    </main>
  )
}
