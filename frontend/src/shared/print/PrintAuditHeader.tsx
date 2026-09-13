type PrintAuditHeaderProps = {
  title: string
  companyName: string
  deptName: string
  userName: string
  siteName: string
  siteId: string
}

export default function PrintAuditHeader({ title, companyName, deptName, userName }: PrintAuditHeaderProps) {
  const printedAt = new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date())

  return (
    <>
      <header className="print-document-header print-document-header--report">
        <div className="print-audit-info">
          <span>회사명: {companyName}</span>
          <span>부서명: {deptName}</span>
          <span>출력일시: {printedAt}</span>
          <span>출력자: {userName}</span>
        </div>
        <h1>{title}</h1>
      </header>
      <p className="print-site">
        신청인: {deptName} / - / {userName}
      </p>
    </>
  )
}
