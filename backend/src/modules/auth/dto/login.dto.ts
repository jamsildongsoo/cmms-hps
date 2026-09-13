export type LoginDto = {
  companyId: string
  loginId: string
  password: string
}

export type RefreshTokenDto = {
  sessionId: string
  refreshToken: string
}
