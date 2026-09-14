import { useEffect, useState } from 'react'
import { getCodeItems } from '../../code/api/codeApi'
import type { CodeItem } from '../../code/types/types'
import type { Equipment } from '../types/types'
import { createEquipment } from '../api/equipmentApi'

type Props = {
  onBack: () => void
  mode?: 'create' | 'edit' | 'view'
}

const emptyEquipment: Equipment = {
  id: '',
  companyId: '',
  siteId: '',
  name: '',
  location: '',
  code: 'equipmentType',
  type: '',
  installedAt: '',
  permitRequired: '',
  maker: '',
  model: '',
  specification: '',
  serialNumber: '',
  summary: '',
  status: '',
}

export default function EquipmentFormPage({ onBack, mode = 'create' }: Props) {
  const isView = mode === 'view'
  const [equipment, setEquipment] = useState(emptyEquipment)
  const [typeItems, setTypeItems] = useState<CodeItem[]>([])

  useEffect(() => {
    void getCodeItems('equipmentType').then(setTypeItems).catch(() => setTypeItems([]))
  }, [])

  const update = (field: keyof Equipment, value: string) => {
    setEquipment((current) => ({ ...current, [field]: value }))
  }

  const reset = () => setEquipment(emptyEquipment)
  const save = async () => {
    if (mode === 'create') {
      const { id: _id, companyId: _companyId, ...payload } = equipment
      await createEquipment(payload)
      onBack()
    }
  }

  return (
    <main className="page page-screen">
      <header className="page-header">
        <div>
          <p className="eyebrow">Equipment</p>
          <h1>{isView ? '설비 조회' : '설비 등록'}</h1>
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
          <button className="button button--neutral button--form-action" type="button" onClick={() => window.print()}>
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 9V4h12v5M6 18H4V10h16v8h-2M6 14h12v6H6v-6Z" /></svg>
            인쇄
          </button>
          {!isView && <button className="button button--primary button--form-action" type="button" onClick={save}>
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 4h11l3 3v13H5V4Zm3 0v5h7V4M8 20v-7h8v7" /></svg>
            저장
          </button>}
        </div>
      </header>

      <section className="card">
        <h2 className="card-title">기본정보</h2>
        <div className="form-grid form-grid--4">
          <label className="field">
            사업장코드
            <input value={equipment.siteId} onChange={(event) => update('siteId', event.target.value)} readOnly={isView} />
          </label>
          <label className="field">
            설비코드
            <input value={equipment.id} readOnly />
          </label>
          <label className="field field--span-2">
            설비명
            <input value={equipment.name} onChange={(event) => update('name', event.target.value)} readOnly={isView} />
          </label>
          <label className="field">
            설비유형
            <select value={equipment.type} onChange={(event) => update('type', event.target.value)} disabled={isView}>
              <option value="">선택</option>
              {typeItems.filter((item) => item.active).map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </label>
          <label className="field">
            설치위치
            <input value={equipment.location} onChange={(event) => update('location', event.target.value)} readOnly={isView} />
          </label>
          <label className="field">
            설치일
            <input type="date" value={equipment.installedAt} onChange={(event) => update('installedAt', event.target.value)} readOnly={isView} />
          </label>
          <label className="field">
            작업허가필요
            <select value={equipment.permitRequired} onChange={(event) => update('permitRequired', event.target.value)} disabled={isView}>
              <option value="">선택</option>
              <option value="Y">Y</option>
              <option value="N">N</option>
            </select>
          </label>
          <label className="field">
            설비상태
            <select value={equipment.status} onChange={(event) => update('status', event.target.value)} disabled={isView}>
              <option value="">선택</option>
              <option>사용중</option>
              <option>정지</option>
              <option>폐기</option>
            </select>
          </label>
          <label className="field field--span-2">
            적요
            <textarea value={equipment.summary} onChange={(event) => update('summary', event.target.value)} readOnly={isView} rows={4} />
          </label>
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">제조사정보</h2>
        <div className="form-grid form-grid--4">
          <label className="field">제조사<input value={equipment.maker} onChange={(event) => update('maker', event.target.value)} readOnly={isView} /></label>
          <label className="field">모델<input value={equipment.model} onChange={(event) => update('model', event.target.value)} readOnly={isView} /></label>
          <label className="field">스펙<input value={equipment.specification} onChange={(event) => update('specification', event.target.value)} readOnly={isView} /></label>
          <label className="field">일련번호<input value={equipment.serialNumber} onChange={(event) => update('serialNumber', event.target.value)} readOnly={isView} /></label>
        </div>
      </section>

    </main>
  )
}
