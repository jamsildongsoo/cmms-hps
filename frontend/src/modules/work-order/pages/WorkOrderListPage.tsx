import { useEffect, useState } from 'react'
import WorkOrderListPrintPage from './WorkOrderListPrintPage'
import type { PrintInfo } from '../../../shared/print/types'
import { getWorkOrders } from '../api/workOrderApi'

type WorkOrderListPageProps = {
  onCreate: () => void
  onPlanView: () => void
  onResultCreate: () => void
  onResultView: () => void
  printInfo: PrintInfo
}

export default function WorkOrderListPage({
  onCreate,
  onPlanView: _onPlanView,
  onResultCreate: _onResultCreate,
  onResultView: _onResultView,
  printInfo,
}: WorkOrderListPageProps) {
  const [pageSize, setPageSize] = useState('20')
  const [isPrinting, setIsPrinting] = useState(false)
  const [page, setPage] = useState(1)
  const [searchType, setSearchType] = useState<''|'id'|'name'>('')
  const [searchValue, setSearchValue] = useState('')
  const [orders, setOrders] = useState<Awaited<ReturnType<typeof getWorkOrders>>>({ items: [], page: 1, pageSize: 20, total: 0, totalPages: 0 })

  useEffect(() => {
    if (!isPrinting) return
    const finishPrint = () => setIsPrinting(false)
    window.addEventListener('afterprint', finishPrint)
    window.print()
    return () => window.removeEventListener('afterprint', finishPrint)
  }, [isPrinting])
  useEffect(() => { void getWorkOrders({ page, pageSize: Number(pageSize), ...(searchType ? { searchType } : {}), searchValue }).then(setOrders) }, [page, pageSize])

  return (
    <>
      {isPrinting && <WorkOrderListPrintPage {...printInfo} />}
      <main className="page page-screen">
      <header className="page-header">
        <div>
          <p className="eyebrow">Work Order</p>
          <h1>작업오더</h1>
        </div>
        <div className="page-actions">
          <button className="button button--neutral button--form-action" type="button" onClick={() => setIsPrinting(true)} aria-label="인쇄" title="인쇄">
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 9V4h12v5M6 18H4V10h16v8h-2M6 14h12v6H6v-6Z" /></svg>
            인쇄
          </button>
          <button className="button button--primary button--form-action" type="button" onClick={onCreate}>
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
            신규
          </button>
        </div>
      </header>

      <section className="card filter-card">
        <div className="form-grid form-grid--5">
          <label className="field">
            검색구분
            <select value={searchType} onChange={(event) => setSearchType(event.target.value as ''|'id'|'name')}><option value="">선택</option><option value="id">번호</option><option value="name">작업명</option></select>
          </label>
          <label className="field field--span-2">
            검색어
            <input value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="검색어를 입력하세요" />
          </label>
          <div className="filter-actions"><button className="button button--primary button--form-action" type="button" onClick={() => setPage(1)}>조회</button></div>
        </div>
      </section>

      <section className="card table-card">
        <div className="section-header"><h2 className="card-title">작업오더 목록</h2><span className="result-count">총 {orders.total}건</span></div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>설비코드</th>
                <th>설비명</th>
                <th>작업명</th>
                <th>작업유형</th>
                <th>계획일</th>
                <th>실적일</th>
                <th>작업자</th>
                <th>우선순위</th>
                <th>계획상태</th>
                <th>실적상태</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {orders.items.map((order) => <tr key={order.id}>
                <td><button className="action-link" type="button" onClick={_onPlanView}>{order.id}</button></td><td>{order.equipmentId}</td><td>{order.equipmentName}</td><td>{order.name}</td><td>{order.type}</td><td>{order.plan?.date ?? '-'}</td><td>{order.result?.date ?? '-'}</td><td>{order.plan?.workerId ?? '-'}</td><td>{order.priority}</td><td>{order.status}</td><td>{order.result ? '완료' : '미착수'}</td><td>
                  <div className="page-actions">
                    <button className="button button--neutral button--form-action" type="button" onClick={_onResultCreate}>
                      실적
                    </button>
                    <button className="button button--neutral button--form-action" type="button" onClick={_onResultView}>조회</button>
                  </div>
                </td>
              </tr>)}
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
                <option key={size}>{size}</option>
              ))}
            </select>
            건
          </label>
          <nav className="pagination" aria-label="작업오더 목록 페이지 이동">
            <button className="pagination-button" type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)} aria-label="이전 페이지">
              ‹
            </button>
            <button className="pagination-button active" type="button" aria-current="page">
              {page}
            </button>
            <button className="pagination-button" type="button" disabled={page >= orders.totalPages} onClick={() => setPage((value) => value + 1)} aria-label="다음 페이지">
              ›
            </button>
          </nav>
        </div>
      </section>
      </main>
    </>
  )
}
