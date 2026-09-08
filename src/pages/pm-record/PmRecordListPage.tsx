import { useState } from 'react'
import { useEffect } from 'react'
import PmRecordListPrintPage from './PmRecordListPrintPage'
import type { PrintInfo } from '../../shared/print/types'

type PmRecordListPageProps = {
  onCreate: () => void
  printInfo: PrintInfo
}

export default function PmRecordListPage({ onCreate, printInfo }: PmRecordListPageProps) {
  const [pageSize, setPageSize] = useState('20')
  const [isPrinting, setIsPrinting] = useState(false)

  useEffect(() => {
    if (!isPrinting) return
    const finishPrint = () => setIsPrinting(false)
    window.addEventListener('afterprint', finishPrint)
    window.print()
    return () => window.removeEventListener('afterprint', finishPrint)
  }, [isPrinting])

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
        <div className="form-grid form-grid--6">
          <label className="field">
            검색구분
            <select defaultValue="">
              <option value="">선택</option>
              <option>번호</option>
              <option>제목</option>
              <option>설비코드</option>
            </select>
          </label>
          <label className="field field--span-2">
            검색어
            <input placeholder="검색어를 입력하세요" />
          </label>
          <label className="field">
            작업일자 From
            <input type="date" aria-label="작업일자 시작일" />
          </label>
          <label className="field">
            작업일자 To
            <input type="date" aria-label="작업일자 종료일" />
          </label>
          <div className="filter-actions">
            <button className="button button--primary button--form-action" type="button">
              조회
            </button>
          </div>
        </div>
      </section>

      <section className="card table-card">
        <div className="section-header">
          <h2 className="card-title">예방점검 목록</h2>
          <span className="result-count">총 0건</span>
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
              <tr>
                <td colSpan={9} className="table-empty">등록된 예방점검 기록이 없습니다.</td>
              </tr>
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
            <button className="pagination-button" type="button" disabled aria-label="이전 페이지">
              ‹
            </button>
            <button className="pagination-button active" type="button" aria-current="page">
              1
            </button>
            <button className="pagination-button" type="button" disabled aria-label="다음 페이지">
              ›
            </button>
          </nav>
        </div>
      </section>
      </main>
    </>
  )
}
