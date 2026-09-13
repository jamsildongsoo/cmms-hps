import { useRef } from 'react'
import { downloadAttachment } from './attachmentApi'
import { useAttachments } from './useAttachments'

type AttachmentPanelProps = {
  module: string
  recordId?: string | null
  siteId?: string | null
  readOnly?: boolean
  multiple?: boolean
}

export default function AttachmentPanel({ module, recordId, siteId, readOnly = false, multiple = true }: AttachmentPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { items, isLoading, upload, remove } = useAttachments(module, recordId, siteId)

  const onFilesSelected = async (files: FileList | null) => {
    if (!files) return
    for (const file of Array.from(files)) await upload(file)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <section className="card attachment-panel">
      <div className="section-header">
        <h2 className="card-title">첨부파일</h2>
        {!readOnly && <button className="button button--neutral" type="button" onClick={() => inputRef.current?.click()} disabled={isLoading}>파일 추가</button>}
        <input ref={inputRef} type="file" multiple={multiple} hidden onChange={(event) => { void onFilesSelected(event.target.files) }} />
      </div>
      {items.length === 0 ? <p className="empty-state">첨부파일이 없습니다.</p> : (
        <ul className="attachment-line">
          {items.map((item) => (
            <li className="attachment-line-item" key={item.itemNo}>
              <button className="action-link" type="button" onClick={() => { void downloadAttachment(item.attachmentId, item.itemNo, item.fileName) }}>{item.fileName}</button>
              <small>{formatFileSize(item.fileSize)}</small>
              {!readOnly && <button className="button button--danger attachment-delete" type="button" onClick={() => { void remove(item.itemNo) }}>삭제</button>}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function formatFileSize(size: number): string {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}
