import { useState } from 'react'
import WorkPermitFormPage from './WorkPermitFormPage'
import type { PrintInfo } from '../../shared/print/types'

type Props = { printInfo: PrintInfo }

export default function WorkPermitListPage({ printInfo }: Props) {
  const [page, setPage] = useState<'list' | 'create' | 'view'>('list')
  const [pageSize, setPageSize] = useState('20')
  const [searchType, setSearchType] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [appliedSearch, setAppliedSearch] = useState({ type: '', keyword: '' })

  const search = () => {
    setAppliedSearch({ type: searchType, keyword: searchKeyword.trim() })

    /* 백엔드 연계 시 검색조건을 쿼리로 전달합니다.
     * 특히 작업허가의 설비번호는 별도 설비 lookup으로 선택하지 않고
     * 사용자가 직접 입력한 값으로 검색하므로 LIKE 조건을 사용합니다.
     * 예시: GET /api/work-permits?equipmentIdLike=${encodeURIComponent(searchKeyword)}
     * SQL 예시: WHERE equipment_id LIKE CONCAT('%', :equipmentId, '%')
     */
  }

  const permitMatches = (type: string, keyword: string) => {
    if (!keyword) return true
    const value = type === '허가번호' ? 'PTW-2026-0001' : type === '허가명' ? '펌프 정비 작업' : 'EQ-1001'
    return value.toLowerCase().includes(keyword.toLowerCase())
  }
  if (page !== 'list') return <WorkPermitFormPage mode={page} onBack={() => setPage('list')} printInfo={printInfo} />

  return (
    <main className="page page-screen">
      <header className="page-header">
        <div><p className="eyebrow">Work Permit</p><h1>작업허가</h1></div>
        <div className="page-actions">
          <button className="button button--neutral button--form-action" type="button" onClick={() => window.print()}>
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 9V4h12v5M6 18H4V10h16v8h-2M6 14h12v6H6v-6Z" /></svg>인쇄
          </button>
          <button className="button button--primary button--form-action" type="button" onClick={() => setPage('create')}>
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>신규
          </button>
        </div>
      </header>
      <section className="card filter-card">
        <div className="form-grid form-grid--6">
          <label className="field">검색구분<select value={searchType} onChange={(event) => setSearchType(event.target.value)}><option value="">선택</option><option>허가번호</option><option>허가명</option><option>설비번호</option></select></label>
          <label className="field field--span-2">검색어<input value={searchKeyword} onChange={(event) => setSearchKeyword(event.target.value)} placeholder="번호 또는 명칭을 입력하세요" /></label>
          <label className="field">허가 From<input type="date" /></label>
          <label className="field">허가 To<input type="date" /></label>
          <div className="filter-actions"><button className="button button--primary button--form-action" type="button" onClick={search}>조회</button></div>
        </div>
      </section>
      <section className="card table-card">
        <div className="section-header"><h2 className="card-title">작업허가 목록</h2></div>
        <div className="table-scroll">
          <table className="data-table">
            <thead><tr><th>번호</th><th>설비번호</th><th>설비명</th><th>허가명</th><th>허가유형</th><th>허가날짜</th><th>감독자</th><th>보충허가</th><th>상태</th></tr></thead>
            <tbody>{permitMatches(appliedSearch.type, appliedSearch.keyword) && <tr><td><button className="action-link" type="button" onClick={() => setPage('view')}>PTW-2026-0001</button></td><td>EQ-1001</td><td>냉각수 펌프</td><td>펌프 정비 작업</td><td>정비작업</td><td>2026-09-05 ~ 2026-09-05</td><td>홍길동</td><td>화기작업</td><td>작성중</td></tr>}</tbody>
          </table>
        </div>
        <div className="table-footer">
          <label className="page-size-label">페이지당<select className="page-size-select" value={pageSize} onChange={(event) => setPageSize(event.target.value)}><option>10</option><option>20</option><option>30</option><option>50</option><option>100</option></select>건</label>
          <nav className="pagination" aria-label="작업허가 목록 페이지 이동"><button className="pagination-button" type="button" disabled>‹</button><button className="pagination-button active" type="button">1</button><button className="pagination-button" type="button" disabled>›</button></nav>
        </div>
      </section>
    </main>
  )
}
