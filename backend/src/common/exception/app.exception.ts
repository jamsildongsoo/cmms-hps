import { HttpException } from '@nestjs/common'
import type { HttpStatus } from '@nestjs/common'
import type { ErrorCode } from './error-code'

export class AppException extends HttpException {
  constructor(
    readonly code: ErrorCode,
    status: HttpStatus,
    message: string,
    readonly details?: Record<string, unknown>,
  ) {
    super({ code, message, details }, status)
  }
}
