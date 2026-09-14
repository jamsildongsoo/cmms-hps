import { APPROVAL_MODULE_LABELS as moduleLabels, APPROVAL_STATUS_LABELS as statusLabels } from '../types/constants'
import { useEffect, useState } from 'react'
import type { LoginInfo } from '../../auth/types/types'
import type { ApprovalFolder, ApprovalResponse } from '../types/types'
import { getApprovals } from '../api/approvalApi'

type Props = { session: LoginInfo; onCreate: () => void; onDetail: (approvalId: string) => void }

const folderLabels: Record<ApprovalFolder, string> = { submitted: '상신함', pending: '미결함', completed: '기결함', reference: '참조함' }

export default function ApprovalPage({ onCreate, onDetail }: Props) {
  const [approvals, setApprovals] = useState<ApprovalResponse[]>([])
  const [folder, setFolder] = useState<ApprovalFolder>('submitted')

  useEffect(() => { void getApprovals(folder).then(setApprovals) }, [folder])

  return (
    <main className="page page-screen">
      <header className="page-header">
        <div>
          <p className="eyebrow">Approval</p><h1>결재</h1>
        </div>
        <div className="page-actions"><button className="button button--primary button--form-action" type="button" onClick={onCreate}><svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14" /></svg>신규</button>
        </div></header>
        <div className="tabs" role="tablist" aria-label="결재함">
          {(Object.keys(folderLabels) as ApprovalFolder[]).map((item) => <button key={item} className={`tab ${folder === item ? 'active' : ''}`} type="button" role="tab" aria-selected={folder === item} onClick={() => setFolder(item)}>{folderLabels[item]}</button>)}
        </div>
        <section className="card table-card">
          <div className="section-header">
            <h2 className="card-title">{folderLabels[folder]} 목록</h2></div>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>문서번호</th>
                  <th>문서유형</th>
                  <th>문서명</th>
                  <th>상신자</th>
                  <th>소속</th>
                  <th>상신일</th>
                  <th>상태</th>
                  <th>결재단계</th>
                  </tr>
                </thead>
                <tbody>
                  {approvals.map((approval) => <tr key={approval.id}>
                    <td><button className="action-link" type="button" onClick={() => onDetail(approval.id)}>{approval.id}</button></td><td>{moduleLabels[approval.module]}
                    </td>
                    <td><button className="action-link" type="button" onClick={() => onDetail(approval.id)}>{approval.title}</button></td><td>{approval.requesterName}</td>
                    <td>{approval.requesterDeptName}</td><td>{approval.requestedAt ?? '-'}</td>
                    <td>{statusLabels[approval.status]}</td><td>{approval.currentStep} / {approval.totalSteps}</td></tr>)}
                </tbody>
              </table>
          </div>
        </section>
    </main>
  )
}
