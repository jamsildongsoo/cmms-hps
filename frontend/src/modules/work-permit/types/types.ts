import type { SupplementType } from '../../../../../shared/domain-codes'
export type { SupplementType, WorkMethod } from '../../../../../shared/domain-codes'

export type WorkPermit = {
  // PK id + companyId + siteId
  id: string
  companyId: string
  siteId: string

  deptId: string
  name: string
  equipmentId?: string
  equipmentName?: string
  workMethod?: string
  code: string
  type: string
  workerId: string
  supervisorId: string
  supervisorName?: string
  workPlace: string
  permitFrom: string // ISO 날짜시간 문자열
  permitTo: string
  summary: string
  safetyActionRequirements: SafetyActionItem[]
  specialRequirements: string
  safetyReviewOpinion: string
  gasInspections: GasInspection[]
  gasMeasurer: string
  gasConfirmer: string
  safetyCheckWitness: string
  safetyCheckWitnessName?: string
  safetyCheckWorker: string
  safetyCheckWorkerName?: string
  completionWitness: string
  completionWitnessName?: string
  completionWorker: string
  completionWorkerName?: string
  issuer: string
  approver: string
  issuerName?: string
  approverName?: string
  permitRequired: SupplementType[]
  supplementDetails: Partial<Record<SupplementType, string>>
  status: string
}

export type GasInspection = {
  gasName: string
  gasMeter: string
  result: string
  checkedAt: string
}

export type SafetyActionItem = {
  label: string
  checked: boolean
}

export type WorkPermitResponse = WorkPermit & {
  workerName: string
  supervisorName: string
  gasMeasurerName: string
  gasConfirmerName: string
  safetyCheckWitnessName?: string
  safetyCheckWorkerName: string
  completionWitnessName: string
  completionWorkerName: string
  issuerName: string
  approverName: string
}
