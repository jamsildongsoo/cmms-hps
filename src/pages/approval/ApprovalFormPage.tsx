import { type ChangeEvent, useEffect, useRef, useState } from 'react'
import type { LoginInfo } from '../../entities/auth/types'
import type { ApprovalAttachment, ApprovalParticipant, ApprovalParticipantType, ApprovalResponse } from '../../entities/approval/types'
import { createApprovalDraft } from '../../features/approval/api/approvalApi'
import { getOrganization } from '../../features/organization/api/organizationApi'
import RichTextEditor from '../../shared/editor/RichTextEditor'
import ApprovalPrintPage from './ApprovalPrintPage'

type Props = { session: LoginInfo; onBack: () => void }

export default function ApprovalFormPage({ session, onBack }: Props) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [users, setUsers] = useState<Array<{ userId: string; userName: string; deptName: string; title: string }>>([])
  const [participants, setParticipants] = useState<Array<Pick<ApprovalParticipant, 'userId' | 'userName' | 'deptName' | 'title' | 'type'>>>([])
  const [participantType, setParticipantType] = useState<Exclude<ApprovalParticipantType, 'requester'>>('approval')
  const [participantUserId, setParticipantUserId] = useState('')
  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isPrinting, setIsPrinting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { void getOrganization().then((data) => setUsers(data.users.map((user) => ({ userId: user.id, userName: user.name, deptName: data.departments.find((department) => department.id === user.deptId)?.name ?? '', title: user.title || user.position })))) }, [])
  useEffect(() => { if (!isPrinting) return; const finishPrint = () => setIsPrinting(false); window.addEventListener('afterprint', finishPrint); window.print(); return () => window.removeEventListener('afterprint', finishPrint) }, [isPrinting])

  const addParticipant = () => {
    const selected = users.find((user) => user.userId === participantUserId)
    if (!selected || participants.some((item) => item.userId === selected.userId)) return false
    setParticipants((current) => [...current, { userId: selected.userId, userName: selected.userName, deptName: selected.deptName, title: selected.title, type: participantType }])
    setParticipantUserId('')
    return true
  }
  const removeFile = (index: number) => setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))
  const formatFileSize = (size: number) => size < 1024 * 1024 ? `${Math.ceil(size / 1024)} KB` : `${(size / 1024 / 1024).toFixed(1)} MB`
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? [])
    if (selectedFiles.length > 0) setFiles((current) => [...current, ...selectedFiles])
    event.currentTarget.value = ''
  }

  const save = async (status: ApprovalResponse['status']) => {
    if (!title.trim()) { setMessage('제목을 입력해 주세요.'); return }
    const id = `APR-2026-${Date.now().toString().slice(-4)}`
    const lines: ApprovalParticipant[] = [{ id: `${id}-0`, approvalId: id, sequenceNo: 0, userId: session.userId, userName: session.userName, deptName: session.deptName, title: '', type: 'requester', status: 'none' }, ...participants.map((item, index) => ({ ...item, id: `${id}-${index + 1}`, approvalId: id, sequenceNo: index + 1, status: 'pending' as const }))]
    const attachments: ApprovalAttachment[] = files.map((file, index) => ({ id: `${id}-att-${index}`, fileName: file.name, fileSize: file.size, contentType: file.type, uploadedAt: new Date().toISOString().slice(0, 10) }))
    /* 백엔드 연계 시 파일 본문은 별도 첨부 API로 업로드하고, 결재문에는 attachmentId만 저장합니다. */
    const draft: ApprovalResponse = { id, companyId: session.companyId, module: 'general', recordId: '', title, content, status, requesterId: session.userId, requesterName: session.userName, requesterDeptName: session.deptName, requesterTitle: '', requestedAt: status === 'draft' ? undefined : new Date().toISOString().slice(0, 10), currentStep: status === 'draft' ? 0 : 1, totalSteps: participants.filter((item) => item.type !== 'reference').length, participants: lines, attachments }
    await createApprovalDraft(draft)
    setMessage(status === 'draft' ? '임시저장되었습니다.' : '결재 상신되었습니다.')
    if (status !== 'draft') onBack()
  }

  return (
    <main className="page page-screen">
      {isPrinting && <ApprovalPrintPage title={title} content={content} requesterName={session.userName} participants={participants} />}
      <header className="page-header"><div><p className="eyebrow">Approval Document</p><h1>결재문 작성</h1></div><div className="page-actions"><button className="button button--neutral button--form-action" type="button" onClick={onBack}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>목록</button><button className="button button--neutral button--form-action" type="button" onClick={() => setIsPrinting(true)}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 9V4h12v5M6 18H4V10h16v8h-2M6 14h12v6H6v-6Z" /></svg>인쇄</button><button className="button button--neutral button--form-action" type="button" onClick={() => void save('draft')}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 4h12l2 2v14H5V4Zm3 0v6h6V4M8 16h8" /></svg>저장</button><button className="button button--primary button--form-action" type="button" onClick={() => void save('requested')}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6" /></svg>상신</button></div></header>
      <section className="card"><div className="form-grid form-grid--4"><label className="field field--span-4">제목<input required value={title} onChange={(event) => setTitle(event.target.value)} /></label><div className="field field--span-4 approval-line-field"><div className="attachment-header"><span>결재선</span><button className="action-link attachment-add" type="button" onClick={() => setIsParticipantModalOpen(true)}>+ 결재선 추가</button></div><div className="approval-line-box"><div className="approval-line-header"><span>유형</span><span>이름</span><span>직책</span><span>부서명</span><span>삭제</span></div><div className="approval-line approval-line--scroll"><div className="approval-line-item approval-line-item--edit"><div className="approval-type-cell"><span>기안</span></div><strong>{session.userName}</strong><span>-</span><span>{session.deptName}</span><span>-</span></div>{participants.map((item) => <div className="approval-line-item approval-line-item--edit" key={item.userId}><div className="approval-type-cell"><span>{item.type === 'approval' ? '결재' : item.type === 'agreement' ? '합의' : '참조'}</span></div><strong>{item.userName}</strong><span>{item.title || '-'}</span><span>{item.deptName || '-'}</span><button className="button button--danger" type="button" aria-label="결재선 삭제" onClick={() => setParticipants((current) => current.filter((line) => line.userId !== item.userId))}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 7h14M10 11v6m4-6v6M9 7V4h6v3m-8 0 1 13h8l1-13" /></svg></button></div>)}</div></div></div><div className="field field--span-4"><span>본문</span><RichTextEditor value={content} onChange={setContent} /></div><div className="field field--span-4"><div className="attachment-header"><span>첨부파일</span><input id="approval-file-input" ref={fileInputRef} className="visually-hidden" type="file" multiple onChange={handleFileChange} /><label className="action-link attachment-add" htmlFor="approval-file-input">+ 파일선택</label></div><div className="attachment-line">{files.map((file, index) => <div className="attachment-line-item" key={`${file.name}-${index}`}><span>{file.name}</span><small>{formatFileSize(file.size)}</small><button className="button button--danger attachment-delete" type="button" aria-label={`${file.name} 삭제`} onClick={() => removeFile(index)}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 7h14M10 11v6m4-6v6M9 7V4h6v3m-8 0 1 13h8l1-13" /></svg></button></div>)}</div></div></div></section>
      {isParticipantModalOpen && <div className="modal-backdrop" role="presentation" onClick={() => setIsParticipantModalOpen(false)}><section className="modal modal--small" role="dialog" aria-modal="true" aria-labelledby="participant-modal-title" onClick={(event) => event.stopPropagation()}><div className="modal-header"><div><p className="eyebrow">Approval Line</p><h2 id="participant-modal-title">결재선 추가</h2></div><button className="button button--neutral" type="button" onClick={() => setIsParticipantModalOpen(false)}>닫기</button></div><div className="form-grid form-grid--1"><label className="field">유형<select value={participantType} onChange={(event) => setParticipantType(event.target.value as Exclude<ApprovalParticipantType, 'requester'>)}><option value="approval">결재</option><option value="agreement">합의</option><option value="reference">참조</option></select></label><label className="field">사용자<select value={participantUserId} onChange={(event) => setParticipantUserId(event.target.value)}><option value="">사용자 선택</option>{users.map((user) => <option key={user.userId} value={user.userId}>{user.userName}</option>)}</select></label>{(() => { const selected = users.find((user) => user.userId === participantUserId); return <div className="approval-preview"><span>직책: {selected?.title || '-'}</span><span>부서: {selected?.deptName || '-'}</span></div> })()}</div><div className="modal-actions"><button className="button button--neutral" type="button" onClick={() => setIsParticipantModalOpen(false)}>취소</button><button className="button button--primary" type="button" onClick={() => { if (addParticipant()) setIsParticipantModalOpen(false) }}>추가</button></div></section></div>}
      {message && <p className="notice">{message}</p>}
    </main>
  )
}
