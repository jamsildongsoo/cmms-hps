import { useState } from 'react'
import type { ApprovalParticipantType } from '../../entities/approval/types'

type ApprovalLineDraft = {
  userId: string
  userName: string
  deptName: string
  type: Exclude<ApprovalParticipantType, 'requester'>
}

type Props = {
  open: boolean
  title: string
  recordId: string
  requesterName: string
  onClose: () => void
  onSubmit: (line: ApprovalLineDraft[], comment: string) => void
}

export default function ApprovalSubmitModal({ open, title, recordId, requesterName, onClose, onSubmit }: Props) {
  const [comment, setComment] = useState('')
  const [line, setLine] = useState<ApprovalLineDraft[]>([
    { userId: '', userName: '', deptName: '', type: 'approval' },
  ])
  if (!open) return null

  const updateLine = (index: number, field: keyof ApprovalLineDraft, value: string) => {
    setLine((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item))
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="approval-submit-title" onClick={(event) => event.stopPropagation()}>
      <div className="modal-header"><div><p className="eyebrow">Approval Submit</p><h2 id="approval-submit-title">결재 상신</h2></div><button className="button button--neutral" type="button" onClick={onClose}>닫기</button></div>
      <dl className="approval-header-info"><div><dt>문서번호</dt><dd>{recordId}</dd></div><div><dt>문서명</dt><dd>{title}</dd></div><div><dt>기안자</dt><dd>{requesterName}</dd></div><div><dt>상태</dt><dd>임시저장</dd></div></dl>
      <div className="approval-line"><h3>결재선</h3><div className="approval-line-item"><span className="approval-sequence">0</span><span>기안</span><strong>{requesterName}</strong><span>상신자</span><span>-</span></div>{line.map((item, index) => <div className="approval-line-item" key={`${index}-${item.type}`}><span className="approval-sequence">{index + 1}</span><select value={item.type} onChange={(event) => updateLine(index, 'type', event.target.value)}><option value="approval">결재</option><option value="agreement">합의</option><option value="reference">참조</option></select><input value={item.userName} placeholder="사용자명" onChange={(event) => updateLine(index, 'userName', event.target.value)} /><input value={item.deptName} placeholder="부서" onChange={(event) => updateLine(index, 'deptName', event.target.value)} /><button className="button button--danger" type="button" onClick={() => setLine((current) => current.filter((_, itemIndex) => itemIndex !== index))}>삭제</button></div>)}<button className="button button--neutral" type="button" onClick={() => setLine((current) => [...current, { userId: '', userName: '', deptName: '', type: 'approval' }])}>결재선 추가</button></div>
      <label className="field field--spaced">상신 의견<textarea value={comment} onChange={(event) => setComment(event.target.value)} /></label>
      <div className="modal-actions"><button className="button button--secondary" type="button" onClick={() => onSubmit(line, comment)}>임시저장</button><button className="button button--primary" type="button" onClick={() => onSubmit(line, comment)}>상신</button></div>
    </section></div>
  )
}
