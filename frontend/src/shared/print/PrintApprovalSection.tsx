type PrintApprovalSectionProps = {
  userName: string
}

export default function PrintApprovalSection({ userName }: PrintApprovalSectionProps) {
  return (
    <section className="approval-section">
      <div className="approval-item">
        <h2>기안</h2>
        <div className="approval-values">
          <span>{userName || '-'} / -</span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className="approval-item">
        <h2>결재</h2>
        <div className="approval-values">
          <span>- / -</span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className="approval-item">
        <h2>합의</h2>
        <div className="approval-values">
          <span>- / 결재</span>
          <span></span>
          <span></span>
        </div>
      </div>
    </section>
  )
}
