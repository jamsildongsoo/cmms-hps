import { createHash, randomBytes, randomUUID } from 'node:crypto'
import { Injectable } from '@nestjs/common'
import { DataSource, EntityManager } from 'typeorm'
import type { ActorContext } from '../../../common/context/actor-context'
import { AppException } from '../../../common/exception/app.exception'
import { ERROR_CODE } from '../../../common/exception/error-code'
import { environment } from '../../../config/env'
import { AuthLoginHistoryEntity, AuthSessionEntity, UserAuthEntity } from '../entities/auth.entity'
import type { LoginDto, RefreshTokenDto } from '../dto/login.dto'
import { AuthRepository } from '../repositories/auth.repository'
import { AuthTokenService } from './auth-token.service'
import { PasswordService } from './password.service'

export type LoginResult = {
  accessToken: string
  refreshToken: string
  sessionId: string
  actor: ActorContext
  profile: {
    userName: string
    companyName: string
    siteName: string
    deptName: string
  }
}

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly authRepository: AuthRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: AuthTokenService,
  ) {}

  async login(dto: LoginDto, metadata: { ipAddress?: string; userAgent?: string } = {}): Promise<LoginResult> {
    if (!dto.companyId?.trim() || !dto.loginId?.trim() || !dto.password) {
      throw new AppException(ERROR_CODE.VALIDATION_FAILED, 400, '회사, 로그인 ID, 비밀번호를 입력해야 합니다.')
    }
    return this.dataSource.transaction(async (manager) => {
      const auth = await this.authRepository.findByLoginIdForUpdate(manager, dto.companyId, dto.loginId)

      if (!auth || !auth.active || auth.user.useYN !== 'Y' || auth.user.deleteYN === 'Y') {
        await this.recordLogin(manager, dto.companyId, null, dto.loginId, 'FAIL', 'INVALID_CREDENTIALS', metadata)
        throw new AppException(ERROR_CODE.AUTH_INVALID_CREDENTIALS, 401, '로그인 정보가 올바르지 않습니다.')
      }
      if (auth.lockedUntil && auth.lockedUntil > new Date()) {
        await this.recordLogin(manager, auth.companyId, auth.userId, auth.loginId, 'FAIL', 'ACCOUNT_LOCKED', metadata)
        throw new AppException(ERROR_CODE.AUTH_ACCOUNT_LOCKED, 423, '계정이 잠겨 있습니다.')
      }
      if (!await this.passwordService.verify(dto.password, auth.passwordHash)) {
        await this.registerFailure(manager, auth, metadata)
        throw new AppException(ERROR_CODE.AUTH_INVALID_CREDENTIALS, 401, '로그인 정보가 올바르지 않습니다.')
      }

      const now = new Date()
      auth.failedLoginCount = 0
      auth.lockedUntil = null
      auth.lastLoginAt = now
      auth.updatedAt = now
      auth.updatedBy = auth.userId
      await this.authRepository.saveAuthentication(manager, auth)

      const session = await this.createSession(manager, auth, metadata)
      await this.recordLogin(manager, auth.companyId, auth.userId, auth.loginId, 'SUCCESS', null, { ...metadata, sessionId: session.id })
      const actor = this.toActor(auth)
      return {
        accessToken: this.tokenService.issueAccessToken(actor.userId, actor.companyId, session.id),
        refreshToken: session.refreshToken,
        sessionId: session.id,
        actor,
        profile: this.toProfile(auth),
      }
    })
  }

  async refresh(dto: RefreshTokenDto): Promise<LoginResult> {
    if (!dto.sessionId?.trim() || !dto.refreshToken?.trim()) {
      throw new AppException(ERROR_CODE.VALIDATION_FAILED, 400, 'sessionId와 refreshToken이 필요합니다.')
    }
    return this.dataSource.transaction(async (manager) => {
      const session = await this.authRepository.findSessionForUpdate(manager, dto.sessionId)
      if (!session || session.revokedAt || session.expiresAt <= new Date() || session.refreshTokenHash !== this.hashToken(dto.refreshToken)) {
        throw new AppException(ERROR_CODE.AUTH_UNAUTHORIZED, 401, 'refresh token이 올바르지 않거나 만료되었습니다.')
      }

      const auth = await this.findActiveAuth(manager, session.companyId, session.userId)
      const refreshToken = this.createRefreshToken()
      session.refreshTokenHash = this.hashToken(refreshToken)
      session.lastUsedAt = new Date()
      await this.authRepository.saveSession(manager, session)
      const actor = this.toActor(auth)
      return { accessToken: this.tokenService.issueAccessToken(actor.userId, actor.companyId, session.id), refreshToken, sessionId: session.id, actor, profile: this.toProfile(auth) }
    })
  }

  async actorFromAccessToken(token: string): Promise<ActorContext> {
    const claims = this.tokenService.verifyAccessToken(token)
    return this.dataSource.transaction(async (manager) => {
      const session = await this.authRepository.findSession(manager, claims.sessionId)
      if (!session || session.companyId !== claims.companyId || session.userId !== claims.sub || session.revokedAt || session.expiresAt <= new Date()) {
        throw new AppException(ERROR_CODE.AUTH_UNAUTHORIZED, 401, '세션이 만료되었거나 취소되었습니다.')
      }
      return this.toActor(await this.findActiveAuth(manager, claims.companyId, claims.sub))
    })
  }

  private async findActiveAuth(manager: EntityManager, companyId: string, userId: string): Promise<UserAuthEntity> {
    const auth = await this.authRepository.findByUserId(manager, companyId, userId)
    if (!auth || !auth.active || (auth.lockedUntil && auth.lockedUntil > new Date()) || auth.user.useYN !== 'Y' || auth.user.deleteYN === 'Y') {
      throw new AppException(ERROR_CODE.AUTH_UNAUTHORIZED, 401, '사용할 수 없는 계정입니다.')
    }
    return auth
  }

  private toActor(auth: UserAuthEntity): ActorContext {
    return {
      userId: auth.userId,
      companyId: auth.companyId,
      siteId: auth.user.dept.siteId,
      deptId: auth.user.deptId,
      roleId: auth.user.roleId,
      permissions: auth.user.permissions,
      scopeLevel: auth.user.scopeLevel,
    }
  }

  private toProfile(auth: UserAuthEntity): LoginResult['profile'] {
    return {
      userName: auth.user.name,
      companyName: auth.user.dept.site.company.name,
      siteName: auth.user.dept.site.name,
      deptName: auth.user.dept.name,
    }
  }

  private async registerFailure(manager: EntityManager, auth: UserAuthEntity, metadata: { ipAddress?: string; userAgent?: string }): Promise<void> {
    const config = environment.auth()
    auth.failedLoginCount += 1
    auth.lockedUntil = auth.failedLoginCount >= config.failedLoginLimit
      ? new Date(Date.now() + config.lockMinutes * 60_000)
      : null
    auth.updatedAt = new Date()
    auth.updatedBy = auth.userId
    await this.authRepository.saveAuthentication(manager, auth)
    await this.recordLogin(manager, auth.companyId, auth.userId, auth.loginId, 'FAIL', 'INVALID_CREDENTIALS', metadata)
  }

  private async createSession(manager: EntityManager, auth: UserAuthEntity, metadata: { ipAddress?: string; userAgent?: string }): Promise<AuthSessionEntity & { refreshToken: string }> {
    const now = new Date()
    const refreshToken = this.createRefreshToken()
    const session = manager.create(AuthSessionEntity, {
      id: randomUUID(), companyId: auth.companyId, userId: auth.userId,
      refreshTokenHash: this.hashToken(refreshToken), issuedAt: now,
      expiresAt: new Date(now.getTime() + environment.auth().refreshTokenTtlSeconds * 1_000),
      lastUsedAt: now, revokedAt: null, ipAddress: metadata.ipAddress ?? null, userAgent: metadata.userAgent ?? null,
      createdAt: now, createdBy: auth.userId,
    })
    await this.authRepository.saveSession(manager, session)
    return Object.assign(session, { refreshToken })
  }

  private async recordLogin(manager: EntityManager, companyId: string, userId: string | null, loginId: string, result: string, failureReason: string | null, metadata: { ipAddress?: string; userAgent?: string; sessionId?: string }): Promise<void> {
    const now = new Date()
    await this.authRepository.saveLoginHistory(manager, manager.create(AuthLoginHistoryEntity, {
      id: randomUUID(), companyId, userId, loginId, result, failureReason, occurredAt: now,
      ipAddress: metadata.ipAddress ?? null, userAgent: metadata.userAgent ?? null, sessionId: metadata.sessionId ?? null,
      createdAt: now, createdBy: userId ?? 'system',
    }))
  }

  private createRefreshToken(): string { return randomBytes(48).toString('base64url') }
  private hashToken(token: string): string { return createHash('sha256').update(token).digest('base64url') }
}
