# NestJS 영속성 모델

`frontend/src/entities/*/types.ts`의 업무 데이터를 기준으로 27개 TypeORM 엔티티를 구성했습니다. PostgreSQL 기준이며, 화면의 조회용 필드와 DB 저장 필드를 구분합니다. 모든 엔티티는 [src/entities/index.ts](src/entities/index.ts)의 `CMMS_ENTITIES`에서 등록합니다.

## 엔티티와 키

| 영역 | 엔티티 | 기본키 |
| --- | --- | --- |
| 회사 | Company | id |
| 조직 | Site, Department, Warehouse, User | companyId + id |
| 마스터 | Equipment, Material | companyId + id |
| 결재 | Approval | companyId + id |
| 결재 참여자 | ApprovalParticipant | companyId + id + sequenceNo |
| 첨부 | Attachment | companyId + id |
| 첨부 파일 | AttachmentItem | companyId + attachmentId + id |
| 게시판 | BoardPost | companyId + id |
| 점검 | PmRecord | companyId + id |
| 점검 항목 | PmRecordItem | companyId + pmRecordId + id |
| 작업 | WorkOrder | companyId + siteId + id |
| 작업 계획·실적 | WorkOrderPhase | companyId + siteId + workOrderId + phase |
| 작업 항목 | WorkOrderItem | companyId + siteId + workOrderId + id |
| 작업허가 | WorkPermit | companyId + siteId + id |
| 구매요청 | PurchaseRequest | companyId + id |
| 구매요청 항목 | PurchaseRequestItem | companyId + purchaseRequestId + id |
| 구매오더 | PurchaseOrder | companyId + id |
| 구매오더 항목 | PurchaseOrderItem | companyId + purchaseOrderId + id |
| 재고 | InventoryBalance | companyId + warehouseId + materialId |
| 재고 원장 | InventoryLedgerEntry | companyId + id |
| 월 마감 | InventoryClosingPeriod | companyId + id |
| 월 마감 스냅샷 | InventoryClosingBalance | companyId + closingPeriodId + warehouseId + materialId |
| 운영 분류 | CommonCode | companyId + group + code |

사업장 범위를 명시한 작업오더·작업허가는 기존 타입 주석대로 `siteId`를 PK에 포함합니다. 나머지 문서번호는 회사 안에서 유일한 것으로 정의했습니다. 사업장은 속성 또는 참조입니다. 문자열 업무번호의 발급은 향후 서비스에서 수행하며, 엔티티가 임의의 UUID로 변경하지 않습니다.

결재 참여자의 `id`는 부모 `Approval.id`와 **같은 결재번호**입니다. 별도 `approvalId` 컬럼은 없고, `(companyId, id)`를 그대로 부모 외래 키로 사용합니다. React 목록의 key는 순번까지 포함합니다. 결재선 변경 시 복합키 변경도 발생하므로 완료 참여자의 순번을 재배열하지 않는 정책이 필요합니다.

부모·상세 및 조직·자재·설비 참조에는 회사 키를 포함합니다. FK 삭제 동작은 `RESTRICT`로 두어 업무 기록이 연쇄 삭제되지 않게 했습니다. 상세 삭제가 필요한 경우 서비스에서 명시적으로 삭제합니다. 월 마감은 `(companyId, warehouseId, yearMonth)`를 유일하게 하고, 스냅샷이 마감 기간과 다른 창고를 가리키지 않도록 창고까지 FK에 포함합니다.

## 상수와 운영 분류 단일화

### 고정 코드

[../shared/domain-codes.ts](../shared/domain-codes.ts)에 고정 코드를 정의합니다.

```ts
export const APPROVAL_PARTICIPANT_TYPE_LABELS = {
  requester: '기안',
  approval: '결재',
  agreement: '합의',
  reference: '참조',
} as const
export type ApprovalParticipantType = keyof typeof APPROVAL_PARTICIPANT_TYPE_LABELS
```

React는 표시명과 선택 목록을 이 상수에서 얻고, 기존 엔티티 타입 경로는 공통 타입을 다시 export합니다. 백엔드는 `Object.keys(...)`를 enum 값으로 사용합니다. DB에는 `approval` 같은 코드가 저장되며 `결재` 같은 표시명은 저장하지 않습니다.

모듈 표기는 `MODULE_LABELS` 한 곳에서 관리합니다. 결재 모듈과 첨부 모듈은 각각 허용하는 부분집합을 사용합니다. 작업오더의 결재는 `work-order-plan` / `work-order-result`로 구분하고, 첨부 및 재고 참조의 `work-order`는 문서 자체를 뜻합니다.

고정 코드 추가는 양쪽 재빌드와 DB enum 마이그레이션이 필요합니다. 표시명만 바꾸면 DB 값은 변하지 않습니다. 서로 다른 상태 전이를 가진 결재·구매·재고 상태는 별도 코드 집합으로 유지합니다.

### 운영 분류

자재유형·설비유형·점검유형·작업유형은 회사마다 추가할 수 있으므로 개별 enum이나 개별 유형 테이블로 만들지 않았습니다.

```text
common_code
  companyId   COMPANY-HPS
  group       equipmentType
  code        펌프
  label       펌프
  sortOrder   0
  active      true
```

`Equipment.type`, `Material.category`, `PmRecord.type`, `WorkOrder.type`은 코드 문자열입니다. 각 엔티티의 `classificationGroup`은 고정 기본값과 CHECK 제약으로 해당 유형 그룹만 허용하며, `(companyId, classificationGroup, 코드 필드)`가 `common_code`를 참조합니다. PostgreSQL에서 FK 양쪽의 enum 타입이 일치하도록 그룹 enum 이름도 `code_group`으로 공유합니다.

시스템 분류 그룹과 최초 항목은 `seedClassifications(manager, companyId)`에서 `code_group`·`code_item`에 등록합니다. 없는 코드만 추가하며, 운영자가 수정한 표시명·활성 상태를 덮어쓰지 않습니다.

현재 React는 이 기본값으로 선택 목록/자재유형 자동완성을 표시합니다. 향후 API 연계 시 회사별 활성 코드를 조회하여 같은 화면 데이터 형태로 전달합니다. 신규 업무 저장 시 코드 존재 여부는 FK, 비활성 코드 선택 여부는 서비스에서 검증해야 합니다. 사용 중인 코드는 삭제 대신 비활성화하면 기존 문서 참조가 유지됩니다. 신규 분류 항목을 추가할 때 React와 NestJS에 각각 상수를 추가할 필요는 없습니다.

## 저장과 응답 매핑

- `LoginInfo`, `*Response`, `*CreateRequest`, `*UpdateRequest`는 테이블이 아닙니다. 회사명·설비명·작업자명 등은 조회 시 조합합니다. 결재 참여자의 이름·부서명·직책은 결재 당시 스냅샷으로 저장합니다.
- React의 `WorkOrder.plan/result`는 DB의 `phases` 두 행으로 저장합니다. 응답에서 `phase === 'plan'` / `'result'`를 각각 매핑합니다. `workerName`은 사용자 조회값입니다.
- JSON 내부 항목을 별도로 검색/참조하지 않는 작업허가의 가스측정·안전조치·보충허가 상세는 `jsonb` 값 객체로 저장합니다. JSON 내부 코드와 필수 항목은 DTO/서비스에서 검증해야 합니다.
- 수량·금액은 `numeric(20,6)`이며 엔티티에서는 정밀도를 보존하는 문자열입니다. 일부 React 타입은 number이므로 DTO 계층에서 허용 범위/정밀도를 검증한 후 변환하거나, API 계약을 decimal 문자열로 통일해야 합니다. 날짜·시간은 `Date` → ISO 문자열, `date` 컬럼은 `YYYY-MM-DD`로 매핑합니다. 파일 크기는 `bigint` 문자열입니다.
- 회사·조직·설비·자재·점검·작업에는 `AuditedEntity`를 통해 생성/수정 일시 및 사용자 필드를 둡니다. 사용자 값은 인증 컨텍스트에서 서비스가 설정합니다. 상세 항목에는 감사 필드를 추가하지 않았습니다.
- 결재 첨부는 별도 `ApprovalAttachment` 테이블 대신 공통 첨부 그룹(`module: 'approval'`, `recordId: 결재번호`)과 첨부 파일을 사용합니다.
- `Approval.module + recordId`, 첨부 원본, 재고 `referenceType + referenceId`는 여러 테이블을 가리키므로 단일 FK를 만들지 않았습니다. 원본 존재와 권한은 서비스에서 검증합니다. 사업장별 키가 필요한 결재에는 `recordSiteId`, 작업오더 재고 참조에는 `referenceSiteId`를 추가하고 CHECK 제약으로 누락을 막습니다.
- `vendorId`는 React에 거래처 마스터 정의가 없어 문자열로 남겼습니다. 거래처 모델을 추가할 때 회사 범위를 포함한 FK를 연결합니다.
- 주석 상태인 결재 History는 테이블로 생성하지 않았습니다. 현재 참여자 상태는 마지막 결과이며, 재상신·취소·결재선 변경 기록까지 보존하려면 별도 이벤트 엔티티와 상태 변경 트랜잭션을 추가해야 합니다.

## NestJS 연결

상위 NestJS 애플리케이션에서 다음처럼 연결합니다. 이번 범위는 영속성 모듈이며 HTTP 서버나 업무 서비스를 생성하지 않습니다.

```ts
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CMMS_ENTITIES } from './entities'
import { PersistenceModule } from './persistence/persistence.module'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: CMMS_ENTITIES,
      synchronize: false,
    }),
    PersistenceModule,
  ],
})
export class AppModule {}
```

`data-source.ts`도 같은 엔티티 목록을 사용합니다. 파일 import만으로 DB에 접속하지 않습니다. 스키마 적용 전 검토한 마이그레이션을 별도로 생성해야 하며, `synchronize`나 자동 마이그레이션 실행은 켜지 않았습니다.

연결 방식은 [NestJS 공식 DB 문서](https://docs.nestjs.com/techniques/database), 복합키 정의는 [TypeORM 공식 엔티티 문서](https://typeorm.io/docs/entity/entities/)를 따릅니다.

## 검증

```bash
npm ci
npm run build
npm test
```

테스트는 DB 접속 없이 PostgreSQL 드라이버의 전체 엔티티 메타데이터를 생성하여 관계 유효성, FK 회사 범위, 결재 참여자 키, 분류 그룹 제약과 enum 타입, 월 마감 참조, 수치 타입 등을 검사합니다. 실제 PostgreSQL에서의 DDL 적용·저장·트랜잭션 테스트는 아직 수행하지 않았습니다.
