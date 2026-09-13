import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { AuthenticatedRequest } from '../context/actor-context'
import { AppException } from '../exception/app.exception'
import { ERROR_CODE } from '../exception/error-code'
import { REQUIRED_PERMISSION } from './permission.decorator'
import type { RequiredPermission } from './permission.decorator'

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<RequiredPermission>(REQUIRED_PERMISSION, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!required) return true

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
    const permission = `${required.module}:${required.action}`
    if (!request.user?.permissions.includes(permission)) {
      throw new AppException(ERROR_CODE.AUTH_FORBIDDEN, 403, '해당 작업을 수행할 권한이 없습니다.', { permission })
    }
    return true
  }
}
