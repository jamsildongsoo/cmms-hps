import { useEffect, useState } from 'react'
import type { MaterialResponse } from '../../entities/material/types'
import { getMaterials } from '../../features/material/api/materialApi'
import MaterialFormPage from './MaterialFormPage'

export default function MaterialListPage() {
  const [materials, setMaterials] = useState<MaterialResponse[]>([])
  const [page, setPage] = useState<'list' | 'create' | 'view'>('list')
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialResponse>()

  const download = () => {
    const csv = `\ufeff자재번호,자재명,규격,단위\n${materials.map((item) => `${item.id},${item.name},${item.specification},${item.unit}`).join('\n')}\n`
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a'); link.href = url; link.download = '자재목록.csv'; link.click(); URL.revokeObjectURL(url)
  }

  useEffect(() => { void getMaterials().then(setMaterials) }, [])

  if (page !== 'list') return <MaterialFormPage mode={page} onBack={() => setPage('list')} material={selectedMaterial} />

  return (
    <main className="page page-screen">
      <header className="page-header"><div><p className="eyebrow">Material</p><h1>자재</h1></div><div className="page-actions"><button className="button button--neutral button--form-action" type="button" onClick={() => window.print()} aria-label="인쇄" title="인쇄"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 9V4h12v5M6 18H4V10h16v8h-2M6 14h12v6H6v-6Z" /></svg>인쇄</button><button className="button button--neutral button--form-action" type="button" onClick={download}>다운로드</button><button className="button button--primary button--form-action" type="button" onClick={() => { setSelectedMaterial(undefined); setPage('create') }}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>신규</button></div></header>
      <section className="card table-card"><div className="section-header"><h2 className="card-title">자재 목록</h2></div><div className="table-scroll"><table className="data-table"><thead><tr><th>자재번호</th><th>자재명</th><th>규격</th><th>단위</th><th>자재유형</th><th>사용</th></tr></thead><tbody>{materials.map((item) => <tr key={item.id}><td><button className="action-link" type="button" onClick={() => { setSelectedMaterial(item); setPage('view') }}>{item.id}</button></td><td>{item.name}</td><td>{item.specification}</td><td>{item.unit}</td><td>{item.category}</td><td>{item.status === '사용중' ? '사용' : '미사용'}</td></tr>)}</tbody></table></div></section>
    </main>
  )
}
