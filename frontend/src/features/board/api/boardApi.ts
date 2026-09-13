import type { BoardPost, BoardPostCreateRequest } from '../../../entities/board/types'
import { command, query } from '../../../shared/api/http'

export async function getBoardPosts(): Promise<BoardPost[]> {
  return query<BoardPost[]>('/api/boards/free/posts')
}

export async function createBoardPost(request: BoardPostCreateRequest): Promise<BoardPost> {
  return command<BoardPost>('/api/boards/free/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request) })
}
