import { createHmac, timingSafeEqual } from 'node:crypto'
import { Injectable } from '@nestjs/common'
import { environment } from '../../../config/env'
import { AppException } from '../../../common/exception/app.exception'
import { ERROR_CODE } from '../../../common/exception/error-code'

type AccessTokenPayload = {
  sub: string
  companyId: string
  sessionId: string
  iat: number
  exp: number
}

@Injectable()
export class AuthTokenService {
  issueAccessToken(userId: string, companyId: string, sessionId: string): string {
    const now = Math.floor(Date.now() / 1000)
    const { accessTokenTtlSeconds } = environment.auth()
    return this.sign({ sub: userId, companyId, sessionId, iat: now, exp: now + accessTokenTtlSeconds })
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    const [encodedHeader, encodedPayload, signature] = token.split('.')
    if (!encodedHeader || !encodedPayload || !signature) this.unauthorized()
    const expected = this.signPart(`${encodedHeader}.${encodedPayload}`)
    const actualBytes = Buffer.from(signature, 'base64url')
    const expectedBytes = Buffer.from(expected, 'base64url')
    if (actualBytes.length !== expectedBytes.length || !timingSafeEqual(actualBytes, expectedBytes)) this.unauthorized()

    try {
      const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as AccessTokenPayload
      if (!payload.sub || !payload.companyId || !payload.sessionId || payload.exp <= Math.floor(Date.now() / 1000)) this.unauthorized()
      return payload
    } catch {
      this.unauthorized()
    }
  }

  private sign(payload: AccessTokenPayload): string {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
    return `${header}.${body}.${this.signPart(`${header}.${body}`)}`
  }

  private signPart(value: string): string {
    return createHmac('sha256', environment.auth().jwtSecret).update(value).digest('base64url')
  }

  private unauthorized(): never {
    throw new AppException(ERROR_CODE.AUTH_UNAUTHORIZED, 401, '인증 정보가 올바르지 않거나 만료되었습니다.')
  }
}
