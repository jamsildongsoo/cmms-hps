import RichTextEditor from '../../shared/editor/RichTextEditor'

type Props = { value: string; onChange: (value: string) => void; readOnly?: boolean }

/** 결재 작성과 상세 화면에서 공통으로 사용하는 본문 영역입니다. */
export default function ApprovalBodyEditor({ value, onChange, readOnly = false }: Props) {
  return <div className="field field--span-4"><span className="font-semibold text-slate-700 mb-1 block">본문</span>{readOnly ? <div className="prose border rounded-md p-3" dangerouslySetInnerHTML={{ __html: value || '<p>본문 내용이 없습니다.</p>' }} /> : <RichTextEditor value={value} onChange={onChange} />}</div>
}
