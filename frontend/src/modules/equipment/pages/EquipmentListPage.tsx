import { useEffect, useState } from 'react'
import EquipmentFormPage from './EquipmentFormPage'
import EquipmentListPrintPage from './EquipmentListPrintPage'
import type { PrintInfo } from '../../../shared/print/types'
import { getEquipments } from '../api/equipmentApi'

type EquipmentListPageProps = {
  printInfo: PrintInfo
}

export default function EquipmentListPage({ printInfo }: EquipmentListPageProps) {
  const [pageSize, setPageSize] = useState('20')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchType, setSearchType] = useState<'' | 'id' | 'name'>('')
  const [searchValue, setSearchValue] = useState('')
  const [appliedSearch, setAppliedSearch] = useState({ searchType: '' as '' | 'id' | 'name', searchValue: '' })
  const [page, setPage] = useState<'list' | 'create' | 'view'>('list')
  const [isPrinting, setIsPrinting] = useState(false)
  const [equipments, setEquipments] = useState<Awaited<ReturnType<typeof getEquipments>>>({ items: [], page: 1, pageSize: 20, total: 0, totalPages: 0 })

  useEffect(() => {
    let active = true
    void getEquipments({ page: currentPage, pageSize: Number(pageSize), ...(appliedSearch.searchType ? { searchType: appliedSearch.searchType } : {}), searchValue: appliedSearch.searchValue }).then((data) => {
      if (active) setEquipments(data)
    })
    return () => {
      active = false
    }
  }, [currentPage, pageSize, appliedSearch])

  const search = () => { setCurrentPage(1); setAppliedSearch({ searchType, searchValue: searchValue.trim() }) }

  useEffect(() => {
    if (!isPrinting) return
    const finishPrint = () => setIsPrinting(false)
    window.addEventListener('afterprint', finishPrint)
    window.print()
    return () => window.removeEventListener('afterprint', finishPrint)
  }, [isPrinting])
  const download = () => {
    const csv = '\ufeff설비코드,설비명,설치위치,설비유형,설치일,허가,제조사,모델,설비상태\nEQ-1001,냉각수 펌프,생산동 1층,펌프,2026-09-01,N,ABC,CP-100,사용중\n'
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a'); link.href = url; link.download = '설비목록.csv'; link.click(); URL.revokeObjectURL(url)
  }
  if (page !== 'list') return <EquipmentFormPage mode={page} onBack={() => setPage('list')} />
  return (
    <>
      {isPrinting && <EquipmentListPrintPage {...printInfo} />}
      <main className="page page-screen">
        <header className="page-header">
          <div><p className="eyebrow">Equipment</p><h1>설비</h1></div>
          <div className="page-actions">
            <button className="button button--neutral button--form-action" type="button" onClick={() => setIsPrinting(true)} aria-label="인쇄" title="인쇄">
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 9V4h12v5M6 18H4V10h16v8h-2M6 14h12v6H6v-6Z" /></svg>
              인쇄
            </button>
            <button className="button button--neutral button--form-action" type="button" onClick={download}>다운로드</button>
            <button className="button button--primary button--form-action" type="button" onClick={() => setPage('create')}>
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
              신규
            </button>
          </div>
        </header>
        <section className="card filter-card"><div className="form-grid form-grid--5"><label className="field">검색구분<select value={searchType} onChange={(event) => setSearchType(event.target.value as '' | 'id' | 'name')}><option value="">선택</option><option value="id">번호</option><option value="name">설비명</option></select></label><label className="field field--span-2">검색어<input value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="검색어를 입력하세요" /></label><div className="filter-actions"><button className="button button--primary button--form-action" type="button" onClick={search}>조회</button></div></div></section>
        <section className="card table-card"><div className="section-header"><h2 className="card-title">설비 목록</h2><span className="result-count">총 {equipments.total}건</span></div><div className="table-scroll"><table className="data-table"><thead><tr><th>번호</th><th>설비명</th><th>설치위치</th><th>설비유형</th><th>설치일</th><th>허가</th><th>제조사</th><th>모델</th><th>설비상태</th></tr></thead><tbody>{equipments.items.map((equipment) => <tr key={equipment.id}><td><button className="action-link" type="button" onClick={() => setPage('view')}>{equipment.id}</button></td><td>{equipment.name}</td><td>{equipment.location}</td><td>{equipment.type}</td><td>{equipment.installedAt}</td><td>{equipment.permitRequired}</td><td>{equipment.maker}</td><td>{equipment.model}</td><td>{equipment.status}</td></tr>)}</tbody></table></div><div className="table-footer"><label className="page-size-label">페이지당<select className="page-size-select" value={pageSize} onChange={(event) => { setPageSize(event.target.value); setCurrentPage(1) }}><option>10</option><option>20</option><option>30</option><option>50</option><option>100</option></select>건</label><nav className="pagination" aria-label="설비 목록 페이지 이동"><button className="pagination-button" type="button" disabled={currentPage <= 1} onClick={() => setCurrentPage((page) => page - 1)}>‹</button><button className="pagination-button active" type="button" aria-current="page">{currentPage}</button><button className="pagination-button" type="button" disabled={currentPage >= equipments.totalPages} onClick={() => setCurrentPage((page) => page + 1)}>›</button></nav></div></section>
      </main>
    </>
  )
}
