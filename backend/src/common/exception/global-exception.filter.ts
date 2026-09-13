import { ArgumentsHost, Catch, HttpException, HttpStatus, Logger } from '@nestjs/common'
import type { ExceptionFilter } from '@nestjs/common'
import { QueryFailedError } from 'typeorm'
import { AppException } from './app.exception'
import { ERROR_CODE } from './error-code'

type PostgresError = { code?: string; detail?: string }

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<{ status: (code: number) => { json: (body: unknown) => void } }>()
    const request = host.switchToHttp().getRequest<{ requestId?: string; method?: string; url?: string }>()
    const traceId = request.requestId
    const result = this.toResponse(exception)

    if (result.status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error({ traceId, method: request.method, url: request.url, exception })
    }

    response.status(result.status).json({ success: false, error: { ...result.body, traceId } })
  }

  private toResponse(exception: unknown): { status: number; body: { code: string; message: string; details?: unknown } } {
    if (exception instanceof AppException) {
      return { status: exception.getStatus(), body: { code: exception.code, message: exception.message, details: exception.details } }
    }
    if (exception instanceof QueryFailedError) {
      const error = exception.driverError as PostgresError
      if (error.code === '23505') return { status: HttpStatus.CONFLICT, body: { code: ERROR_CODE.RESOURCE_CONFLICT, message: '이미 존재하는 데이터입니다.' } }
      if (error.code === '23503') return { status: HttpStatus.BAD_REQUEST, body: { code: ERROR_CODE.INVALID_REFERENCE, message: '참조 데이터가 올바르지 않습니다.' } }
    }
    if (exception instanceof HttpException) {
      const body = exception.getResponse()
      const message = typeof body === 'string' ? body : (body as { message?: string | string[] }).message
      return {
        status: exception.getStatus(),
        body: { code: ERROR_CODE.VALIDATION_FAILED, message: Array.isArray(message) ? message.join(', ') : message || '요청이 올바르지 않습니다.' },
      }
    }
    return { status: HttpStatus.INTERNAL_SERVER_ERROR, body: { code: ERROR_CODE.INTERNAL_ERROR, message: '서버 오류가 발생했습니다.' } }
  }
}
