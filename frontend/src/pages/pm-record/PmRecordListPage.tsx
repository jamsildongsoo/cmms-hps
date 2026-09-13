import { useState } from 'react'
import { useEffect } from 'react'
import PmRecordListPrintPage from './PmRecordListPrintPage'
import type { PrintInfo } from '../../shared/print/types'
import { getPmRecords } from '../../features/pm-record/api/pmRecordApi'

type PmRecordListPageProps = {
  onCreate: () => void
  printInfo: PrintInfo
}

export default function PmRecordListPage({ onCreate, printInfo }: PmRecordListPageProps) {
  const [pageSize, setPageSize] = useState('20')
  const [page, setPage] = useState(1)
  const [searchType, setSearchType] = useState<'' | 'id' | 'name'>('')
  const [searchValue, setSearchValue] = useState('')
  const [records, setRecords] = useState<Awaited<ReturnType<typeof getPmRecords>>>({ items: [], page: 1, pageSize: 20, total: 0, totalPages: 0 })
  const [isPrinting, setIsPrinting] = useState(false)

  useEffect(() => {
    if (!isPrinting) return
    const finishPrint = () => setIsPrinting(false)
    window.addEventListener('afterprint', finishPrint)
    window.print()
    return () => window.removeEventListener('afterprint', finishPrint)
  }, [isPrinting])
  useEffect(() => { void getPmRecords({ page, pageSize: Number(pageSize), ...(searchType ? { searchType } : {}), searchValue }).then(setRecords) }, [page, pageSize])

  return (
    <>
      {isPrinting && <PmRecordListPrintPage {...printInfo} />}
      <main className="page page-screen">
      <header className="page-header">
        <div>
          <p className="eyebrow">Preventive Maintenance</p>
          <h1>예방점검 기록</h1>
        </div>
        <div className="page-actions">
          <button className="button button--neutral button--form-action" type="button" onClick={() => setIsPrinting(true)} aria-label="인쇄" title="인쇄">
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M6 9V4h12v5M6 18H4V10h16v8h-2M6 14h12v6H6v-6Z" />
            </svg>
            인쇄
          </button>
          <button className="button button--primary button--form-action" type="button" onClick={onCreate}>
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" />
            </svg>
            신규
          </button>
        </div>
      </header>

      <section className="card filter-card">
        <div className="form-grid form-grid--5">
          <label className="field">
            검색구분
            <select value={searchType} onChange={(event) => setSearchType(event.target.value as '' | 'id' | 'name')}>
              <option value="">선택</option>
              <option value="id">번호</option>
              <option value="name">점검명</option>
            </select>
          </label>
          <label className="field field--span-2">
            검색어
            <input value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="검색어를 입력하세요" />
          </label>
          <div className="filter-actions">
            <button className="button button--primary button--form-action" type="button" onClick={() => setPage(1)}>
              조회
            </button>
          </div>
        </div>
      </section>

      <section className="card table-card">
        <div className="section-header">
          <h2 className="card-title">예방점검 목록</h2>
          <span className="result-count">총 {records.total}건</span>
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>설비코드</th>
                <th>설비명</th>
                <th>점검명</th>
                <th>점검유형</th>
                <th>점검일</th>
                <th>작업자</th>
                <th>결과(개요)</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {records.items.length === 0 ? <tr><td colSpan={9} className="table-empty">등록된 예방점검 기록이 없습니다.</td></tr> : records.items.map((record) => <tr key={record.id}><td>{record.id}</td><td>{record.equipmentId}</td><td>{record.equipmentName}</td><td>{record.name}</td><td>{record.type}</td><td>{record.date}</td><td>{record.workerName}</td><td>{record.summary}</td><td>{record.decision}</td></tr>)}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <label className="page-size-label">
            페이지당
            <select
              className="page-size-select"
              value={pageSize}
              onChange={(event) => setPageSize(event.target.value)}
              aria-label="페이지당 표시 행 수"
            >
              {['10', '20', '30', '50', '100'].map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            건
          </label>
          <nav className="pagination" aria-label="예방점검 목록 페이지 이동">
            <button className="pagination-button" type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)} aria-label="이전 페이지">
              ‹
            </button>
            <button className="pagination-button active" type="button" aria-current="page">
              {page}
            </button>
            <button className="pagination-button" type="button" disabled={page >= records.totalPages} onClick={() => setPage((value) => value + 1)} aria-label="다음 페이지">
              ›
            </button>
          </nav>
        </div>
      </section>
      </main>
    </>
  )
}
