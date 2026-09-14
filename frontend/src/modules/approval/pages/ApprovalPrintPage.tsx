import { APPROVAL_PARTICIPANT_TYPE_LABELS } from '../types/constants'
import type { ApprovalParticipant } from '../types/types'

type Props = { title: string; content: string; requesterName: string; participants: Array<Pick<ApprovalParticipant, 'userName' | 'deptName' | 'title' | 'type'>> }

export default function ApprovalPrintPage({ title, content, requesterName, participants }: Props) {
  return <section className="print-document"><header className="print-document-header print-document-header--report"><h1>{title || '결재문'}</h1><p className="print-document-date">기안자: {requesterName}</p></header><section className="print-section"><h2>본문</h2><div className="print-summary print-rich-content" dangerouslySetInnerHTML={{ __html: content || '<p>-</p>' }} /></section><section className="print-section"><h2>결재선</h2><table className="print-table"><thead><tr><th>순번</th><th>구분</th><th>사용자</th><th>부서</th><th>직책</th></tr></thead><tbody><tr><td>0</td><td>기안</td><td>{requesterName}</td><td>-</td><td>-</td></tr>{participants.map((item, index) => <tr key={`${item.userName}-${index}`}><td>{index + 1}</td><td>{APPROVAL_PARTICIPANT_TYPE_LABELS[item.type]}</td><td>{item.userName || '-'}</td><td>{item.deptName || '-'}</td><td>{item.title || '-'}</td></tr>)}</tbody></table></section></section>
}
