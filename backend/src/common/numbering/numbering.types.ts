import { MODULE_CODE } from '../../../../shared/domain-codes'

export type NumberingModule = keyof typeof MODULE_CODE

export type NextDocumentNumberRequest = {
  companyId: string
  module: NumberingModule
  /** 채번 기준 월: YYYYMM. 생략하면 서버 현재 시각의 월을 사용합니다. */
  yearMonth?: string
}
