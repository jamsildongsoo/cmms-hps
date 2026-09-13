import { SetMetadata } from '@nestjs/common'

export type PermissionAction = 'C' | 'R' | 'U' | 'D'
export type RequiredPermission = {
  module: string
  action: PermissionAction
}

export const REQUIRED_PERMISSION = 'required-permission'

export const RequirePermission = (module: string, action: PermissionAction) =>
  SetMetadata(REQUIRED_PERMISSION, { module, action } satisfies RequiredPermission)
