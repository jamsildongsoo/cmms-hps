/** React와 NestJS가 함께 사용하는 고정 코드. ORM/React 의존성을 추가하지 않습니다. */
export const MODULE_CODE = {
  GEN: 'general', 

  ORG: 'org',

  EQT: 'equipment', 
  PM: 'pm-record',
  WO: 'work-order', 
  WOP: 'work-order-plan', 
  WOR: 'work-order-result',
  WP: 'work-permit', 
  
  MAT: 'material', 
  PUR: 'purchase',
  PR: 'purchase-request', 
  PO: 'purchase-order',
  INV: 'inventory', 
  
  APR: 'approval', 
  BRD: 'board'
} as const
export type ModuleCode = typeof MODULE_CODE[keyof typeof MODULE_CODE]

export const MODULE_LABEL: Record<ModuleCode, string> = {
  "general": "일반",

  "org": "조직",

  "equipment": "설비",
  "pm-record": "예방점검",
  "work-order": "작업오더",
  "work-order-plan": "작업계획",
  "work-order-result": "작업실적",
  "work-permit": "작업허가",
  
  "material": "자재",
  "purchase": "구매",
  "purchase-request": "구매요청",
  "purchase-order": "구매오더",
  "inventory": "재고",
  
  "approval": "결재",
  "board": "게시판"
}

/** 결재 헤더 상태: D(임시저장) → P(진행) → C(확정), R(반려), X(취소). */
export const APPROVAL_STATUS = {
  DRAFT: 'D', 
  PROGRESS: 'P', 
  CONFIRM: 'C', 
  REJECT: 'R', 
  CANCEL: 'X',
} as const
export type ApprovalStatus = typeof APPROVAL_STATUS[keyof typeof APPROVAL_STATUS]

export const APPROVAL_STATUS_LABEL: Record<ApprovalStatus, string> = {
  D: '임시저장', 
  P: '진행', 
  C: '확정', 
  R: '반려', 
  X: '취소',
}

/** 결재 참여자의 액션: S는 sequenceNo=0 기안자 전용입니다. */
export const APPROVAL_PARTICIPANTS_ACTION = {
  SUBMIT: 'S', 
  APPROVAL: 'A', 
  AGREEMENT: 'G', 
  REFERENCE: 'E',
} as const
export type ApprovalParticipantsAction = typeof APPROVAL_PARTICIPANTS_ACTION[keyof typeof APPROVAL_PARTICIPANTS_ACTION]
export const APPROVAL_PARTICIPANTS_ACTION_LABEL: Record<ApprovalParticipantsAction, string> = {
  S: '기안', 
  A: '결재', 
  G: '합의', 
  E: '참조',
}

/** 참여자 처리 상태: P(미처리), Y(처리완료), N(반려). NULL 대신 P를 사용합니다. */
export const APPROVAL_PARTICIPANT_STATUS = {
  PENDING: 'P', 
  DONE: 'Y', 
  REJECT: 'N',
} as const
export type ApprovalParticipantStatus = typeof APPROVAL_PARTICIPANT_STATUS[keyof typeof APPROVAL_PARTICIPANT_STATUS]
export const APPROVAL_PARTICIPANT_STATUS_LABEL: Record<ApprovalParticipantStatus, string> = {
  P: '미처리', 
  Y: '처리완료', 
  N: '반려',
}

export const WORK_ORDER_PHASE_TYPE_LABELS = {
  plan: '계획',
  result: '실적',
} as const
export type WorkOrderPhaseType = keyof typeof WORK_ORDER_PHASE_TYPE_LABELS

export const SUPPLEMENT_TYPE_LABELS = {
  fire: '화기작업',
  height: '고소작업',
  confinedSpace: '밀폐공간작업',
  electricity: '전기작업',
  excavation: '굴착작업',
} as const
export type SupplementType = keyof typeof SUPPLEMENT_TYPE_LABELS
export type WorkMethod = string

export const USER_ROLE_LABELS = {
  totalAdmin: '총괄관리자',
  siteAdmin: '사이트관리자',
  departmentAdmin: '부서관리자',
  user: '담당자',
} as const
export type UserRole = keyof typeof USER_ROLE_LABELS

export const USER_SCOPE_LEVEL_LABELS = {
  company: '회사',
  site: '사업장',
  department: '부서',
} as const
export type UserScopeLevel = keyof typeof USER_SCOPE_LEVEL_LABELS
export type UserPermission = string

export const PURCHASE_REQUEST_STATUS_LABELS = {
  draft: '임시저장',
  requested: '요청',
  approved: '승인',
  rejected: '반려',
  issued: '발주완료',
  cancelled: '취소',
} as const
export type PurchaseRequestStatus = keyof typeof PURCHASE_REQUEST_STATUS_LABELS

export const PURCHASE_ORDER_STATUS_LABELS = {
  draft: '임시저장',
  requested: '요청',
  approved: '승인',
  issued: '발주',
  received: '입고완료',
  cancelled: '취소',
} as const
export type PurchaseOrderStatus = keyof typeof PURCHASE_ORDER_STATUS_LABELS

export const PURCHASE_ORDER_SOURCE_LABELS = {
  'purchase-request': '구매요청 전환',
  inventory: '재고기반 발주',
} as const
export type PurchaseOrderSource = keyof typeof PURCHASE_ORDER_SOURCE_LABELS

export const INVENTORY_DOCUMENT_TYPE_LABELS = {
  receipt: '입고',
  issue: '출고',
  transfer: '이동',
  adjustment: '조정',
} as const
export type InventoryDocumentType = keyof typeof INVENTORY_DOCUMENT_TYPE_LABELS

export const INVENTORY_DOCUMENT_STATUS_LABELS = {
  draft: '임시저장',
  requested: '요청',
  completed: '완료',
  cancelled: '취소',
} as const
export type InventoryDocumentStatus = keyof typeof INVENTORY_DOCUMENT_STATUS_LABELS

export const INVENTORY_TRANSACTION_TYPE_LABELS = {
  receipt: '입고',
  issue: '출고',
} as const
export type InventoryTransactionType = keyof typeof INVENTORY_TRANSACTION_TYPE_LABELS

export const INVENTORY_TRANSACTION_REASON_LABELS = {
  'purchase-order-receipt': '구매오더 입고',
  'purchase-request-issue': '구매요청 출고',
  'inventory-transfer-in': '재고 이동입고',
  'inventory-transfer-out': '재고 이동출고',
  'inventory-adjustment': '재고 조정',
} as const
export type InventoryTransactionReason = keyof typeof INVENTORY_TRANSACTION_REASON_LABELS

export const INVENTORY_REFERENCE_LABELS = {
  'purchase-order': '구매오더',
  'purchase-request': '구매요청',
  'work-order': '작업오더',
  'inventory-transfer': '재고이동',
  'inventory-adjustment': '재고조정',
} as const
export type InventoryReferenceType = keyof typeof INVENTORY_REFERENCE_LABELS

export const INVENTORY_CLOSING_STATUS_LABELS = {
  open: '미마감',
  closed: '마감',
} as const
export type InventoryClosingStatus = keyof typeof INVENTORY_CLOSING_STATUS_LABELS
