import { APPROVAL_PARTICIPANT_OPTIONS } from '../../entities/approval/constants'
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
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="approval-submit-title" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div><p className="eyebrow">Approval Submit</p><h2 id="approval-submit-title">결재 상신</h2></div>
          <button className="button button--neutral" type="button" onClick={onClose}>닫기</button>
        </div>
        <div className="form-grid form-grid--2 mb-4">
          <label className="field">문서번호<span className="control bg-slate-50 flex items-center px-3">{recordId}</span></label>
          <label className="field">문서명<span className="control bg-slate-50 flex items-center px-3">{title}</span></label>
          <label className="field">기안자<span className="control bg-slate-50 flex items-center px-3">{requesterName}</span></label>
          <label className="field">상태<span className="control bg-slate-50 flex items-center px-3">임시저장</span></label>
        </div>
        <div className="field">
          <div className="section-header mb-2"><h3 className="text-sm font-bold text-slate-900 m-0">결재선</h3></div>
          <table className="data-table data-table--compact mb-2">
            <thead>
              <tr><th>순서</th><th>유형</th><th>사용자명</th><th>부서</th><th>삭제</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>0</td>
                <td>기안</td>
                <td><strong>{requesterName}</strong></td>
                <td>상신자</td>
                <td>-</td>
              </tr>
              {line.map((item, index) => (
                <tr key={`${index}-${item.type}`}>
                  <td>{index + 1}</td>
                  <td>
                    <select value={item.type} onChange={(event) => updateLine(index, 'type', event.target.value)}>
                      {APPROVAL_PARTICIPANT_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </td>
                  <td><input value={item.userName} placeholder="사용자명" onChange={(event) => updateLine(index, 'userName', event.target.value)} /></td>
                  <td><input value={item.deptName} placeholder="부서" onChange={(event) => updateLine(index, 'deptName', event.target.value)} /></td>
                  <td>
                    <button className="button button--danger" type="button" onClick={() => setLine((current) => current.filter((_, itemIndex) => itemIndex !== index))}>삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="button button--neutral" type="button" onClick={() => setLine((current) => [...current, { userId: '', userName: '', deptName: '', type: 'approval' }])}>결재선 추가</button>
        </div>
        <label className="field field--spaced">상신 의견<textarea value={comment} onChange={(event) => setComment(event.target.value)} /></label>
        <div className="modal-actions">
          <button className="button button--secondary" type="button" onClick={() => onSubmit(line, comment)}>임시저장</button>
          <button className="button button--primary" type="button" onClick={() => onSubmit(line, comment)}>상신</button>
        </div>
      </section>
    </div>
  )
}
