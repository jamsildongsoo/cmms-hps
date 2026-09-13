type PrintCommonInfoTableProps = {
  equipmentId: string
  equipmentName: string
  maker?: string
  model?: string
  id: string
  title: string
  summary: string
}

export default function PrintCommonInfoTable({ equipmentId, equipmentName, maker = '', model = '', id, title, summary }: PrintCommonInfoTableProps) {
  return (
    <table className="print-table print-report-table">
      <colgroup>
        <col className="print-col--label" />
        <col className="print-col--value" />
        <col className="print-col--label" />
        <col className="print-col--value" />
      </colgroup>
      <tbody>
        <tr>
          <th>설비번호</th>
          <td>{equipmentId || '-'}</td>
          <th>번호</th>
          <td>{id || '-'}</td>
        </tr>
        <tr>
          <th>설비명</th>
          <td>{equipmentName || '-'}</td>
          <th>제목</th>
          <td>{title || '-'}</td>
        </tr>
        <tr>
          <th>제조사</th>
          <td>{maker || '-'}</td>
          <th rowSpan={2}>개요</th>
          <td rowSpan={2} className="print-summary">{summary || '-'}</td>
        </tr>
        <tr>
          <th>모델명</th>
          <td>{model || '-'}</td>
        </tr>
      </tbody>
    </table>
  )
}
