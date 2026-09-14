import type { BoardPost } from '../types/types'

type Props = { posts: BoardPost[] }

export default function FreeBoardPrintPage({ posts }: Props) {
  return <section className="print-document print-document--landscape"><header className="print-document-header print-document-header--list"><h1>자유게시판</h1><p className="print-document-date">출력일시: {new Date().toLocaleString('ko-KR')}</p></header><table className="print-table"><thead><tr><th>번호</th><th>제목</th><th>작성자</th><th>작성일</th><th>조회</th></tr></thead><tbody>{posts.map((post) => <tr key={post.id}><td>{post.id}</td><td>{post.title}</td><td>{post.authorName}</td><td>{post.createdAt}</td><td>{post.viewCount}</td></tr>)}</tbody></table></section>
}
