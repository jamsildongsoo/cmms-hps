export type CreateCodeDto = {
  id: string
  name: string
}

export type UpdateCodeDto = {
  name?: string
  active?: boolean
}

export type CreateCodeItemDto = {
  id: string
  label: string
  sortOrder?: number
}

export type UpdateCodeItemDto = {
  label?: string
  sortOrder?: number
  active?: boolean
}
