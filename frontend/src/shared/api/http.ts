import { toast } from '../toast/toast'
import { getAccessToken } from '../../features/login/auth-session'

export type CommandResponse<T> = {
  success: true
  data: T
  message?: string
}

export type ApiErrorResponse = {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
    traceId?: string
  }
}

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly details: unknown
  readonly traceId: string | undefined

  constructor(
    status: number,
    code: string,
    message: string,
    details?: unknown,
    traceId?: string,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
    this.traceId = traceId
  }
}

export type ApiRequestOptions = RequestInit & {
  /** 화면에서 필드 오류를 직접 표시할 때 false로 설정합니다. */
  notifyError?: boolean
}

/** 조회·명령 API가 공유하는 오류 해석과 요청 함수입니다. */
export async function request<T>(input: RequestInfo | URL, options: ApiRequestOptions = {}): Promise<T> {
  const { notifyError = true, ...init } = options
  try {
    const headers = new Headers(init.headers)
    const token = getAccessToken()
    if (token && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`)
    const response = await fetch(input, { credentials: 'include', ...init, headers })
    const body = await parseBody(response)
    if (!response.ok) throw toApiError(response.status, body)
    return body as T
  } catch (error) {
    if (notifyError && shouldNotify(error)) toast.error(toMessage(error))
    throw error
  }
}

/** 조회 API: 성공 toast 없이 데이터를 그대로 반환합니다. */
export const query = <T>(input: RequestInfo | URL, options?: ApiRequestOptions) => request<T>(input, options)

/** 상태 변경 API: 백엔드 CommandResponse를 해석하고 message가 있을 때만 성공 toast를 표시합니다. */
export async function command<T>(input: RequestInfo | URL, options?: ApiRequestOptions): Promise<T> {
  const response = await request<CommandResponse<T>>(input, options)
  if (response.message) toast.success(response.message)
  return response.data
}

async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) return response.json()
  return response.text()
}

function toApiError(status: number, body: unknown): ApiError {
  if (isApiErrorResponse(body)) {
    return new ApiError(status, body.error.code, body.error.message, body.error.details, body.error.traceId)
  }
  return new ApiError(status, 'HTTP_ERROR', `요청 처리 중 오류가 발생했습니다. (${status})`)
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return typeof value === 'object' && value !== null
    && 'success' in value && value.success === false
    && 'error' in value && typeof value.error === 'object' && value.error !== null
    && 'message' in value.error && typeof value.error.message === 'string'
    && 'code' in value.error && typeof value.error.code === 'string'
}

function shouldNotify(error: unknown): boolean {
  // 401은 refresh/login 이동 흐름에서 별도로 처리합니다.
  return !(error instanceof ApiError && error.status === 401)
}

function toMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message
  return '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
}
