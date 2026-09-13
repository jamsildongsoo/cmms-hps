import type { EntityManager } from 'typeorm'
import { CodeEntity, CodeItemEntity } from './persistence/entities'

const CODE_GROUP_LABELS = {
  materialType: '자재유형', equipmentType: '설비유형', inspectionType: '점검유형',
  workOrderType: '작업오더유형', workPermitType: '작업허가유형',
} as const
const DEFAULT_ITEMS: Record<keyof typeof CODE_GROUP_LABELS, readonly string[]> = {
  materialType: ['기계부품', '윤활유', '펌프부품'],
  equipmentType: ['펌프', '모터', '탱크', '밸브', '컴프레서', '열교환기', '기타'],
  inspectionType: ['정기점검', '수시점검', '긴급점검'],
  workOrderType: ['예방정비', '고장정비', '개선작업'],
  workPermitType: ['일반작업', '화기작업', '고소작업'],
}

/** 회사 생성 트랜잭션에서 호출. 재실행해도 운영자가 변경한 라벨/활성 상태를 덮어쓰지 않습니다. */
export async function seedClassifications(manager: EntityManager, companyId: string): Promise<void> {
  if (!companyId.trim()) throw new Error('companyId is required')
  const actor = 'system'
  await manager.createQueryBuilder()
    .insert()
    .into(CodeEntity)
    .values((Object.keys(CODE_GROUP_LABELS) as Array<keyof typeof CODE_GROUP_LABELS>).map((groupCode, sortOrder) => ({
      companyId, id: groupCode, name: CODE_GROUP_LABELS[groupCode], system: true, active: true,
      createdBy: actor, updatedBy: actor,
    })))
    .orIgnore()
    .execute()
  await manager.createQueryBuilder()
    .insert()
    .into(CodeItemEntity)
    .values((Object.keys(DEFAULT_ITEMS) as Array<keyof typeof DEFAULT_ITEMS>).flatMap((groupCode) =>
      DEFAULT_ITEMS[groupCode].map((id, sortOrder) => ({
        companyId, codeId: groupCode, id, label: id, sortOrder, active: true, createdBy: actor, updatedBy: actor,
      }))))
    .orIgnore()
    .execute()
}
