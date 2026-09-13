import { APPROVAL_PARTICIPANT_TYPE_LABELS, APPROVAL_PARTICIPANT_OPTIONS } from '../../entities/approval/constants'
import { useEffect, useState } from 'react'
import type { LoginInfo } from '../../entities/auth/types'
import type { ApprovalParticipant, ApprovalParticipantType, ApprovalResponse } from '../../entities/approval/types'
import { createApprovalDraft, saveApprovalDraft, submitApproval } from '../../features/approval/api/approvalApi'
import { getOrganization } from '../../features/org/api/orgApi'
import ApprovalBodyEditor from '../../shared/approval/ApprovalBodyEditor'
import AttachmentPanel from '../../shared/attachment/AttachmentPanel'
import ApprovalPrintPage from './ApprovalPrintPage'

type Props = { session: LoginInfo; onBack: () => void }

export default function ApprovalFormPage({ session, onBack }: Props) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [users, setUsers] = useState<Array<{ userId: string; userName: string; deptName: string; title: string }>>([])
  const [participants, setParticipants] = useState<Array<Pick<ApprovalParticipant, 'userId' | 'userName' | 'deptName' | 'title' | 'type'>>>([])
  const [participantType, setParticipantType] = useState<Exclude<ApprovalParticipantType, 'requester'>>('approval')
  const [participantUserId, setParticipantUserId] = useState('')
  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isPrinting, setIsPrinting] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)

  useEffect(() => { void getOrganization().then((data) => setUsers(data.users.map((user) => ({ userId: user.id, userName: user.name, deptName: data.departments.find((department) => department.id === user.deptId)?.name ?? '', title: user.title || user.position })))) }, [])
  useEffect(() => { if (!isPrinting) return; const finishPrint = () => setIsPrinting(false); window.addEventListener('afterprint', finishPrint); window.print(); return () => window.removeEventListener('afterprint', finishPrint) }, [isPrinting])

  const addParticipant = () => {
    const selected = users.find((user) => user.userId === participantUserId)
    if (!selected || participants.some((item) => item.userId === selected.userId)) return false
    setParticipants((current) => [...current, { userId: selected.userId, userName: selected.userName, deptName: selected.deptName, title: selected.title, type: participantType }])
    setParticipantUserId('')
    return true
  }

  const save = async (status: ApprovalResponse['status']) => {
    if (!title.trim()) { setMessage('제목을 입력해 주세요.'); return }
    if (savedId) {
      if (status !== 'draft') {
        await saveApprovalDraft(savedId, { title, content, participants })
        await submitApproval(savedId)
        setMessage('결재 상신되었습니다.')
        onBack()
      } else {
        await saveApprovalDraft(savedId, { title, content, participants })
        setMessage('임시저장되었습니다.')
      }
      return
    }
    const saved = await createApprovalDraft({ module: 'general', recordId: null, title, content, participants, submit: false })
    setSavedId(saved.id)
    setMessage(status === 'draft' ? '임시저장되었습니다. 첨부 후 상신할 수 있습니다.' : '임시저장되었습니다. 첨부파일을 확인한 후 다시 상신해 주세요.')
  }

  return (
    <main className="page page-screen">
      {isPrinting && <ApprovalPrintPage title={title} content={content} requesterName={session.userName} participants={participants} />}
      <header className="page-header">
        <div><p className="eyebrow">Approval Document</p><h1>결재문 작성</h1></div>
        <div className="page-actions">
          <button className="button button--neutral button--form-action" type="button" onClick={onBack}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>목록</button>
          <button className="button button--neutral button--form-action" type="button" onClick={() => setIsPrinting(true)}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 9V4h12v5M6 18H4V10h16v8h-2M6 14h12v6H6v-6Z" /></svg>인쇄</button>
          <button className="button button--neutral button--form-action" type="button" onClick={() => void save('draft')}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 4h12l2 2v14H5V4Zm3 0v6h6V4M8 16h8" /></svg>저장</button>
          <button className="button button--primary button--form-action" type="button" onClick={() => void save('requested')}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6" /></svg>상신</button>
        </div>
      </header>
      <section className="card">
        <div className="form-grid form-grid--4">
          <label className="field field--span-4">제목<input required value={title} onChange={(event) => setTitle(event.target.value)} /></label>
          <div className="field field--span-4">
            <div className="section-header mb-2">
              <span className="font-semibold text-slate-700">결재선</span>
              <button className="action-link" type="button" onClick={() => setIsParticipantModalOpen(true)}>+ 결재선 추가</button>
            </div>
            <div className="table-scroll border rounded-md">
              <table className="data-table data-table--compact">
                <thead>
                  <tr><th>유형</th><th>이름</th><th>직책</th><th>부서명</th><th>삭제</th></tr>
                </thead>
                <tbody>
                  <tr><td>기안</td><td><strong>{session.userName}</strong></td><td>-</td><td>{session.deptName}</td><td>-</td></tr>
                  {participants.map((item) => (
                    <tr key={item.userId}>
                      <td>{APPROVAL_PARTICIPANT_TYPE_LABELS[item.type]}</td>
                      <td><strong>{item.userName}</strong></td>
                      <td>{item.title || '-'}</td>
                      <td>{item.deptName || '-'}</td>
                      <td>
                        <button className="button button--danger" type="button" aria-label="결재선 삭제" onClick={() => setParticipants((current) => current.filter((line) => line.userId !== item.userId))}>
                          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 7h14M10 11v6m4-6v6M9 7V4h6v3m-8 0 1 13h8l1-13" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="field field--span-4">
            <span className="font-semibold text-slate-700 mb-1 block">본문</span>
            <ApprovalBodyEditor value={content} onChange={setContent} />
          </div>
          {savedId && <AttachmentPanel module="APR" recordId={savedId} />}
        </div>
      </section>
      {isParticipantModalOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsParticipantModalOpen(false)}>
          <section className="modal modal--small" role="dialog" aria-modal="true" aria-labelledby="participant-modal-title" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div><p className="eyebrow">Approval Line</p><h2 id="participant-modal-title">결재선 추가</h2></div>
              <button className="button button--neutral" type="button" onClick={() => setIsParticipantModalOpen(false)}>닫기</button>
            </div>
            <div className="form-grid form-grid--1">
              <label className="field">유형<select value={participantType} onChange={(event) => setParticipantType(event.target.value as Exclude<ApprovalParticipantType, 'requester'>)}>{APPROVAL_PARTICIPANT_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}</select></label>
              <label className="field">사용자<select value={participantUserId} onChange={(event) => setParticipantUserId(event.target.value)}><option value="">사용자 선택</option>{users.map((user) => <option key={user.userId} value={user.userId}>{user.userName}</option>)}</select></label>
              {(() => { const selected = users.find((user) => user.userId === participantUserId); return <div className="p-3 bg-slate-50 rounded-md text-xs flex gap-4 text-slate-600"><span>직책: {selected?.title || '-'}</span><span>부서: {selected?.deptName || '-'}</span></div> })()}
            </div>
            <div className="modal-actions">
              <button className="button button--neutral" type="button" onClick={() => setIsParticipantModalOpen(false)}>취소</button>
              <button className="button button--primary" type="button" onClick={() => { if (addParticipant()) setIsParticipantModalOpen(false) }}>추가</button>
            </div>
          </section>
        </div>
      )}
      {message && <p className="notice">{message}</p>}
    </main>
  )
}
