let accessToken: string | null = null
let refreshToken: string | null = null
let sessionId: string | null = null

export function setAuthSession(next: { accessToken: string; refreshToken: string; sessionId: string }): void {
  accessToken = next.accessToken
  refreshToken = next.refreshToken
  sessionId = next.sessionId
}

export function getAccessToken(): string | null {
  return accessToken
}

export function getRefreshSession(): { refreshToken: string; sessionId: string } | null {
  return refreshToken && sessionId ? { refreshToken, sessionId } : null
}

export function clearAuthSession(): void {
  accessToken = null
  refreshToken = null
  sessionId = null
}
