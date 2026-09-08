import { useState } from 'react'
import { useEffect } from 'react'
import type { PmRecord as PmRecordType, PmRecordItem, PmRecordResponse } from '../../entities/pm-record/types'
import PmRecordPrintPage from './PmRecordPrintPage'
import type { PrintInfo } from '../../shared/print/types'

// type 선언
const emptyRecord: PmRecordType = {
  id: '',
  title: '',
  summary: '',
  equipmentId: '',
  workType: '',
  workDate: '',
  workerId: '',
  result: '',
  items: [{ id: '', inspectionName: '', inspectionMethod: '', standardValue: '', result: '', unit: '' }],
}

type PmRecordFormPageProps = {
  onBack?: () => void
  mode?: 'create' | 'edit' | 'view'
  printInfo: PrintInfo
}

type WorkerLookupResponse = Pick<PmRecordResponse, 'workerName'>
type EquipmentLookupResponse = Pick<PmRecordResponse, 'equipmentId' | 'equipmentName' | 'maker' | 'model'>

export default function PmRecord({ onBack, mode = 'create', printInfo }: PmRecordFormPageProps) {
  const isView = mode === 'view'
  const [isPrinting, setIsPrinting] = useState(false)

  useEffect(() => {
    if (!isPrinting) return
    const finishPrint = () => setIsPrinting(false)
    window.addEventListener('afterprint', finishPrint)
    window.print()
    return () => window.removeEventListener('afterprint', finishPrint)
  }, [isPrinting])
  const [record, setRecord] = useState<PmRecordResponse>({
    ...emptyRecord,
    workerName: '',
    equipmentName: '',
    maker: '',
    model: '',
    approvalStatus: '',
  })
  const [message, setMessage] = useState('')

  const updateRecord = (field: keyof PmRecordType, value: string) => {
    setRecord((current) => ({ ...current, [field]: value }))
  }

  const updateItem = (index: number, field: keyof PmRecordItem, value: string) => {
    setRecord((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }))
  }

  const addItem = () => setRecord((current) => ({
    ...current,
    items: [...current.items, { id: '', inspectionName: '', inspectionMethod: '', standardValue: '', result: '', unit: '' }],
  }))
  const removeItem = (index: number) => setRecord((current) => ({
    ...current,
    items: current.items.length === 1
      ? current.items
      : current.items.filter((_, itemIndex) => itemIndex !== index),
  }))
  const reset = () => {
    setRecord({
      ...emptyRecord,
      workerName: '',
      equipmentName: '',
      maker: '',
      model: '',
      approvalStatus: '',
    })
    setMessage('')
  }
  const lookupEquipment = async () => {
    if (!record.equipmentId.trim()) return

    const response = await fetch(`/api/equipments/${encodeURIComponent(record.equipmentId)}`)
    if (!response.ok) {
      setRecord((current) => ({ ...current, equipmentName: '' }))
      setMessage('설비를 찾을 수 없습니다.')
      return
    }

    const data = (await response.json()) as EquipmentLookupResponse
    setRecord((current) => ({
      ...current,
      equipmentId: data.equipmentId,
      equipmentName: data.equipmentName,
      maker: data.maker,
      model: data.model,
    }))
    setMessage('')
  }
  const lookupWorker = async () => {
    if (!record.workerId.trim()) return

    const response = await fetch(`/api/workers/${encodeURIComponent(record.workerId)}`)
    if (!response.ok) {
      setRecord((current) => ({ ...current, workerName: '' }))
      setMessage('작업자를 찾을 수 없습니다.')
      return
    }

    const data = (await response.json()) as WorkerLookupResponse
    setRecord((current) => ({ ...current, workerName: data.workerName }))
    setMessage('')
  }
  const save = () => setMessage(record.title.trim() ? '점검기록이 저장되었습니다. (파일럿)' : '제목을 입력해 주세요.')
  const requestApproval = () => setMessage('점검기록이 결재 상신되었습니다. (파일럿)')

  return (
    <>
      {isPrinting && <PmRecordPrintPage record={record} {...printInfo} />}
      <main className="page page-screen">
      <header className="page-header">
        <div>
          <p className="eyebrow">Preventive Maintenance</p>
          <h1>예방점검 기록</h1>
        </div>
        <div className="page-actions">
          {onBack && (
            <button className="button button--neutral button--form-action" type="button" onClick={onBack}>
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              목록
            </button>
          )}
          {!isView && <button className="button button--neutral button--form-action" type="button" onClick={reset}>
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M4 12a8 8 0 1 0 2.34-5.66M4 4v5h5" />
            </svg>
            초기화
          </button>}
          <button className="button button--neutral button--form-action" type="button" onClick={() => setIsPrinting(true)}>
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M6 9V4h12v5M6 18H4V10h16v8h-2M6 14h12v6H6v-6Z" />
            </svg>
            인쇄
          </button>
          {!isView && <button className="button button--neutral button--form-action" type="button" onClick={save}>
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M5 4h11l3 3v13H5V4Zm3 0v5h7V4M8 20v-7h8v7" />
            </svg>
            저장
          </button>}
          {!isView && <button className="button button--primary button--form-action" type="button" onClick={requestApproval}>
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="m5 12 4 4L19 6" />
            </svg>
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
              <input
                value={record.equipmentId}
                onChange={(event) => updateRecord('equipmentId', event.target.value)}
                placeholder="설비코드 입력"
                readOnly={isView}
              />
              <button
                type="button"
                className="button button--neutral"
                hidden={isView}
                onClick={() => void lookupEquipment()}
                aria-label="설비 조회"
                title="설비 조회"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="6" />
                  <path d="m16 16 4 4" />
                </svg>
              </button>
            </div>
            </label>
            <label className="field">
              설비명
              <input value={record.equipmentName} readOnly placeholder="설비 조회 결과" />
            </label>
          </div>
          <div className="history-section">
            <h3 className="section-title">최근 점검이력(3건)</h3>
            <div className="table-scroll">
              <table className="data-table data-table--compact">
                <thead>
                  <tr>
                    <th>점검기록번호</th>
                    <th>점검일</th>
                    <th>점검값</th>
                    <th>단위</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={4} className="table-empty">최근 점검 이력이 없습니다.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="card">
          <h2 className="card-title">기본정보</h2>
          <div className="form-grid form-grid--1">
            <label className="field">
              제목
              <input
                value={record.title}
                onChange={(event) => updateRecord('title', event.target.value)}
                placeholder="점검 제목을 입력하세요"
                readOnly={isView}
              />
            </label>
          </div>
          <label className="field field--spaced">
            개요
            <textarea
              value={record.summary}
              onChange={(event) => updateRecord('summary', event.target.value)}
              placeholder="점검 목적이나 특이사항을 입력하세요"
              rows={4}
              readOnly={isView}
            />
          </label>
          <label className="field field--spaced">
            점검기록번호
            <input
              value={mode === 'create' ? '등록 시 자동 생성' : record.id}
              readOnly
            />
          </label>
        </section>
      </div>

      <section className="card">
        <h2 className="card-title">점검정보</h2>
        <div className="form-grid form-grid--5">
          <label className="field">
            작업유형
            <select
              value={record.workType}
              onChange={(event) => updateRecord('workType', event.target.value)}
              disabled={isView}
            >
              <option value="">선택</option>
              <option>정기점검</option>
              <option>수시점검</option>
              <option>긴급점검</option>
            </select>
          </label>
          <label className="field">
            작업일
            <input
              type="date"
              value={record.workDate}
              onChange={(event) => updateRecord('workDate', event.target.value)}
              readOnly={isView}
            />
          </label>
          <label className="field">
            작업자 사번
            <div className="input-group">
              <input
                value={record.workerId}
                onChange={(event) => updateRecord('workerId', event.target.value)}
                readOnly={isView}
              />
              <button
                type="button"
                className="button button--neutral"
                hidden={isView}
                onClick={() => void lookupWorker()}
                aria-label="작업자 조회"
                title="작업자 조회"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="6" />
                  <path d="m16 16 4 4" />
                </svg>
              </button>
            </div>
          </label>
          <label className="field">
            작업자명
            <input value={record.workerName} readOnly />
          </label>
          <label className="field">
            결과
            <select
              value={record.result}
              onChange={(event) => updateRecord('result', event.target.value)}
              disabled={isView}
            >
              <option value="">선택</option>
              <option>양호</option>
              <option>주의</option>
              <option>불량</option>
            </select>
          </label>
        </div>
      </section>

      <section className="card table-card">
        <div className="section-header">
          <h2 className="card-title">점검정보항목</h2>
          <a
            className="action-link"
            hidden={isView}
            href="#add-record-item"
            onClick={(event) => {
              event.preventDefault()
              addItem()
            }}
          >
            + 항목 추가
          </a>
        </div>
        <div className="table-scroll">
          <table className="data-table table--fixed">
            <colgroup>
              <col className="table-col--text" />
              <col className="table-col--text" />
              <col className="table-col--value" />
              <col className="table-col--value" />
              <col className="table-col--unit" />
              <col className="table-col--action" />
            </colgroup>
            <thead>
              <tr>
                <th>점검명</th>
                <th>점검방법</th>
                <th>기준값</th>
                <th>결과</th>
                <th>단위</th>
                <th aria-label="작업"></th>
              </tr>
            </thead>
            <tbody>
              {record.items.map((item, index) => (
                <tr key={index}>
                  {(['inspectionName', 'inspectionMethod', 'standardValue', 'result', 'unit'] as const).map((field) => (
                    <td key={field}>
                      <input
                        value={item[field]}
                        onChange={(event) => updateItem(index, field, event.target.value)}
                        placeholder={field === 'inspectionName' ? '점검명 입력' : field === 'inspectionMethod' ? '점검방법 입력' : ''}
                        readOnly={isView}
                      />
                    </td>
                  ))}
                  <td>
                    <button
                      className="button button--danger"
                      type="button"
                      hidden={isView}
                      onClick={() => removeItem(index)}
                      aria-label="점검항목 삭제"
                      title="점검항목 삭제"
                    >
                      <svg aria-hidden="true" viewBox="0 0 24 24">
                        <path d="M5 7h14M10 11v6m4-6v6M9 7V4h6v3m-9 0 1 13h10l1-13" />
                      </svg>
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
