import { useEffect, useState } from 'react'
import type { LoginInfo } from '../../entities/auth/types'
import type { ApprovalParticipantType, ApprovalResponse } from '../../entities/approval/types'
import { getApprovals, processApproval } from '../../features/approval/api/approvalApi'

type Props = { approvalId: string; session: LoginInfo; onBack: () => void }
const moduleLabels: Record<ApprovalResponse['module'], string> = { general: '일반결재', 'pm-record': '예방점검', 'work-order': '작업오더', 'work-permit': '작업허가', 'purchase-request': '구매요청', 'purchase-order': '구매오더' }
const participantLabels: Record<ApprovalParticipantType, string> = { requester: '기안', approval: '결재', agreement: '합의', reference: '참조' }
const statusLabels: Record<ApprovalResponse['status'], string> = { draft: '임시저장', requested: '상신', inProgress: '진행', approved: '종결', rejected: '반려', cancelled: '취소' }

export default function ApprovalDetailPage({ approvalId, session, onBack }: Props) {
  const [approval, setApproval] = useState<ApprovalResponse | null>(null)
  useEffect(() => { void getApprovals().then((items) => setApproval(items.find((item) => item.id === approvalId) ?? null)) }, [approvalId])

  const process = async (action: 'approve' | 'reject') => {
    if (!approval) return
    setApproval(await processApproval(approval.id, { action }, session.userId))
  }

  if (!approval) return <main className="page page-screen"><p className="notice">결재문을 찾을 수 없습니다.</p><button className="button button--neutral" type="button" onClick={onBack}>목록</button></main>
  return <main className="page page-screen"><header className="page-header"><div><p className="eyebrow">{moduleLabels[approval.module]}</p><h1>결재문 상세</h1></div><div className="page-actions"><button className="button button--neutral button--form-action" type="button" onClick={onBack}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>목록</button></div></header><section className="card"><h2 className="card-title">{approval.title}</h2><dl className="approval-header-info"><div><dt>문서번호</dt><dd>{approval.id}</dd></div><div><dt>상신자</dt><dd>{approval.requesterName}</dd></div><div><dt>소속</dt><dd>{approval.requesterDeptName}</dd></div><div><dt>상신일</dt><dd>{approval.requestedAt ?? '-'}</dd></div><div><dt>상태</dt><dd>{statusLabels[approval.status]}</dd></div><div><dt>종결일</dt><dd>{approval.completedAt?.slice(0, 10) ?? '-'}</dd></div></dl><div className="approval-content approval-rich-content" dangerouslySetInnerHTML={{ __html: approval.content || '<p>본문 내용이 없습니다.</p>' }} /></section><section className="card"><div className="section-header"><h2 className="card-title">첨부파일</h2></div><div className="attachment-line">{approval.attachments?.length ? approval.attachments.map((file) => <div className="attachment-line-item" key={file.id}><span>{file.fileName}</span><small>{file.fileSize < 1024 * 1024 ? `${Math.ceil(file.fileSize / 1024)} KB` : `${(file.fileSize / 1024 / 1024).toFixed(1)} MB`}</small></div>) : <p className="table-empty">첨부파일이 없습니다.</p>}</div></section><section className="card"><div className="section-header"><h2 className="card-title">결재선</h2></div><div className="approval-line">{approval.participants.map((item) => <div className={`approval-line-item approval-line-item--${item.status}`} key={item.id}><span>{participantLabels[item.type]}</span><strong>{item.userName}</strong><span>{item.deptName} / {item.title}</span><span>{item.status === 'approved' ? `결재 ${item.processedAt?.slice(0, 10) ?? ''}` : item.status === 'read' ? `열람 ${item.processedAt?.slice(0, 10) ?? ''}` : item.status === 'rejected' ? `반려 ${item.processedAt?.slice(0, 10) ?? ''}` : item.status === 'pending' ? '대기' : '-'}</span></div>)}</div><div className="modal-actions">{approval.status === 'inProgress' && <><button className="button button--primary" type="button" onClick={() => void process('approve')}>승인</button><button className="button button--danger" type="button" onClick={() => void process('reject')}>반려</button></>}</div></section></main>
}
