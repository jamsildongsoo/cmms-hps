import { useEffect, useState } from 'react'
import type { MaterialResponse } from '../types/types'
import { getMaterials } from '../api/materialApi'
import MaterialFormPage from './MaterialFormPage'

export default function MaterialListPage() {
  const [materials, setMaterials] = useState<{ items: MaterialResponse[]; page: number; pageSize: number; total: number; totalPages: number }>({ items: [], page: 1, pageSize: 20, total: 0, totalPages: 0 })
  const [page, setPage] = useState<'list' | 'create' | 'view'>('list')
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialResponse>()
  const [pageSize, setPageSize] = useState('20')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchType, setSearchType] = useState<'' | 'id' | 'name'>('')
  const [searchValue, setSearchValue] = useState('')
  const [appliedSearch, setAppliedSearch] = useState({ searchType: '' as '' | 'id' | 'name', searchValue: '' })
  const download = () => {
    const csv = `\ufeff자재번호,자재명,규격,단위\n${materials.items.map((item) => `${item.id},${item.name},${item.specification},${item.unit}`).join('\n')}\n`
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a'); link.href = url; link.download = '자재목록.csv'; link.click(); URL.revokeObjectURL(url)
  }

  useEffect(() => { void getMaterials({ page: currentPage, pageSize: Number(pageSize), ...(appliedSearch.searchType ? { searchType: appliedSearch.searchType } : {}), searchValue: appliedSearch.searchValue }).then(setMaterials) }, [currentPage, pageSize, appliedSearch])
  const search = () => { setCurrentPage(1); setAppliedSearch({ searchType, searchValue: searchValue.trim() }) }

  if (page !== 'list') return <MaterialFormPage mode={page} onBack={() => setPage('list')} material={selectedMaterial} />

  return (
    <main className="page page-screen">
      <header className="page-header"><div><p className="eyebrow">Material</p><h1>자재</h1></div><div className="page-actions"><button className="button button--neutral button--form-action" type="button" onClick={() => window.print()} aria-label="인쇄" title="인쇄"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 9V4h12v5M6 18H4V10h16v8h-2M6 14h12v6H6v-6Z" /></svg>인쇄</button><button className="button button--neutral button--form-action" type="button" onClick={download}>다운로드</button><button className="button button--primary button--form-action" type="button" onClick={() => { setSelectedMaterial(undefined); setPage('create') }}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>신규</button></div></header>
      <section className="card filter-card"><div className="form-grid form-grid--5"><label className="field">검색구분<select value={searchType} onChange={(event) => setSearchType(event.target.value as '' | 'id' | 'name')}><option value="">선택</option><option value="id">번호</option><option value="name">자재명</option></select></label><label className="field field--span-2">검색어<input value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="검색어를 입력하세요" /></label></div></section>
      <section className="card filter-card"><div className="form-grid form-grid--5"><label className="field">검색구분<select value={searchType} onChange={(event) => setSearchType(event.target.value as '' | 'id' | 'name')}><option value="">선택</option><option value="id">번호</option><option value="name">자재명</option></select></label><label className="field field--span-2">검색어<input value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="검색어를 입력하세요" /></label><div className="filter-actions"><button className="button button--primary button--form-action" type="button" onClick={search}>조회</button></div></div></section>
      <section className="card table-card"><div className="section-header"><h2 className="card-title">자재 목록</h2><span className="result-count">총 {materials.total}건</span></div><div className="table-scroll"><table className="data-table"><thead><tr><th>자재번호</th><th>자재명</th><th>규격</th><th>단위</th><th>자재유형</th><th>사용</th></tr></thead><tbody>{materials.items.map((item) => <tr key={item.id}><td><button className="action-link" type="button" onClick={() => { setSelectedMaterial(item); setPage('view') }}>{item.id}</button></td><td>{item.name}</td><td>{item.specification}</td><td>{item.unit}</td><td>{item.type}</td><td>{item.status === '사용중' ? '사용' : '미사용'}</td></tr>)}</tbody></table></div><div className="table-footer"><label className="page-size-label">페이지당<select className="page-size-select" value={pageSize} onChange={(event) => { setPageSize(event.target.value); setCurrentPage(1) }}><option>10</option><option>20</option><option>30</option><option>50</option><option>100</option></select>건</label><nav className="pagination"><button className="pagination-button" type="button" disabled={currentPage <= 1} onClick={() => setCurrentPage((value) => value - 1)}>‹</button><button className="pagination-button active" type="button">{currentPage}</button><button className="pagination-button" type="button" disabled={currentPage >= materials.totalPages} onClick={() => setCurrentPage((value) => value + 1)}>›</button></nav></div></section>
    </main>
  )
}
