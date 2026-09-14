import { useEffect, useState } from 'react'
import type { WorkOrder, WorkOrderResponse } from '../types/types'
import WorkOrderPrintPage from './WorkOrderPrintPage'
import type { PrintInfo } from '../../../shared/print/types'
import { updateWorkOrder } from '../api/workOrderApi'

type WorkOrderResultFormPageProps = {
  onBack: () => void
  mode?: 'create' | 'edit' | 'view'
  printInfo: PrintInfo
}

const emptyWorkOrder = {
  id: '',
  name: '',
  equipmentId: '',
  type: '',
  priority: '',
  permitRequired: false,
  plan: { phase: 'plan', date: '', workerId: '', manHours: '', manHoursUnit: '', cost: '', summary: '' },
  status: '',
  items: [{ id: '', name: '', method: '', result: '' }],
} as WorkOrder

type WorkerLookupResponse = { workerName: string }

export default function WorkOrderResultFormPage({ onBack, mode = 'create', printInfo }: WorkOrderResultFormPageProps) {
  const isView = mode === 'view'
  const [isPrinting, setIsPrinting] = useState(false)
  useEffect(() => {
    if (!isPrinting) return
    const finishPrint = () => setIsPrinting(false)
    window.addEventListener('afterprint', finishPrint)
    window.print()
    return () => window.removeEventListener('afterprint', finishPrint)
  }, [isPrinting])
  const [order, setOrder] = useState<WorkOrderResponse>({
    ...emptyWorkOrder,
    equipmentName: '',
  })
  const [message, setMessage] = useState('')

  const emptyResult = { phase: 'result' as const, date: '', workerId: '', manHours: '', manHoursUnit: '', cost: '', summary: '' }
  const updateResult = (field: keyof typeof emptyResult, value: string) => setOrder((current) => ({ ...current, result: { ...(current.result ?? emptyResult), [field]: value } }))

  const updateItemResult = (index: number, value: string) => {
    setOrder((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) => itemIndex === index ? { ...item, result: value } : item),
    }))
  }

  const reset = () => {
    setOrder({ ...emptyWorkOrder, equipmentName: '' })
    setMessage('')
  }

  const lookupWorker = async () => {
    if (!order.result?.workerId.trim()) return
    const response = await fetch(`/api/workers/${encodeURIComponent(order.result.workerId)}`)
    if (!response.ok) {
      setOrder((current) => ({ ...current, result: { ...(current.result ?? emptyResult), workerName: '' } }))
      setMessage('작업자를 찾을 수 없습니다.')
      return
    }
    const data = (await response.json()) as WorkerLookupResponse
    setOrder((current) => ({ ...current, result: { ...(current.result ?? emptyResult), workerName: data.workerName } }))
    setMessage('')
  }

  const save = async () => { if (!order.id) { setMessage('작업오더를 먼저 선택해 주세요.'); return }; await updateWorkOrder(order.id, { result: order.result }); setMessage('작업실적이 저장되었습니다.') }
  const requestApproval = () => setMessage('작업실적이 결재 상신되었습니다. (파일럿)')

  return (
    <>
      {isPrinting && <WorkOrderPrintPage order={order} {...printInfo} />}
      <main className="page page-screen">
      <header className="page-header">
        <div>
          <p className="eyebrow">Work Order Result</p>
          <h1>{isView ? '작업오더 실적조회' : '작업오더 실적등록'}</h1>
        </div>
        <div className="page-actions">
          <button className="button button--neutral button--form-action" type="button" onClick={onBack}>
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            목록
          </button>
          {!isView && <button className="button button--neutral button--form-action" type="button" onClick={reset}>
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.34-5.66M4 4v5h5" /></svg>
            초기화
          </button>}
          <button className="button button--neutral button--form-action" type="button" onClick={() => setIsPrinting(true)}>
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 9V4h12v5M6 18H4V10h16v8h-2M6 14h12v6H6v-6Z" /></svg>
            인쇄
          </button>
          {!isView && <button className="button button--neutral button--form-action" type="button" onClick={save}>
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 4h11l3 3v13H5V4Zm3 0v5h7V4M8 20v-7h8v7" /></svg>
            저장
          </button>}
          {!isView && <button className="button button--primary button--form-action" type="button" onClick={requestApproval}>
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6" /></svg>
            결재
          </button>}
        </div>
      </header>

      {message && <div className="notice">{message}</div>}

      <div className="card-grid card-grid--2">
        <section className="card">
          <h2 className="card-title">설비정보</h2>
          <div className="form-grid form-grid--2">
            <label className="field">
              설비코드
              <div className="input-group">
                <input value={order.equipmentId} placeholder="설비코드 조회 결과" readOnly />
              </div>
            </label>
            <label className="field">
              설비명
              <input value={order.equipmentName} readOnly placeholder="설비 조회 결과" />
            </label>
          </div>
          <div className="history-section">
            <h3 className="section-title">최근작업내역(3건)</h3>
            <div className="table-scroll">
              <table className="data-table data-table--compact">
                <thead>
                  <tr><th>작업오더번호</th><th>작업일</th><th>결과</th></tr>
                </thead>
                <tbody>
                  <tr><td colSpan={3} className="table-empty">최근 작업 내역이 없습니다.</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="card">
          <h2 className="card-title">기본정보</h2>
          <label className="field">
            제목
            <input value={order.name} readOnly placeholder="작업오더 조회 결과" />
          </label>
          <label className="field field--spaced">
            개요
            <textarea value={order.plan.summary} placeholder="계획 개요 조회 결과" disabled rows={4} />
          </label>
          <label className="field field--spaced">
            작업오더번호
            <input value={order.id || '작업오더 조회 결과'} readOnly />
          </label>
        </section>
      </div>

      <section className="card">
        <h2 className="card-title">작업계획정보</h2>
        <div className="form-grid form-grid--5">
          <label className="field">작업일<input type="date" value={order.plan.date} readOnly /></label>
          <label className="field">총 M/H<div className="input-group"><input value={order.plan.manHours} readOnly /><select value={order.plan.manHoursUnit} disabled aria-label="계획 M/H 단위"><option value="">단위</option><option>시간</option><option>일</option><option>주</option><option>월</option></select></div></label>
          <label className="field">비용<input value={order.plan.cost} readOnly /></label>
          <label className="field">작업자 사번<input value={order.plan.workerId} readOnly /></label>
          <label className="field">작업자명<input value={order.plan.workerName ?? ''} readOnly /></label>
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">작업실적정보</h2>
        <div className="form-grid form-grid--5">
          <label className="field">작업일<input type="date" value={order.result?.date ?? ''} onChange={(event) => updateResult('date', event.target.value)} readOnly={isView} /></label>
          <label className="field">작업자 사번<div className="input-group"><input value={order.result?.workerId ?? ''} onChange={(event) => updateResult('workerId', event.target.value)} readOnly={isView} /><button type="button" className="button button--neutral" hidden={isView} onClick={() => void lookupWorker()} aria-label="작업자 조회" title="작업자 조회"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg></button></div></label>
          <label className="field">작업자명<input value={order.result?.workerName ?? ''} readOnly placeholder="작업자 조회 결과" /></label>
          <label className="field">총 M/H<div className="input-group"><input value={order.result?.manHours ?? ''} onChange={(event) => updateResult('manHours', event.target.value)} placeholder="실적 M/H 입력" readOnly={isView} /><select value={order.result?.manHoursUnit ?? ''} onChange={(event) => updateResult('manHoursUnit', event.target.value)} disabled={isView} aria-label="실적 M/H 단위"><option value="">단위</option><option>시간</option><option>일</option><option>주</option><option>월</option></select></div></label>
          <label className="field">비용<input value={order.result?.cost ?? ''} onChange={(event) => updateResult('cost', event.target.value)} placeholder="실적 비용 입력" readOnly={isView} /></label>
        </div>
        <label className="field field--spaced">
          실적요약
          <textarea value={order.result?.summary ?? ''} onChange={(event) => updateResult('summary', event.target.value)} placeholder="작업 결과와 조치내용을 입력하세요" rows={4} readOnly={isView} />
        </label>
      </section>

      <section className="card table-card">
        <h2 className="card-title">작업항목 실적</h2>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr><th>작업명</th><th>작업방법</th><th>결과</th></tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={item.id || index}>
                  <td>{item.name}</td>
                  <td>{item.method}</td>
                  <td><input value={item.result} onChange={(event) => updateItemResult(index, event.target.value)} placeholder="실적입력" readOnly={isView} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      </main>
    </>
  )
}
