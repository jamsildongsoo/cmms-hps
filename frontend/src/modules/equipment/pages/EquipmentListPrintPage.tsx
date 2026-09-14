type EquipmentListPrintPageProps = {
  companyName: string
  deptName: string
  userName: string
  siteName: string
  siteId: string
}

export default function EquipmentListPrintPage({
  companyName,
  deptName,
  userName,
  siteName,
  siteId,
}: EquipmentListPrintPageProps) {
  const printedAt = new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date())

  return (
    <section className="print-document print-document--landscape">
      <header className="print-document-header print-document-header--list">
        <div className="print-audit-info">
          <span>회사명: {companyName}</span>
          <span>부서명: {deptName}</span>
          <span>출력일시: {printedAt}</span>
          <span>출력자: {userName}</span>
        </div>
        <h1>설비 목록</h1>
      </header>
      <p className="print-site">사업장: {siteName} ({siteId})</p>
      <table className="print-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>설비명</th>
            <th>설치위치</th>
            <th>설비유형</th>
            <th>설치일</th>
            <th>허가</th>
            <th>제조사</th>
            <th>모델</th>
            <th>설비상태</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>EQ-1001</td>
            <td>냉각수 펌프</td>
            <td>생산동 1층</td>
            <td>펌프</td>
            <td>2026-09-01</td>
            <td>N</td>
            <td>ABC</td>
            <td>CP-100</td>
            <td>사용중</td>
          </tr>
        </tbody>
      </table>
      <footer className="print-page-footer">페이지 1 / 전체</footer>
    </section>
  )
}
