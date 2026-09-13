type Props = { companyName: string; deptName: string; userName: string; siteName: string; siteId: string }

export default function WorkOrderListPrintPage({ companyName, deptName, userName, siteName, siteId }: Props) {
  const printedAt = new Intl.DateTimeFormat('ko-KR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date())
  return (
    <section className="print-document print-document--landscape">
      <header className="print-document-header print-document-header--list">
        <div className="print-audit-info">
          <span>회사명: {companyName}</span>
          <span>부서명: {deptName}</span>
          <span>출력일시: {printedAt}</span>
          <span>출력자: {userName}</span>
        </div>
        <h1>작업오더 목록</h1>
      </header>
      <p className="print-site">사업장: {siteName} ({siteId})</p>
      <table className="print-table">
        <thead>
          <tr>
            <th>번호</th><th>설비코드</th><th>설비명</th><th>작업명</th>
            <th>작업유형</th><th>계획일</th><th>실적일</th><th>작업자</th>
            <th>우선순위</th><th>계획상태</th><th>실적상태</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>WO-2026-0001</td><td>EQ-1001</td><td>냉각수 펌프</td><td>펌프 정기점검</td>
            <td>예방정비</td><td>2026-09-05</td><td>-</td><td>홍길동</td>
            <td>보통</td><td>승인</td><td>미착수</td>
          </tr>
        </tbody>
      </table>
      <footer className="print-page-footer">페이지 1 / 전체</footer>
    </section>
  )
}
