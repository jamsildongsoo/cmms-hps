import { SUPPLEMENT_TYPE_LABELS } from '../../../../shared/domain-codes'
import { useEffect, useState } from 'react'
import type { GasInspection, SafetyActionItem, SupplementType, WorkPermit } from '../../entities/work-permit/types'
import { generalRiskTemplate } from '../../entities/work-permit/templates/general-risk'
import WorkPermitPrintPage from './WorkPermitPrintPage'
import type { PrintInfo } from '../../shared/print/types'

type Props = {
  onBack: () => void
  mode?: 'create' | 'edit' | 'view'
  printInfo: PrintInfo
}

const supplements = Object.entries(SUPPLEMENT_TYPE_LABELS) as Array<[SupplementType, string]>
const emptyGasInspections: GasInspection[] = Array.from({ length: 4 }, () => ({ gasName: '', gasMeter: '', result: '', checkedAt: '' }))
const createSafetyActions = (): SafetyActionItem[] => generalRiskTemplate.items.map(({ label }) => ({ label, checked: false }))
const createEmptyPermit = (): WorkPermit => ({
  id: '', companyId: '', siteId: '', deptId: '', workerId: '', name: '', code: 'workPermitType', type: '', equipmentId: '', equipmentName: '', workMethod: '', supervisorId: '', supervisorName: '',
  workPlace: '', permitFrom: '', permitTo: '', summary: '', safetyActionRequirements: createSafetyActions(),
  specialRequirements: '', safetyReviewOpinion: '', gasInspections: emptyGasInspections.map((item) => ({ ...item })),
  gasMeasurer: '', gasConfirmer: '', safetyCheckWitness: '', safetyCheckWitnessName: '',
  safetyCheckWorker: '', safetyCheckWorkerName: '', completionWitness: '', completionWitnessName: '',
  completionWorker: '', completionWorkerName: '', issuer: '', issuerName: '', approver: '', approverName: '',
  permitRequired: [], supplementDetails: {}, status: '',
})

export default function WorkPermitFormPage({ onBack, mode = 'create', printInfo }: Props) {
  const isView = mode === 'view'
  const [isPrinting, setIsPrinting] = useState(false)
  const [permit, setPermit] = useState<WorkPermit>(createEmptyPermit)
  useEffect(() => {
    if (!isPrinting) return
    const finishPrint = () => setIsPrinting(false)
    window.addEventListener('afterprint', finishPrint)
    window.print()
    return () => window.removeEventListener('afterprint', finishPrint)
  }, [isPrinting])
  const update = <K extends keyof WorkPermit>(field: K, value: WorkPermit[K]) => {
    setPermit((current) => ({ ...current, [field]: value }))
  }
  const toggleSupplement = (type: SupplementType) => {
    setPermit((current) => ({
      ...current,
      permitRequired: current.permitRequired.includes(type)
        ? current.permitRequired.filter((item) => item !== type)
        : [...current.permitRequired, type],
    }))
  }
  const lookupIssuer = async () => {
    if (!permit.issuer.trim()) return
    const response = await fetch(`/api/workers/${encodeURIComponent(permit.issuer)}`)
    if (!response.ok) {
      update('issuerName', '')
      return
    }
    const data = (await response.json()) as { workerName: string }
    update('issuerName', data.workerName)
  }
  const lookupApprover = async () => {
    if (!permit.approver.trim()) return
    const response = await fetch(`/api/workers/${encodeURIComponent(permit.approver)}`)
    update('approverName', response.ok ? ((await response.json()) as { workerName: string }).workerName : '')
  }
  return (
    <>
      {isPrinting && (
        <WorkPermitPrintPage permit={permit} {...printInfo} />
      )}
      <main className="page page-screen">
        <header className="page-header">
          <div>
            <p className="eyebrow">Work Permit</p>
            <h1>{isView ? '작업허가서 조회' : '작업허가서 등록'}</h1>
          </div>
          <div className="page-actions">
            <button className="button button--neutral button--form-action" type="button" onClick={onBack}>
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" /></svg>
              목록
            </button>
            {!isView && <button className="button button--neutral button--form-action" type="button" onClick={() => setPermit(createEmptyPermit())}>
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.34-5.66M4 4v5h5" /></svg>
              초기화
            </button>}
            {!isView && <button className="button button--neutral button--form-action" type="button" onClick={() => setIsPrinting(true)}>
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 9V4h12v5M6 18H4V10h16v8h-2M6 14h12v6H6v-6Z" /></svg>
              인쇄
            </button>}
            {!isView && <button className="button button--neutral button--form-action" type="button">
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 4h14v16H5zM8 4v5h8V4M8 16h8" /></svg>
              저장
            </button>}
            {!isView && <button className="button button--primary button--form-action" type="button">
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6" /></svg>
              결재
            </button>}
          </div>
        </header>

      <div className="card-grid card-grid--2">
        <section className="card">
          <h2 className="card-title">기본정보</h2>
          <label className="field">
            허가명
          <input value={permit.name} onChange={(event) => update('name', event.target.value)} readOnly={isView} placeholder="허가명을 입력하세요" />
          </label>
          <label className="field field--spaced">
            개요
          <textarea value={permit.summary} onChange={(event) => update('summary', event.target.value)} readOnly={isView} rows={4} />
          </label>
          <label className="field field--spaced">
            허가번호
            <input value={permit.id || '등록 시 자동 생성'} readOnly />
          </label>
        </section>
        <section className="card">
          <h2 className="card-title">일반허가</h2>
          <div className="form-grid form-grid--4">
          <label className="field field--span-2">
            허가 From
            <input type="datetime-local" value={permit.permitFrom} onChange={(event) => update('permitFrom', event.target.value)} readOnly={isView} />
          </label>
          <label className="field field--span-2">
            허가 To
            <input type="datetime-local" value={permit.permitTo} onChange={(event) => update('permitTo', event.target.value)} readOnly={isView} />
          </label>
          <label className="field field--span-2">
            발급자 사번
            <div className="input-group">
              <input value={permit.issuer} onChange={(event) => update('issuer', event.target.value)} readOnly={isView} />
              <button type="button" className="button button--neutral" hidden={isView} onClick={() => void lookupIssuer()} aria-label="발급자 조회" title="발급자 조회">
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="6" />
                  <path d="m16 16 4 4" />
                </svg>
              </button>
            </div>
          </label>
          <label className="field field--span-2">
            발급자명
            <input value={permit.issuerName} onChange={(event) => update('issuerName', event.target.value)} disabled />
          </label>
          <label className="field field--span-2">
            승인자 사번
            <div className="input-group">
              <input value={permit.approver} onChange={(event) => update('approver', event.target.value)} readOnly={isView} />
              <button type="button" className="button button--neutral" hidden={isView} onClick={() => void lookupApprover()} aria-label="승인자 조회" title="승인자 조회">
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="6" />
                  <path d="m16 16 4 4" />
                </svg>
              </button>
            </div>
          </label>
          <label className="field field--span-2">
            승인자명
            <input value={permit.approverName} disabled placeholder="승인자 조회 결과" />
          </label>
          </div>
        </section>
      </div>

      <section className="card">
        <h2 className="card-title">작업장소 및 설비</h2>
        <div className="form-grid form-grid--4">
          <label className="field">
            작업지역
            <input value={permit.workPlace} onChange={(event) => update('workPlace', event.target.value)} readOnly={isView} placeholder="작업지역을 입력하세요" />
          </label>
          <label className="field">
            설비명
            <input value={permit.equipmentName} onChange={(event) => update('equipmentName', event.target.value)} readOnly={isView} placeholder="설비명을 입력하세요" />
          </label>
          <label className="field">
            설비번호
            <input value={permit.equipmentId} onChange={(event) => update('equipmentId', event.target.value)} readOnly={isView} placeholder="설비번호를 입력하세요" />
          </label>
          <label className="field">
            작업방안
            <select value={permit.workMethod} onChange={(event) => update('workMethod', event.target.value as WorkPermit['workMethod'])} disabled={isView}>
              <option value="">선택</option>
              <option value="자체">자체</option>
              <option value="외주">외주</option>
            </select>
          </label>
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">안전조치 요구사항</h2>
        <div className="form-grid form-grid--2">
          <label className="field">
            특별요구사항
            <textarea
              rows={4}
              value={permit.specialRequirements}
              onChange={(event) => update('specialRequirements', event.target.value)}
              readOnly={isView}
              placeholder="특별히 준수해야 할 요구사항을 입력하세요"
            />
          </label>
          <label className="field">
            안전검토 의견
            <textarea
              rows={4}
              value={permit.safetyReviewOpinion}
              onChange={(event) => update('safetyReviewOpinion', event.target.value)}
              readOnly={isView}
              placeholder="안전검토 의견을 입력하세요"
            />
          </label>
          <fieldset className="field field--span-2">
            <legend>안전조치 항목</legend>
            <div className="form-grid form-grid--2">
              {permit.safetyActionRequirements.map((item, index) => (
                <label className="checkbox-field" key={item.label}>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => update(
                      'safetyActionRequirements',
                      permit.safetyActionRequirements.map((current, itemIndex) => (
                        itemIndex === index ? { ...current, checked: !current.checked } : current
                      )),
                    )}
                    disabled={isView}
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">보충허가</h2>
        <div className="form-grid form-grid--5">
          {supplements.map(([type, label]) => (
            <label className="field" key={type}>
              <span>
                <input type="checkbox" checked={permit.permitRequired.includes(type)} onChange={() => toggleSupplement(type)} disabled={isView} />
                {label}
              </span>
            </label>
          ))}
        </div>
      </section>
      {permit.permitRequired.map((type) => (
        <section className="card" key={type}>
          <h2 className="card-title">{supplements.find(([item]) => item === type)?.[1]} 보충허가서</h2>
          <label className="field">
            안전조치 및 작업조건
                <textarea
                  rows={5}
                  value={permit.supplementDetails[type] ?? ''}
                  placeholder="선택된 보충허가서의 안전조치 항목을 입력하세요"
                  onChange={(event) => update('supplementDetails', {
                    ...permit.supplementDetails,
                    [type]: event.target.value,
                  })}
                  readOnly={isView}
                />
          </label>
          <p className="table-empty">출력 후 서명</p>
        </section>
      ))}
      </main>
    </>
  )
}
