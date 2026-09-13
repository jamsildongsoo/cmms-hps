import { type ChangeEvent, type MouseEvent, useEffect, useRef } from 'react'

type Props = { value: string; onChange: (value: string) => void }

const tableHtml = '<table><tbody><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></tbody></table><p><br></p>'

export default function RichTextEditor({ value, onChange }: Props) {
  const editorRef = useRef<HTMLDivElement>(null)
  const savedRangeRef = useRef<Range | null>(null)

  useEffect(() => {
    if (editorRef.current && document.activeElement !== editorRef.current && editorRef.current.innerHTML !== value) editorRef.current.innerHTML = value
  }, [value])

  const saveSelection = () => {
    const editor = editorRef.current
    const selection = window.getSelection()
    if (!editor || !selection?.rangeCount) return
    const range = selection.getRangeAt(0)
    if (editor.contains(range.commonAncestorContainer)) savedRangeRef.current = range.cloneRange()
  }

  const restoreSelection = () => {
    const editor = editorRef.current
    const selection = window.getSelection()
    if (!editor || !selection || !savedRangeRef.current) return
    editor.focus()
    selection.removeAllRanges()
    selection.addRange(savedRangeRef.current)
  }

  const execute = (command: string, commandValue?: string) => {
    restoreSelection()
    document.execCommand(command, false, commandValue)
    saveSelection()
    onChange(editorRef.current?.innerHTML ?? '')
  }

  const handleInput = () => {
    const editor = editorRef.current
    if (!editor) return
    onChange(editor.textContent?.trim() ? editor.innerHTML : '')
  }

  const handleFontSize = (event: ChangeEvent<HTMLSelectElement>) => {
    const editor = editorRef.current
    if (!editor) return
    restoreSelection()
    const selection = window.getSelection()
    if (!selection?.rangeCount) return
    const range = selection.getRangeAt(0)
    const span = document.createElement('span')
    span.style.fontSize = event.target.value
    span.appendChild(range.extractContents())
    range.insertNode(span)
    selection.removeAllRanges()
    const nextRange = document.createRange()
    nextRange.selectNodeContents(span)
    nextRange.collapse(false)
    selection.addRange(nextRange)
    saveSelection()
    onChange(editor.innerHTML)
  }
  const handleColor = (event: ChangeEvent<HTMLSelectElement>) => execute('foreColor', event.target.value)
  const handleFont = (event: ChangeEvent<HTMLSelectElement>) => execute('fontName', event.target.value)

  const insertTable = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    execute('insertHTML', tableHtml)
  }

  const mergeCells = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const selection = window.getSelection()
    const editor = editorRef.current
    if (!selection?.rangeCount || !editor) return
    const range = selection.getRangeAt(0)
    const cells = Array.from(editor.querySelectorAll<HTMLTableCellElement>('td, th')).filter((cell) => {
      try { return range.intersectsNode(cell) } catch { return false }
    })
    if (cells.length !== 2) return
    const [first, second] = cells
    const sameRow = first.parentElement === second.parentElement
    const firstColumn = first.parentElement ? Array.from(first.parentElement.children).indexOf(first) : -1
    const secondColumn = second.parentElement ? Array.from(second.parentElement.children).indexOf(second) : -1
    const sameColumn = firstColumn === secondColumn
    if (!sameRow && !sameColumn) return
    first.innerHTML = [first.innerHTML, second.innerHTML].filter(Boolean).join('<br>')
    if (sameRow) first.colSpan = (first.colSpan || 1) + (second.colSpan || 1)
    else first.rowSpan = (first.rowSpan || 1) + (second.rowSpan || 1)
    second.remove()
    onChange(editor.innerHTML)
  }

  return <div className="rich-editor"><div className="rich-editor-toolbar" role="toolbar" aria-label="본문 서식"><select aria-label="글꼴 크기" defaultValue="14px" onMouseDown={saveSelection} onChange={handleFontSize}><option value="12px">12px</option><option value="14px">14px</option><option value="16px">16px</option><option value="18px">18px</option><option value="22px">22px</option></select><select aria-label="글꼴" defaultValue="Arial" onMouseDown={saveSelection} onChange={handleFont}><option value="Arial">Arial</option><option value="Malgun Gothic">맑은 고딕</option><option value="Georgia">Georgia</option><option value="Courier New">Courier New</option></select><select aria-label="글자색" defaultValue="#172033" onMouseDown={saveSelection} onChange={handleColor}><option value="#172033">기본색</option><option value="#2563eb">파랑</option><option value="#dc2626">빨강</option><option value="#16a34a">초록</option></select><button type="button" onMouseDown={(event) => { event.preventDefault(); execute('bold') }}>굵게</button><button type="button" onMouseDown={(event) => { event.preventDefault(); execute('italic') }}>기울임</button><button type="button" onMouseDown={(event) => { event.preventDefault(); execute('insertOrderedList') }}>번호</button><button type="button" onMouseDown={(event) => { event.preventDefault(); execute('insertUnorderedList') }}>글머리기호</button><button type="button" onMouseDown={insertTable}>표 삽입</button><button type="button" onMouseDown={mergeCells}>셀 병합</button></div><div ref={editorRef} className="rich-editor-content" contentEditable suppressContentEditableWarning role="textbox" aria-label="결재문 본문" onInput={handleInput} onSelect={saveSelection} onMouseUp={saveSelection} onKeyUp={saveSelection} onBlur={saveSelection} /></div>
}
