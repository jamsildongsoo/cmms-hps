export type Code = {
  id: string
  companyId: string
  name: string
  system: boolean
  active: boolean
  deleteYN: string
}

export type CodeItem = {
  id: string
  companyId: string
  codeId: string
  label: string
  sortOrder: number
  active: boolean
}
