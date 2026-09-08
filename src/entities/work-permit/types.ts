export type SupplementType = 'highPlace' | 'electrical' | 'hotWork' | 'confinedSpace' | 'heavyEquipment'
export type WorkMethod = '' | '자체' | '외주'

export type WorkPermit = {
  // PK id + companyId + siteId
  id: string
  companyId: string
  siteId: string

  departmentId: string
  name: string
  workerId: string
  supervisorId: string
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
  safetyCheckWorker: string
  completionWitness: string
  completionWorker: string
  issuer: string
  approver: string
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
  safetyCheckWitnessName: string
  safetyCheckWorkerName: string
  completionWitnessName: string
  completionWorkerName: string
  issuerName: string
  approverName: string
}
