import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import type { AuthenticatedRequest } from '../../../common/context/actor-context'
import { AppException } from '../../../common/exception/app.exception'
import { ERROR_CODE } from '../../../common/exception/error-code'
import { AuthService } from '../services/auth.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
    const authorization = request.headers.authorization
    const value = Array.isArray(authorization) ? authorization[0] : authorization
    const token = value?.startsWith('Bearer ') ? value.slice('Bearer '.length).trim() : ''
    if (!token) throw new AppException(ERROR_CODE.AUTH_UNAUTHORIZED, 401, 'Bearer token이 필요합니다.')
    request.user = await this.authService.actorFromAccessToken(token)
    return true
  }
}
