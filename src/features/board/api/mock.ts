import type { BoardPost } from '../../../entities/board/types'

export const boardMockData: BoardPost[] = [
  { id: 'BOARD-0001', companyId: 'COMPANY-HPS', title: '9월 정기 점검 일정 안내', content: '9월 정기 점검 일정을 공유합니다.', authorId: 'USER-1002', authorName: '김경영', createdAt: '2026-09-01', viewCount: 12, deleteYN: 'N' },
  { id: 'BOARD-0002', companyId: 'COMPANY-HPS', title: '안전보호구 지급 안내', content: '안전보호구 지급 일정을 확인해 주세요.', authorId: 'USER-1004', authorName: '이기술', createdAt: '2026-09-04', viewCount: 8, deleteYN: 'N' },
]
