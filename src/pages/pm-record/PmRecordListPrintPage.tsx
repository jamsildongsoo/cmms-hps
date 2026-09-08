type PmRecordListPrintPageProps = {
  companyName: string
  deptName: string
  userName: string
  siteName: string
  siteId: string
}

export default function PmRecordListPrintPage({ companyName, deptName, userName, siteName, siteId }: PmRecordListPrintPageProps) {
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
        <h1>예방점검 목록</h1>
      </header>
      <p className="print-site">사업장: {siteName} ({siteId})</p>
      <table className="print-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>설비코드</th>
            <th>설비명</th>
            <th>점검명</th>
            <th>점검유형</th>
            <th>점검일</th>
            <th>작업자</th>
            <th>결과(개요)</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          <tr><td colSpan={9} className="print-table-empty">등록된 예방점검 기록이 없습니다.</td></tr>
        </tbody>
      </table>
      <footer className="print-page-footer">페이지 1 / 전체</footer>
    </section>
  )
}
