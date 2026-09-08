import type { WorkOrderResponse } from '../../entities/work-order/types'
import PrintApprovalSection from '../../shared/print/PrintApprovalSection'
import PrintAuditHeader from '../../shared/print/PrintAuditHeader'
import PrintCommonInfoTable from '../../shared/print/PrintCommonInfoTable'

type Props = {
  order: WorkOrderResponse
  companyName: string
  deptName: string
  userName: string
  siteName: string
  siteId: string
}

export default function WorkOrderPrintPage({ order, companyName, deptName, userName, siteName, siteId }: Props) {
  const plan = order.plan
  const result = order.result

  return (
    <section className="print-document">
      <PrintAuditHeader title="작업오더 보고서" companyName={companyName} deptName={deptName} userName={userName} siteName={siteName} siteId={siteId} />
      <PrintCommonInfoTable equipmentId={order.equipmentId} equipmentName={order.equipmentName} maker={order.maker} model={order.model} id={order.id} title={order.title} summary={plan.summary} />
      <table className="print-table print-table--fixed print-report-table print-phase-table">
        <tbody>
          <tr>
            <th>작업유형</th><td>{order.workType || '-'}</td>
            <th>우선순위</th><td>{order.priority || '-'}</td>
            <th>작업허가필요</th><td>{order.permitRequired ? 'Y' : 'N'}</td>
          </tr>
        </tbody>
      </table>
      <table className="print-table print-table--fixed print-report-table print-phase-table">
        <colgroup><col className="print-col--label" /><col /><col /><col /><col /></colgroup>
        <thead><tr><th>구분</th><th>작업자</th><th>작업일</th><th>시간(총 M/H) / 단위</th><th>비용</th></tr></thead>
        <tbody>
          <tr>
            <th>계획</th><td>{plan.workerName || '-'} ({plan.workerId || '-'})</td><td>{plan.workDate || '-'}</td>
            <td>{plan.manHours || '-'} / {plan.manHoursUnit || '-'}</td><td>{plan.cost || '-'}</td>
          </tr>
          <tr>
            <th rowSpan={2}>실적</th><td>{result?.workerName || '-'} ({result?.workerId || '-'})</td><td>{result?.workDate || '-'}</td>
            <td>{result?.manHours || '-'} / {result?.manHoursUnit || '-'}</td><td>{result?.cost || '-'}</td>
          </tr>
          <tr><td colSpan={4}>{result?.summary || '-'}</td></tr>
        </tbody>
      </table>
      <table className="print-table print-table--fixed print-item-table">
        <colgroup><col /><col /><col /></colgroup>
        <thead><tr><th>작업명</th><th>작업방법</th><th>결과</th></tr></thead>
        <tbody>
          {order.items.map((item, index) => (
            <tr key={item.id || index}><td>{item.workName || '-'}</td><td>{item.workMethod || '-'}</td><td>{item.result || '-'}</td></tr>
          ))}
        </tbody>
      </table>
      <PrintApprovalSection userName={userName} />
    </section>
  )
}
