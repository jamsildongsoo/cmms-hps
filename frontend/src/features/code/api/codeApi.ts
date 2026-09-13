import type { Code, CodeItem } from '../../../entities/code/types'
import { query } from '../../../shared/api/http'

export function getCodes(): Promise<Code[]> {
  return query<Code[]>('/api/codes')
}

export function getCodeItems(codeId: string): Promise<CodeItem[]> {
  return query<CodeItem[]>(`/api/codes/${encodeURIComponent(codeId)}/items`)
}
