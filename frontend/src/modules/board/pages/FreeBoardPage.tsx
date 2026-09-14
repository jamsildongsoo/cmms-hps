import { useEffect, useState } from 'react'
import type { LoginInfo } from '../../auth/types/types'
import type { BoardPost } from '../types/types'
import { createBoardPost, getBoardPosts } from '../api/boardApi'
import FreeBoardPrintPage from './FreeBoardPrintPage'

type Props = { session: LoginInfo }

export default function FreeBoardPage({ session }: Props) {
  const [posts, setPosts] = useState<BoardPost[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [selected, setSelected] = useState<BoardPost | null>(null)
  const [keyword, setKeyword] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isPrinting, setIsPrinting] = useState(false)

  useEffect(() => { void getBoardPosts().then(setPosts) }, [])
  useEffect(() => {
    if (!isPrinting) return
    const finishPrint = () => setIsPrinting(false)
    window.addEventListener('afterprint', finishPrint)
    window.print()
    return () => window.removeEventListener('afterprint', finishPrint)
  }, [isPrinting])

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const created = await createBoardPost({ companyId: session.companyId, title, content, authorId: session.userId })
    setPosts((current) => [created, ...current]); setTitle(''); setContent(''); setIsAdding(false)
  }

  const filteredPosts = posts.filter((post) => !keyword || post.title.includes(keyword) || post.authorName.includes(keyword))

  return (
    <>
    {isPrinting && <FreeBoardPrintPage posts={filteredPosts} />}
    <main className="page page-screen">
      <header className="page-header"><div><p className="eyebrow">Free Board</p><h1>자유게시판</h1></div><div className="page-actions"><button className="button button--neutral button--form-action" type="button" onClick={() => setIsPrinting(true)} aria-label="인쇄" title="인쇄"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 9V4h12v5M6 18H4V10h16v8h-2M6 14h12v6H6v-6Z" /></svg>인쇄</button><button className="button button--primary button--form-action" type="button" onClick={() => setIsAdding((value) => !value)}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>{isAdding ? '닫기' : '신규'}</button></div></header>
      {isAdding && <form className="card filter-card" onSubmit={submit}><div className="form-grid form-grid--4"><label className="field field--span-4">제목<input required value={title} onChange={(event) => setTitle(event.target.value)} /></label><label className="field field--span-4">내용<textarea required rows={7} value={content} onChange={(event) => setContent(event.target.value)} /></label><div className="filter-actions"><button className="button button--primary" type="submit">저장</button></div></div></form>}
      <section className="card filter-card"><div className="form-grid form-grid--4"><label className="field field--span-3">검색어<input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="제목 또는 작성자" /></label><div className="filter-actions"><button className="button button--primary" type="button">조회</button></div></div></section>
      <section className="card table-card"><div className="section-header"><h2 className="card-title">게시글 목록</h2></div><div className="table-scroll"><table className="data-table"><thead><tr><th>번호</th><th>제목</th><th>작성자</th><th>작성일</th><th>조회</th></tr></thead><tbody>{filteredPosts.map((post) => <tr key={post.id}><td>{post.id}</td><td><button className="action-link" type="button" onClick={() => setSelected(post)}>{post.title}</button></td><td>{post.authorName}</td><td>{post.createdAt}</td><td>{post.viewCount}</td></tr>)}</tbody></table></div></section>
      {selected && <div className="modal-backdrop" role="presentation" onClick={() => setSelected(null)}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="board-post-title" onClick={(event) => event.stopPropagation()}><div className="modal-header"><div><p className="eyebrow">Free Board</p><h2 id="board-post-title">{selected.title}</h2></div><button className="button button--neutral" type="button" onClick={() => setSelected(null)}>닫기</button></div><dl className="approval-header-info"><div><dt>작성자</dt><dd>{selected.authorName}</dd></div><div><dt>작성일</dt><dd>{selected.createdAt}</dd></div><div><dt>조회</dt><dd>{selected.viewCount}</dd></div></dl><p className="board-content">{selected.content}</p></section></div>}
    </main>
    </>
  )
}
