import type { LoginInfo } from '../../entities/auth/types'
import type { PrintInfo } from './types'

export const toPrintInfo = (session: LoginInfo): PrintInfo => ({
  companyName: session.companyId,
  deptName: session.deptName,
  userName: session.userName,
  siteName: session.siteName,
  siteId: session.siteId,
})
