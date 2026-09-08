import type { BoardPost, BoardPostCreateRequest } from '../../../entities/board/types'
import { boardMockData } from './mock'

const posts = [...boardMockData]

export async function getBoardPosts(): Promise<BoardPost[]> {
  /* 백엔드 연계 예시: GET /api/boards/free/posts */
  return [...posts]
}

export async function createBoardPost(request: BoardPostCreateRequest): Promise<BoardPost> {
  /* 백엔드 연계 시 로그인 세션의 사용자 정보는 서버에서 검증합니다. */
  const created: BoardPost = { ...request, id: `BOARD-${String(posts.length + 1).padStart(4, '0')}`, authorName: '로그인 사용자', createdAt: new Date().toISOString().slice(0, 10), viewCount: 0, deleteYN: 'N' }
  posts.push(created)
  return created
}
