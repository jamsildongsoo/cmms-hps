import type { PmRecordResponse } from '../../entities/pm-record/types'
import PrintApprovalSection from '../../shared/print/PrintApprovalSection'
import PrintAuditHeader from '../../shared/print/PrintAuditHeader'
import PrintCommonInfoTable from '../../shared/print/PrintCommonInfoTable'

type Props = {
  record: PmRecordResponse
  companyName: string
  deptName: string
  userName: string
  siteName: string
  siteId: string
}

export default function PmRecordPrintPage({ record, companyName, deptName, userName, siteName, siteId }: Props) {
  return (
    <section className="print-document">
      <PrintAuditHeader title="예방점검 보고서" companyName={companyName} deptName={deptName} userName={userName} siteName={siteName} siteId={siteId} />
      <PrintCommonInfoTable equipmentId={record.equipmentId} equipmentName={record.equipmentName} maker={record.maker} model={record.model} id={record.id} title={record.title} summary={record.summary} />
      <table className="print-table print-table--fixed print-report-table print-phase-table">
        <colgroup>
          <col className="print-col--label" />
          <col className="print-col--value" />
          <col className="print-col--label" />
          <col className="print-col--value" />
        </colgroup>
        <tbody>
          <tr>
            <th>작업유형</th><td>{record.workType || '-'}</td>
            <th>작업일</th><td>{record.workDate || '-'}</td>
          </tr>
          <tr>
            <th>작업자명</th><td>{record.workerName || '-'} ({record.workerId || '-'})</td>
            <th>결과</th><td>{record.result || '-'}</td>
          </tr>
        </tbody>
      </table>
      <table className="print-table print-item-table print-table--fixed">
        <colgroup>
          <col className="table-col--text" /><col className="table-col--text" />
          <col className="table-col--value" /><col className="table-col--value" /><col className="table-col--unit" />
        </colgroup>
        <thead><tr><th>점검명</th><th>점검방법</th><th>기준값</th><th>결과</th><th>단위</th></tr></thead>
        <tbody>
          {record.items.map((item, index) => (
            <tr key={`${item.inspectionName}-${index}`}>
              <td>{item.inspectionName || '-'}</td><td>{item.inspectionMethod || '-'}</td>
              <td>{item.standardValue || '-'}</td><td>{item.result || '-'}</td><td>{item.unit || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <PrintApprovalSection userName={userName} />
    </section>
  )
}
