import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import type { ActorContext, AuthenticatedRequest } from './actor-context'
import { AppException } from '../exception/app.exception'
import { ERROR_CODE } from '../exception/error-code'

export const CurrentActor = createParamDecorator(
  (_data: unknown, context: ExecutionContext): ActorContext => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
    if (!request.user) throw new AppException(ERROR_CODE.AUTH_UNAUTHORIZED, 401, '인증된 요청 주체가 없습니다.')
    return request.user
  },
)
