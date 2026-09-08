import { useEffect, useState } from 'react'
import type { LoginInfo } from '../../entities/auth/types'
import type { PurchaseRequestResponse } from '../../entities/purchase-request/types'
import { createPurchaseRequest, getPurchaseRequests } from '../../features/purchase/api/purchaseApi'
import type { MaterialResponse } from '../../entities/material/types'
import { getMaterials } from '../../features/material/api/materialApi'

type Props = { session: LoginInfo }

const statusLabels: Record<PurchaseRequestResponse['status'], string> = {
  draft: '임시저장', requested: '요청', approved: '승인', rejected: '반려', partiallyOrdered: '부분발주', ordered: '발주', partiallyDelivered: '부분배송', delivered: '배송완료', cancelled: '취소',
}

type RequestItemForm = { materialId: string; materialName: string; quantity: string; unit: string }
const createRequestItems = (): RequestItemForm[] => [{ materialId: '', materialName: '', quantity: '', unit: '' }]

export default function PurchaseRequestPage({ session }: Props) {
  const [requests, setRequests] = useState<PurchaseRequestResponse[]>([])
  const [materials, setMaterials] = useState<MaterialResponse[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [name, setName] = useState('')
  const [requiredDate, setRequiredDate] = useState('')
  const [remarks, setRemarks] = useState('')
  const [requestItems, setRequestItems] = useState<RequestItemForm[]>(createRequestItems)
  const [searchType, setSearchType] = useState<'' | 'number' | 'title' | 'department'>('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  useEffect(() => { void Promise.all([getPurchaseRequests(), getMaterials()]).then(([requestData, materialData]) => { setRequests(requestData); setMaterials(materialData) }) }, [])

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const items = requestItems.filter((item) => item.materialId && item.quantity).map((item) => ({ materialId: item.materialId, quantity: Number(item.quantity), unit: item.unit, requiredDate, purpose: name }))
    if (!items.length) return
    const created = await createPurchaseRequest({
      companyId: session.companyId, siteId: session.siteId, departmentId: session.deptId, requesterId: session.userId,
      name, requestDate: new Date().toISOString().slice(0, 10), requiredDate, deliveryConfirmed: false, purpose: name, remarks,
      items,
    })
    setRequests((current) => [...current, created]); setIsAdding(false); resetForm()
  }

  const resetForm = () => { setName(''); setRequiredDate(''); setRemarks(''); setRequestItems(createRequestItems()) }
  const updateRequestItem = (index: number, field: keyof RequestItemForm, value: string) => setRequestItems((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item))
  const selectMaterial = (index: number, materialId: string) => { const selected = materials.find((item) => item.id === materialId); setRequestItems((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, materialId, materialName: selected?.name ?? '', unit: selected?.unit ?? '' } : item)) }
  const addRequestItem = () => setRequestItems((current) => [...current, { materialId: '', quantity: '', unit: 'EA' }])
  const removeRequestItem = (index: number) => setRequestItems((current) => current.filter((_, itemIndex) => itemIndex !== index))
  const filteredRequests = requests.filter((item) => (!searchKeyword || !searchType || (searchType === 'number' ? item.id : searchType === 'title' ? item.name : item.departmentName).includes(searchKeyword)) && (!fromDate || item.requestDate >= fromDate) && (!toDate || item.requestDate <= toDate))

  return (
    <main className="page page-screen">
      <header className="page-header"><div><p className="eyebrow">Purchase Request</p><h1>구매요청</h1></div><div className="page-actions">{isAdding ? <><button className="button button--neutral button--form-action" type="button" onClick={() => setIsAdding(false)}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>목록</button><button className="button button--neutral button--form-action" type="button" onClick={resetForm}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.34-5.66M4 4v5h5" /></svg>초기화</button><button className="button button--neutral button--form-action" type="button" onClick={() => window.print()}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 9V4h12v5M6 18H4V10h16v8h-2M6 14h12v6H6v-6Z" /></svg>인쇄</button><button className="button button--neutral button--form-action" type="submit" form="purchase-request-form"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 4h12l2 2v14H5V4Zm3 0v6h6V4M8 16h8" /></svg>저장</button><button className="button button--primary button--form-action" type="button" onClick={() => alert('결재 상신 API 연계 예정입니다. (파일럿)')}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6" /></svg>결재</button></> : <><button className="button button--neutral button--form-action" type="button" onClick={() => window.print()} aria-label="인쇄" title="인쇄"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 9V4h12v5M6 18H4V10h16v8h-2M6 14h12v6H6v-6Z" /></svg>인쇄</button><button className="button button--primary button--form-action" type="button" onClick={() => setIsAdding(true)}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>신규</button></>}</div></header>
      {isAdding && <form id="purchase-request-form" className="card filter-card" onSubmit={submit}><h2 className="card-title">구매요청 헤더정보</h2><div className="form-grid form-grid--4"><label className="field field--span-2">요청명<input required value={name} onChange={(event) => setName(event.target.value)} placeholder="구매요청 제목을 입력하세요" /></label><label className="field">필요일<input required type="date" value={requiredDate} onChange={(event) => setRequiredDate(event.target.value)} /></label><label className="field field--span-4">적요<textarea value={remarks} onChange={(event) => setRemarks(event.target.value)} /></label></div><section className="history-section request-items-section"><div className="section-header"><h2 className="card-title">요청 품목</h2><button className="action-link" type="button" onClick={addRequestItem}>+ 행 추가</button></div><div className="table-scroll"><table className="data-table data-table--compact data-table--form table--fixed"><colgroup><col className="table-col--action" /><col className="table-col--value" /><col className="table-col--text" /><col className="table-col--value" /><col className="table-col--unit" /><col className="table-col--action" /></colgroup><thead><tr><th>번호</th><th>자재번호</th><th>자재명</th><th>요청수량</th><th>단위</th><th>삭제</th></tr></thead><tbody>{requestItems.map((item, index) => <tr key={`request-item-${index}`}><td>{index + 1}</td><td><input value={item.materialId} onChange={(event) => selectMaterial(index, event.target.value)} placeholder="자재번호" aria-label={`${index + 1}번 자재번호`} /></td><td>{item.materialName || '-'}</td><td><input min="1" type="number" value={item.quantity} onChange={(event) => updateRequestItem(index, 'quantity', event.target.value)} placeholder="수량" aria-label={`${index + 1}번 요청수량`} /></td><td>{item.unit || '-'}</td><td><button className="button button--danger" type="button" onClick={() => removeRequestItem(index)} aria-label={`${index + 1}번 행 삭제`}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 7h14M10 11v6m4-6v6M9 7V4h6v3m-8 0 1 13h8l1-13" /></svg></button></td></tr>)}</tbody></table></div></section></form>}
      {!isAdding && <><section className="card filter-card"><div className="form-grid form-grid--6"><label className="field">검색구분<select value={searchType} onChange={(event) => setSearchType(event.target.value as '' | 'number' | 'title' | 'department')}><option value="">선택</option><option value="number">번호</option><option value="title">제목</option><option value="department">부서명</option></select></label><label className="field field--span-2">검색어<input value={searchKeyword} onChange={(event) => setSearchKeyword(event.target.value)} placeholder="검색어를 입력하세요" /></label><label className="field">요청일 From<input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} /></label><label className="field">요청일 To<input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} /></label><div className="filter-actions"><button className="button button--primary button--form-action" type="button">조회</button></div></div></section><section className="card table-card"><div className="section-header"><h2 className="card-title">구매요청 목록</h2></div><div className="table-scroll"><table className="data-table"><thead><tr><th>요청번호</th><th>요청명</th><th>요청부서</th><th>요청자</th><th>요청일</th><th>배송예정일</th><th>배송확인</th><th>상태</th></tr></thead><tbody>{filteredRequests.map((item) => <tr key={item.id}><td>{item.id}</td><td>{item.name}</td><td>{item.departmentName}</td><td>{item.requesterName}</td><td>{item.requestDate}</td><td>{item.expectedDeliveryDate ?? '-'}</td><td>{item.deliveryConfirmed ? '확인' : '미확인'}</td><td>{statusLabels[item.status]}</td></tr>)}</tbody></table></div></section></>}
    </main>
  )
}
