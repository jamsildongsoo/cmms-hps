import { useState } from 'react'
import type { Material } from '../../entities/material/types'

type Props = { mode?: 'create' | 'edit' | 'view'; onBack: () => void; material?: Material }

const emptyMaterial: Material = {
  id: '', companyId: '', siteId: '', name: '', category: '', specification: '', unit: '', maker: '', model: '', standardPrice: '', status: '사용중', deleteYN: 'N',
}

export default function MaterialFormPage({ mode = 'create', onBack, material }: Props) {
  const isView = mode === 'view'
  const [form, setForm] = useState<Material>(material ?? emptyMaterial)
  const update = (field: keyof Material, value: string) => setForm((current) => ({ ...current, [field]: value }))
  const reset = () => setForm(material ?? emptyMaterial)

  return <main className="page page-screen"><header className="page-header"><div><p className="eyebrow">Material</p><h1>{isView ? '자재 조회' : mode === 'edit' ? '자재 수정' : '자재 등록'}</h1></div><div className="page-actions"><button className="button button--neutral button--form-action" type="button" onClick={onBack}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>목록</button>{!isView && <button className="button button--neutral button--form-action" type="button" onClick={reset}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.34-5.66M4 4v5h5" /></svg>초기화</button>}<button className="button button--neutral button--form-action" type="button" onClick={() => window.print()}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 9V4h12v5M6 18H4V10h16v8h-2M6 14h12v6H6v-6Z" /></svg>인쇄</button>{!isView && <button className="button button--primary button--form-action" type="button" onClick={() => alert('자재가 저장되었습니다. (파일럿)')}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 4h12l2 2v14H5V4Zm3 0v6h6V4M8 16h8" /></svg>저장</button>}</div></header><section className="card"><h2 className="card-title">기본정보</h2><div className="form-grid form-grid--4"><label className="field">자재번호<input value={form.id} onChange={(event) => update('id', event.target.value)} readOnly={isView} placeholder={mode === 'create' ? '등록 시 자동 생성' : ''} /></label><label className="field field--span-2">자재명<input value={form.name} onChange={(event) => update('name', event.target.value)} readOnly={isView} /></label><label className="field">자재유형<input value={form.category} onChange={(event) => update('category', event.target.value)} readOnly={isView} /></label></div></section><section className="card"><h2 className="card-title">제조사 정보</h2><div className="form-grid form-grid--4"><label className="field">제조사<input value={form.maker} onChange={(event) => update('maker', event.target.value)} readOnly={isView} /></label><label className="field">모델<input value={form.model} onChange={(event) => update('model', event.target.value)} readOnly={isView} /></label><label className="field">규격<input value={form.specification} onChange={(event) => update('specification', event.target.value)} readOnly={isView} /></label><label className="field">단위<input value={form.unit} onChange={(event) => update('unit', event.target.value)} readOnly={isView} /></label></div></section></main>
}
