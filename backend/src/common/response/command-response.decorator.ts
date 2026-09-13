import { SetMetadata } from '@nestjs/common'

export const COMMAND_RESPONSE_METADATA = 'command-response'

export type CommandResponseOptions = {
  /** UI에 표시할 수 있는 성공 메시지입니다. 필요하지 않으면 생략합니다. */
  message?: string
}

/**
 * 생성·수정·삭제·승인 등 상태 변경 API에만 붙입니다.
 * 조회와 인증 API는 이 decorator를 붙이지 않아 원래 응답 형식을 유지합니다.
 */
export const CommandResponse = (message?: string) =>
  SetMetadata(COMMAND_RESPONSE_METADATA, { message } satisfies CommandResponseOptions)
