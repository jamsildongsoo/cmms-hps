import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable, map } from 'rxjs'
import { COMMAND_RESPONSE_METADATA } from './command-response.decorator'
import type { CommandResponseOptions } from './command-response.decorator'

export type CommandResponseBody<T> = {
  success: true
  data: T
  message?: string
}

/** @CommandResponse가 선언된 handler만 공통 성공 응답으로 감쌉니다. */
@Injectable()
export class CommandResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const options = this.reflector.getAllAndOverride<CommandResponseOptions>(COMMAND_RESPONSE_METADATA, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!options) return next.handle()

    return next.handle().pipe(map((data): CommandResponseBody<unknown> => ({
      success: true,
      data,
      ...(options.message ? { message: options.message } : {}),
    })))
  }
}
