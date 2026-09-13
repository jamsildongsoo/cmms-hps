import { APPROVAL_MODULE_LABELS as moduleLabels, APPROVAL_STATUS_LABELS as statusLabels, APPROVAL_PARTICIPANT_TYPE_LABELS as participantLabels } from '../../entities/approval/constants'
import { useEffect, useState } from 'react'
import type { LoginInfo } from '../../entities/auth/types'
import type { ApprovalResponse } from '../../entities/approval/types'
import { getApproval, processApproval } from '../../features/approval/api/approvalApi'
import AttachmentPanel from '../../shared/attachment/AttachmentPanel'
import ApprovalBodyEditor from '../../shared/approval/ApprovalBodyEditor'

type Props = { approvalId: string; session: LoginInfo; onBack: () => void }

export default function ApprovalDetailPage({ approvalId, session, onBack }: Props) {
  const [approval, setApproval] = useState<ApprovalResponse | null>(null)
  useEffect(() => { void getApproval(approvalId).then(setApproval) }, [approvalId])

  const process = async (action: 'approve' | 'reject') => {
    if (!approval) return
    setApproval(await processApproval(approval.id, { action }))
  }

  if (!approval) return <main className="page page-screen"><p className="notice">결재문을 찾을 수 없습니다.</p><button className="button button--neutral" type="button" onClick={onBack}>목록</button></main>
  const canProcess = approval.status === 'inProgress' && approval.participants.some((item) => item.userId === session.userId && item.sequenceNo === approval.currentStep && (item.type === 'approval' || item.type === 'agreement') && item.status === 'pending')
  return (
    <main className="page page-screen">
      <header className="page-header">
        <div><p className="eyebrow">{moduleLabels[approval.module]}</p><h1>결재문 상세</h1></div>
        <div className="page-actions">
          <button className="button button--neutral button--form-action" type="button" onClick={onBack}>
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>목록
          </button>
        </div>
      </header>
      <section className="card">
        <h2 className="card-title">{approval.title}</h2>
        <div className="form-grid form-grid--3 mb-6">
          <label className="field">문서번호<span className="control bg-slate-50 flex items-center px-3">{approval.id}</span></label>
          <label className="field">상신자<span className="control bg-slate-50 flex items-center px-3">{approval.requesterName}</span></label>
          <label className="field">소속<span className="control bg-slate-50 flex items-center px-3">{approval.requesterDeptName}</span></label>
          <label className="field">상신일<span className="control bg-slate-50 flex items-center px-3">{approval.requestedAt ?? '-'}</span></label>
          <label className="field">상태<span className="control bg-slate-50 flex items-center px-3">{statusLabels[approval.status]}</span></label>
          <label className="field">종결일<span className="control bg-slate-50 flex items-center px-3">{approval.completedAt?.slice(0, 10) ?? '-'}</span></label>
        </div>
        <ApprovalBodyEditor value={approval.content || ''} onChange={() => undefined} readOnly />
      </section>
      <AttachmentPanel module="APR" recordId={approval.id} readOnly />
      <section className="card">
        <div className="section-header"><h2 className="card-title">결재선</h2></div>
        <table className="data-table data-table--compact">
          <thead>
            <tr><th>유형</th><th>이름</th><th>소속 / 직책</th><th>상태</th></tr>
          </thead>
          <tbody>
            {approval.participants.map((item) => (
              <tr key={`${item.companyId}-${item.id}-${item.sequenceNo}`}>
                <td>{participantLabels[item.type]}</td>
                <td><strong>{item.userName}</strong></td>
                <td>{item.deptName} / {item.title}</td>
                <td>
                  {item.status === 'approved' ? `결재 ${item.processedAt?.slice(0, 10) ?? ''}` : item.status === 'read' ? `열람 ${item.processedAt?.slice(0, 10) ?? ''}` : item.status === 'rejected' ? `반려 ${item.processedAt?.slice(0, 10) ?? ''}` : item.status === 'pending' ? '대기' : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="modal-actions mt-6">
          {canProcess && (
            <>
              <button className="button button--primary" type="button" onClick={() => void process('approve')}>승인</button>
              <button className="button button--danger" type="button" onClick={() => void process('reject')}>반려</button>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
