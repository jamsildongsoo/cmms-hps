export type BoardPost = {
  id: string
  companyId: string
  title: string
  content: string
  authorId: string
  authorName: string
  createdAt: string
  updatedAt?: string
  viewCount: number
  deleteYN: string
}

export type BoardPostCreateRequest = Omit<BoardPost, 'id' | 'authorName' | 'createdAt' | 'updatedAt' | 'viewCount' | 'deleteYN'>
