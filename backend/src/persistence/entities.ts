import { CompanyEntity } from '../modules/org/entities/company.entity'
import { SiteEntity, DeptEntity, WarehouseEntity, UserEntity } from '../modules/org/entities/organization.entity'
import { UserAuthEntity, AuthLoginHistoryEntity, AuthSessionEntity } from '../modules/auth/entities/auth.entity'
import { EquipmentEntity } from '../modules/equipment/entities/equipment.entity'
import { MaterialEntity } from '../modules/material/entities/material.entity'
import { CodeEntity, CodeItemEntity } from '../modules/code/entities/common-code.entity'
import { ApprovalEntity, ApprovalParticipantEntity } from '../modules/approval/entities/approval.entity'
import { AttachmentEntity, AttachmentItemEntity } from '../modules/attachment/entities/attachment.entity'
import { BoardPostEntity } from '../modules/board/entities/board.entity'
import { PmRecordEntity, PmRecordItemEntity } from '../modules/pm-record/entities/pm-record.entity'
import { WorkOrderEntity, WorkOrderPhaseEntity, WorkOrderItemEntity } from '../modules/work-order/entities/work-order.entity'
import { WorkPermitEntity } from '../modules/work-permit/entities/work-permit.entity'
import { PurchaseRequestEntity, PurchaseRequestItemEntity } from '../modules/purchase-request/entities/purchase-request.entity'
import { PurchaseOrderEntity, PurchaseOrderItemEntity } from '../modules/purchase-order/entities/purchase-order.entity'
import {
  InventoryDocumentEntity,
  InventoryDocumentItemEntity,
  InventoryBalanceEntity,
  InventoryLedgerEntryEntity,
  InventoryClosingPeriodEntity,
  InventoryClosingBalanceEntity,
} from '../modules/inventory/entities/inventory.entity'
import { DocumentSequenceEntity } from '../common/numbering/entities/sequence.entity'

export * from '../modules/org/entities/company.entity'
export * from '../modules/org/entities/organization.entity'
export * from '../modules/auth/entities/auth.entity'
export * from '../modules/equipment/entities/equipment.entity'
export * from '../modules/material/entities/material.entity'
export * from '../modules/code/entities/common-code.entity'
export * from '../modules/approval/entities/approval.entity'
export * from '../modules/attachment/entities/attachment.entity'
export * from '../modules/board/entities/board.entity'
export * from '../modules/pm-record/entities/pm-record.entity'
export * from '../modules/work-order/entities/work-order.entity'
export * from '../modules/work-permit/entities/work-permit.entity'
export * from '../modules/purchase-request/entities/purchase-request.entity'
export * from '../modules/purchase-order/entities/purchase-order.entity'
export * from '../modules/inventory/entities/inventory.entity'
export * from '../common/numbering/entities/sequence.entity'

/** TypeORM에 등록하는 유일한 Entity 목록입니다. */
export const CMMS_ENTITIES = [
  SiteEntity,
  DeptEntity,
  WarehouseEntity,
  UserEntity,
  UserAuthEntity,
  AuthLoginHistoryEntity,
  AuthSessionEntity,
  EquipmentEntity,
  MaterialEntity,
  ApprovalEntity,
  ApprovalParticipantEntity,
  AttachmentEntity,
  AttachmentItemEntity,
  BoardPostEntity,
  PmRecordEntity,
  PmRecordItemEntity,
  WorkOrderEntity,
  WorkOrderPhaseEntity,
  WorkOrderItemEntity,
  WorkPermitEntity,
  PurchaseRequestEntity,
  PurchaseRequestItemEntity,
  PurchaseOrderEntity,
  PurchaseOrderItemEntity,
  InventoryDocumentEntity,
  InventoryDocumentItemEntity,
  InventoryBalanceEntity,
  InventoryLedgerEntryEntity,
  InventoryClosingPeriodEntity,
  InventoryClosingBalanceEntity,
  CodeEntity,
  CodeItemEntity,
  CompanyEntity,
  DocumentSequenceEntity,
]
