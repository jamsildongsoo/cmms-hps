import type { WorkPermit } from '../../entities/work-permit/types'
import { generalRiskTemplate } from '../../entities/work-permit/templates/general-risk'

type Props = { permit: WorkPermit; companyName: string; deptName: string; userName: string; siteName: string; siteId: string }
export default function WorkPermitPrintPage({ permit, companyName, deptName, userName }: Props) {
  const formatDateTime = (value: string) => value ? value.replace('T', ' ') : '-'
  const printedAt = new Intl.DateTimeFormat('ko-KR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date())
  const selectedRequirements = new Map(permit.safetyActionRequirements.map((item) => [item.label, item.checked]))
  const safetyRequirements = generalRiskTemplate.items.map((item) => ({
    ...item,
    checked: selectedRequirements.get(item.label) ?? false,
  }))

  return (
    <section className="print-document">
      <header className="print-document-header print-document-header--report">
        <div className="print-audit-info">
          <span>회사명: {companyName}</span>
          <span>부서명: {deptName}</span>
          <span>출력일시: {printedAt}</span>
          <span>출력자: {userName}</span>
        </div>
        <h1>일반위험작업 허가서</h1>
      </header>
      <p className="print-site">신청인: {deptName} / - / {userName}</p>
      <table className="print-table print-report-table print-permit-header-table">
        <colgroup><col className="print-col--label" /><col className="print-col--value" /><col className="print-col--label" /><col className="print-col--value" /></colgroup>
        <tbody>
          <tr><th>번호</th><td>{permit.id || '-'}</td><th>허가날짜</th><td>{permit.permitFrom ? permit.permitFrom.slice(0, 10) : '-'}</td></tr>
          <tr><th>제목</th><td>{permit.permitName || '-'}</td><th>허가기간</th><td>{formatDateTime(permit.permitFrom)} ~ {formatDateTime(permit.permitTo)}</td></tr>
          <tr><th>개요</th><td>{permit.workSummary || '-'}</td><th>작업지역</th><td>{permit.workPlace || '-'}</td></tr>
          <tr><th>설비명</th><td>{permit.equipmentName || '-'}</td><th>설비번호</th><td>{permit.equipmentId || '-'}</td></tr>
          <tr className="print-tall-row"><th>특별요구사항</th><td>{permit.specialRequirements || '-'}</td><th>안전검토 의견</th><td>{permit.safetyReviewOpinion || '-'}</td></tr>
          <tr>
            <th rowSpan={2}>가스검침</th>
            <td><div className="cell-grid cell-grid--3"><span>가스명</span><span>결과(%)</span><span>시간</span></div></td>
            <th className="text-xs font-normal">점검기기</th>
            <td rowSpan={2}><div className="grid grid-cols-[1fr_auto] gap-y-6 whitespace-nowrap"><span>측정자:</span><span>(서명)</span><span>확인자:</span><span>(서명)</span></div></td>
          </tr>
          <tr><td><div className="cell-grid cell-grid--3"><span>NG가스LEL</span><span>{permit.gasInspections[0]?.result || '-'}</span><span>{formatDateTime(permit.gasInspections[0]?.checkedAt || '')}</span></div></td><td className="text-xs">{permit.gasMeter || '-'}</td></tr>
        </tbody>
      </table>
      <div className="print-supplement-line">
        <span>보충작업허가서:</span>
        {[
          ['highPlace', '고소작업'],
          ['electrical', '전기작업'],
          ['hotWork', '화기작업'],
          ['confinedSpace', '밀폐공간 작업'],
          ['heavyEquipment', '중장비 작업'],
        ].map(([type, label]) => (
          <span key={type}>{permit.permitRequired.includes(type as WorkPermit['permitRequired'][number]) ? '■' : '□'} {label}</span>
        ))}
      </div>
      <h2 className="print-section-title">안전조치 요구사항</h2>
      <table className="print-check-table"><tbody>{Array.from({ length: 8 }, (_, rowIndex) => <tr key={rowIndex}>{safetyRequirements.slice(rowIndex * 2, rowIndex * 2 + 2).map((item) => <td key={item.id}><div className="print-check-cell"><span className="print-check-box">{item.checked ? '■' : '□'}</span><span className="print-check-box">□</span><span className="print-check-label">{item.label}</span></div></td>)}</tr>)}</tbody></table>
      <table className="print-table print-table--fixed print-permit-footer print-phase-table">
        <tbody>
          <tr><th>안전조치 확인</th><th>작업완료 확인</th></tr>
          <tr><td>확인시간:</td><td>확인시간:</td></tr>
          <tr><td><div className="print-signature-line"><span>입회자:</span><span>(서명)</span></div></td><td><div className="print-signature-line"><span>입회자:</span><span>(서명)</span></div></td></tr>
          <tr><td><div className="print-signature-line"><span>작업자:</span><span>(서명)</span></div></td><td><div className="print-signature-line"><span>작업자:</span><span>(서명)</span></div></td></tr>
          <tr><td colSpan={2}>조치사항:</td></tr>
          <tr><td colSpan={2}>작업허가 연장:　　　　　　　　　　　　　　　　　　　　　　　　　(서명)</td></tr>
        </tbody>
      </table>
    </section>
  )
}
