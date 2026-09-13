export type ApprovalBodyField = {
  label: string
  value: string | number | null | undefined
}

/** 업무 모듈이 결재 본문을 동일한 HTML 구조로 생성할 때 사용하는 공통 함수입니다. */
export function buildApprovalBody(fields: ApprovalBodyField[], summary?: string): string {
  const rows = fields.map((field) => `<tr><th>${escapeHtml(field.label)}</th><td>${escapeHtml(String(field.value ?? '-'))}</td></tr>`).join('')
  return `<table class="approval-body-table"><tbody>${rows}</tbody></table>${summary ? `<p>${escapeHtml(summary)}</p>` : ''}`
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] ?? character)
}
