import { useEffect, useState } from 'react'
import type { WorkOrder, WorkOrderItem, WorkOrderPhase, WorkOrderResponse } from '../../entities/work-order/types'
import WorkOrderPrintPage from './WorkOrderPrintPage'
import type { PrintInfo } from '../../shared/print/types'

type WorkOrderFormPageProps = {
  onBack: () => void
  mode?: 'create' | 'edit' | 'view'
  printInfo: PrintInfo
}

const emptyItem: Omit<WorkOrderItem, 'id'> = {
  workName: '',
  workMethod: '',
  result: '',
}

const emptyWorkOrder = {
  id: '',
  title: '',
  equipmentId: '',
  workType: '',
  priority: '',
  permitRequired: false,
  plan: { type: 'plan', workDate: '', workerId: '', manHours: '', manHoursUnit: '', cost: '', summary: '' },
  status: '',
  items: [{ id: '', ...emptyItem }],
} as WorkOrder

type EquipmentLookupResponse = { equipmentId: string; equipmentName: string; permitRequired: string; maker?: string; model?: string }
type WorkerLookupResponse = { workerName: string }

export default function WorkOrderPlanFormPage({ onBack, mode = 'create', printInfo }: WorkOrderFormPageProps) {
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

  const update = (field: keyof WorkOrder, value: string | boolean) => setOrder((current) => ({ ...current, [field]: value }))
  const updatePlan = (field: keyof WorkOrderPhase, value: string) => setOrder((current) => ({ ...current, plan: { ...current.plan, [field]: value } }))

  const updateItem = (index: number, field: keyof typeof emptyItem, value: string) => {
    setOrder((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }))
  }

  const addItem = () => {
    setOrder((current) => ({
      ...current,
      items: [...current.items, { id: '', ...emptyItem }],
    }))
  }

  const removeItem = (index: number) => {
    setOrder((current) => ({
      ...current,
      items: current.items.length === 1
        ? current.items
        : current.items.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const reset = () => {
    setOrder({ ...emptyWorkOrder, equipmentName: '' })
    setMessage('')
  }

  const lookupEquipment = async () => {
    if (!order.equipmentId.trim()) return

    const response = await fetch(`/api/equipments/${encodeURIComponent(order.equipmentId)}`)
    if (!response.ok) {
      setOrder((current) => ({ ...current, equipmentName: '' }))
      setMessage('설비를 찾을 수 없습니다.')
      return
    }

    const data = (await response.json()) as EquipmentLookupResponse
    setOrder((current) => ({ ...current, equipmentId: data.equipmentId, equipmentName: data.equipmentName, permitRequired: data.permitRequired === 'Y', maker: data.maker, model: data.model }))
    setMessage('')
  }

  const lookupWorker = async () => {
    if (!order.plan.workerId.trim()) return

    const response = await fetch(`/api/workers/${encodeURIComponent(order.plan.workerId)}`)
    if (!response.ok) {
      setOrder((current) => ({ ...current, plan: { ...current.plan, workerName: '' } }))
      setMessage('작업자를 찾을 수 없습니다.')
      return
    }

    const data = (await response.json()) as WorkerLookupResponse
    setOrder((current) => ({ ...current, plan: { ...current.plan, workerName: data.workerName } }))
    setMessage('')
  }

  const save = () => {
    setMessage(order.title.trim() ? '작업오더가 저장되었습니다. (파일럿)' : '제목을 입력해 주세요.')
  }
  const requestApproval = () => setMessage('작업오더가 결재 상신되었습니다. (파일럿)')

  return (
    <>
      {isPrinting && <WorkOrderPrintPage order={order} {...printInfo} />}
      <main className="page page-screen">
      <header className="page-header">
        <div>
          <p className="eyebrow">Work Order</p>
          <h1>작업오더 등록</h1>
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
                <input value={order.equipmentId} onChange={(event) => update('equipmentId', event.target.value)} placeholder="설비코드 입력" readOnly={isView} />
                <button type="button" className="button button--neutral" hidden={isView} onClick={() => void lookupEquipment()} aria-label="설비 조회" title="설비 조회">
                  <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>
                </button>
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
                <thead><tr><th>작업오더번호</th><th>작업일</th><th>결과</th></tr></thead>
                <tbody><tr><td colSpan={3} className="table-empty">최근 작업 내역이 없습니다.</td></tr></tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="card">
          <h2 className="card-title">기본정보</h2>
          <label className="field">
            제목
            <input value={order.title} onChange={(event) => update('title', event.target.value)} placeholder="작업오더 제목을 입력하세요" readOnly={isView} />
          </label>
          <label className="field field--spaced">
            개요
            <textarea value={order.plan.summary} onChange={(event) => updatePlan('summary', event.target.value)} placeholder="작업 목적이나 특이사항을 입력하세요" rows={4} readOnly={isView} />
          </label>
          <label className="field field--spaced">
            작업오더번호
            <input value={mode === 'create' ? '등록 시 자동 생성' : order.id} readOnly />
          </label>
        </section>
      </div>

      <section className="card">
        <h2 className="card-title">작업조건정보</h2>
        <div className="form-grid form-grid--3">
          <label className="field">
            작업유형
            <select value={order.workType} onChange={(event) => update('workType', event.target.value)} disabled={isView}>
              <option value="">선택</option><option>예방정비</option><option>고장정비</option><option>개선작업</option>
            </select>
          </label>
          <label className="field">
            우선순위
            <select value={order.priority} onChange={(event) => update('priority', event.target.value)} disabled={isView}>
              <option value="">선택</option><option>높음</option><option>보통</option><option>낮음</option>
            </select>
          </label>
          <label className="field">
            작업허가필요
            <select value={order.permitRequired ? 'Y' : 'N'} onChange={(event) => update('permitRequired', event.target.value === 'Y')} disabled={isView}>
              <option value="">선택</option><option value="Y">Y</option><option value="N">N</option>
            </select>
          </label>
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">계획정보</h2>
        <div className="form-grid form-grid--5">
          <label className="field">
            작업일
            <input type="date" value={order.plan.workDate} onChange={(event) => updatePlan('workDate', event.target.value)} readOnly={isView} />
          </label>
          <label className="field">
            작업자 사번
            <div className="input-group">
              <input value={order.plan.workerId} onChange={(event) => updatePlan('workerId', event.target.value)} readOnly={isView} />
              <button type="button" className="button button--neutral" hidden={isView} onClick={() => void lookupWorker()} aria-label="작업자 조회" title="작업자 조회"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg></button>
            </div>
          </label>
          <label className="field">작업자명<input value={order.plan.workerName ?? ''} readOnly placeholder="작업자 조회 결과" /></label>
          <label className="field">
            시간(총 M/H)
            <div className="input-group">
              <input value={order.plan.manHours} onChange={(event) => updatePlan('manHours', event.target.value)} placeholder="계획 M/H 입력" readOnly={isView} />
              <select value={order.plan.manHoursUnit} onChange={(event) => updatePlan('manHoursUnit', event.target.value)} disabled={isView} aria-label="계획 M/H 단위">
                <option value="">단위</option><option>시간</option><option>일</option><option>주</option><option>월</option>
              </select>
            </div>
          </label>
          <label className="field">
            비용
            <input type="number" value={order.plan.cost} onChange={(event) => updatePlan('cost', event.target.value)} placeholder="계획 비용 입력" readOnly={isView} />
          </label>
        </div>
      </section>

      <section className="card table-card">
        <div className="section-header">
          <h2 className="card-title">작업항목</h2>
          <a className="action-link" hidden={isView} href="#add-work-order-item" onClick={(event) => { event.preventDefault(); addItem() }}>+ 항목 추가</a>
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead><tr><th>작업명</th><th>작업방법</th><th aria-label="작업"></th></tr></thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  {(['workName', 'workMethod'] as const).map((field) => (
                    <td key={field}>
                      <input value={item[field]} onChange={(event) => updateItem(index, field, event.target.value)} placeholder={field === 'workName' ? '작업명 입력' : field === 'workMethod' ? '작업방법 입력' : '실적입력'} readOnly={isView} />
                    </td>
                  ))}
                  <td>
                    <button className="button button--danger" type="button" hidden={isView} onClick={() => removeItem(index)} aria-label="작업항목 삭제" title="작업항목 삭제">
                      <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 7h14M10 11v6m4-6v6M9 7V4h6v3m-9 0 1 13h10l1-13" /></svg>
                    </button>
                  </td>
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
