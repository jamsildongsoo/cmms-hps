# 코딩 컨벤션

> 이 문서는 CMMS HPS 프로젝트의 개발을 돕기 위한 **참고문서**입니다. 회사의 공식 개발 표준이나 강제 규정이 아니며, 제품 사양·기술 사양·운영 정책과 충돌할 경우 해당 문서를 우선합니다.

## 1. 적용 범위

현재 저장소의 다음 영역을 대상으로 합니다.

```text
frontend/   React + TypeScript + Vite
backend/    NestJS + TypeScript + TypeORM
shared/     프론트엔드와 백엔드가 함께 사용하는 타입·고정 코드
docs/       제품·기술·설치 및 참고 문서
```

기본 실행 환경은 Node.js 24와 PostgreSQL입니다.

## 2. 기본 원칙

- 업무 의미가 드러나는 이름을 사용합니다.
- 회사(tenant) 경계를 모든 업무 데이터와 조회 조건에서 유지합니다.
- 요청 데이터와 인증 컨텍스트를 구분합니다. 회사 ID, 사용자 ID, 감사 필드는 요청 body를 신뢰하지 않고 인증 컨텍스트에서 설정합니다.
- DB의 정밀도와 제약조건을 애플리케이션 코드에서도 보완합니다.
- 조회와 상태 변경 API의 응답 형식을 구분하고, 오류는 공통 오류 코드로 반환합니다.
- 변경은 작게 나누고, 변경 이유와 검증 방법이 드러나도록 합니다.
- 기존 사용자 변경사항이 있는 파일은 diff를 확인한 후 필요한 범위만 수정합니다.

## 3. TypeScript 공통 규칙

### 3.1 타입과 이름

- 변수·함수·메서드: `camelCase`
- 클래스·컴포넌트·타입: `PascalCase`
- 상수: `UPPER_SNAKE_CASE` 또는 도메인 상수 객체의 `camelCase` 키
- 파일명: 기존 디렉터리의 규칙을 따르며, React 컴포넌트는 `PascalCase.tsx`, 서비스·리포지토리·API 모듈은 `kebab-case`를 사용합니다.
- `any`는 사용하지 않습니다. 불확실한 외부 입력은 `unknown`으로 받은 뒤 검증합니다.
- 반환 타입은 공개 서비스·API 함수에 명시하는 것을 우선합니다.
- `interface`와 `type`은 팀 내 일관성을 우선하며, 조합·union·DTO 형태에는 `type`을 사용할 수 있습니다.

### 3.2 외부 입력

TypeScript 타입 선언은 런타임 검증이 아닙니다. 다음 입력은 반드시 경계에서 검증합니다.

- HTTP body, query, param
- 파일명·MIME type·파일 크기
- 날짜·시간·페이지 번호
- enum·고정 코드·회사/조직 식별자
- JSONB 내부 구조

검증 후 서비스에는 정규화된 값을 전달합니다. 예를 들어 문자열 ID는 trim하고, 페이지 번호는 양의 정수 범위로 제한합니다.

## 4. 백엔드 구조

업무 모듈은 가능한 다음 구조를 따릅니다.

```text
modules/<feature>/
  controllers/    HTTP 입출력과 guard/decorator 선언
  services/       업무 규칙과 트랜잭션
  repositories/   TypeORM 조회·저장 쿼리
  entities/       영속성 모델
  dto/            요청·조회 입력 타입과 검증
  <feature>.module.ts
```

### 4.1 Controller

- 인증된 사용자는 `@CurrentActor()`로 받습니다.
- controller에서 직접 DB 쿼리를 작성하지 않습니다.
- body의 `companyId`, `createdBy`, `updatedBy`를 신뢰하지 않습니다.
- 조회 API와 상태 변경 API를 구분합니다.
- 상태 변경 API에는 `@CommandResponse()` 적용을 검토합니다.
- 기능별 권한이 필요한 API에는 `@RequirePermission()`을 선언합니다.

### 4.2 Service

- 업무 규칙, 참조 무결성, 상태 전이를 service에서 검증합니다.
- 여러 테이블을 함께 변경하면 `DataSource.transaction()` 안에서 처리합니다.
- 문서번호 발급은 업무 저장과 동일한 트랜잭션에서 `NumberingService`를 사용합니다.
- 감사 필드의 생성·수정 사용자와 일시는 인증 컨텍스트에서 설정합니다.
- 다른 회사의 ID를 입력받았을 때 조회되지 않도록 모든 repository 호출에 회사 범위를 전달합니다.
- 사용자에게 표시할 오류는 `AppException`과 `ERROR_CODE`를 사용합니다. 원시 `Error`는 내부 오류 또는 개발 전용 방어 코드에 한정합니다.

### 4.3 Repository

- repository는 조회·저장·삭제 쿼리에 집중하고 업무 판단은 service에 둡니다.
- 회사 범위 조건을 기본 조건으로 포함합니다.
- 동적 컬럼명이나 정렬 기준은 허용 목록으로 제한합니다. 사용자 입력을 SQL 식별자에 직접 삽입하지 않습니다.
- 페이지 조회에는 안정적인 정렬 기준을 사용합니다.
- 복합 외래키는 회사 키를 포함하여 다른 회사의 참조가 연결되지 않게 합니다.

## 5. 멀티컴퍼니 규칙

회사코드는 DB의 `company.id`가 기준 식별자입니다. 회사명·활성 여부와 분리하며, 임의의 요청 body 값으로 회사 범위를 바꾸지 않습니다.

- 로그인 시 회사 존재·활성·사용자 소속을 검증합니다.
- 업무 조회·등록·수정·삭제는 `actor.companyId`를 사용합니다.
- 사업장·부서 범위가 있는 사용자는 `scopeLevel`, `siteId`, `deptId`에 따른 추가 필터를 적용합니다.
- 회사별 최초 데이터는 수동 SQL보다 idempotent한 bootstrap 절차를 사용합니다.
- bootstrap은 회사, 기본 조직, 최초 관리자, 인증정보, 기본 권한을 하나의 트랜잭션으로 생성합니다.
- 기존 관리자 비밀번호나 운영 데이터는 bootstrap이 덮어쓰지 않습니다.

## 6. 데이터베이스와 수치 처리

- TypeORM entity의 `synchronize`와 자동 migration 실행은 운영에서 활성화하지 않습니다.
- 스키마 변경은 별도 검토·테스트 후 migration으로 반영합니다.
- `numeric(20,6)` 값은 정밀도를 보존하는 문자열 또는 decimal 전용 타입으로 처리합니다.
- 금액·수량을 일반 JavaScript `Number`로 계산하지 않습니다. 불가피하면 허용 범위와 반올림 정책을 명시합니다.
- 날짜 컬럼은 `YYYY-MM-DD`, timestamp는 ISO 문자열과 timezone 정책을 명확히 합니다.
- 삭제가 업무 기록을 훼손할 수 있는 데이터는 soft delete 또는 `RESTRICT` 정책을 우선 검토합니다.
- enum과 고정 코드는 DB 저장값과 화면 표시명을 분리합니다. DB에는 코드값을 저장합니다.

## 7. 인증·권한·파일

- 액세스 토큰의 서명·알고리즘·필수 claim·만료를 검증합니다.
- 세션 조회 시 token claim과 DB 세션의 회사·사용자·세션 상태를 함께 확인합니다.
- refresh token은 원문을 DB에 저장하지 않고 해시값만 저장합니다.
- 권한 검사는 인증 여부와 별개로 적용합니다. `AuthGuard`만으로 업무 권한 검사가 완료된 것으로 간주하지 않습니다.
- 파일 경로는 회사 ID·첨부 ID 등 안전한 segment로 구성하고 path traversal을 차단합니다.
- 확장자만 믿지 않고 MIME type, 크기, 저장 경로를 함께 검증합니다.
- DB transaction이 실패하면 이미 저장한 파일을 정리하는 보상 처리를 둡니다.

## 8. 프론트엔드 구조

기능별 코드는 `frontend/src/modules/<feature>` 아래에 둡니다.

```text
modules/<feature>/
  api/       백엔드 호출과 응답 매핑
  pages/     화면 컴포넌트
  types/     화면·API 타입
shared/      여러 기능에서 재사용하는 UI·API·첨부·출력 기능
```

- API 호출은 공통 HTTP 모듈을 우선 사용합니다.
- API 응답을 화면 모델로 변환하는 책임은 API 모듈에 둡니다.
- 액세스 토큰을 직접 조작하는 코드를 여러 화면에 복제하지 않습니다.
- `useEffect` 의존성 배열은 실제 참조값을 반영합니다.
- 입력 폼은 저장 전 필수값·형식·범위를 확인하고, 서버 검증도 항상 전제합니다.
- 화면에서 전달받은 `session.companyId`는 화면 표시용으로만 사용하고, 보안 경계로 간주하지 않습니다.
- 긴 JSX는 작은 컴포넌트나 함수로 분리하되, 단순 화면까지 과도하게 추상화하지 않습니다.
- 출력·인쇄 화면은 업무 데이터와 표시 레이아웃을 분리합니다.

## 9. API 응답과 오류

조회 API는 필요한 응답을 직접 반환하고, 상태 변경 API는 다음 형태를 사용합니다.

```json
{
  "success": true,
  "data": {},
  "message": "저장되었습니다."
}
```

오류는 다음 공통 형태를 사용합니다.

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "요청이 올바르지 않습니다.",
    "traceId": "..."
  }
}
```

- 오류 메시지에는 비밀번호, token, 내부 SQL, 서버 경로를 포함하지 않습니다.
- `traceId`는 서버 로그와 장애 분석에 사용합니다.
- 프론트엔드는 오류 code/status에 따라 사용자 메시지와 로그인 만료 처리를 구분합니다.

## 10. 테스트와 검증

변경 후 최소한 다음 명령을 확인합니다.

```bash
npm run build:backend
npm run test:backend
npm run build:frontend
npm run lint
```

추가로 다음 테스트를 우선 작성합니다.

- 회사 간 데이터가 서로 조회되지 않는지
- 역할·권한별 API 접근이 차단되는지
- 잘못된 DTO와 enum이 거부되는지
- 복합 FK와 soft delete가 업무 규칙을 지키는지
- 재고 수량·금액의 소수 정밀도가 유지되는지
- 동시 문서번호 발급과 재고 갱신이 중복·손실 없이 처리되는지
- 파일 저장 실패 시 DB와 파일이 불일치하지 않는지

현재 저장소의 `backend/test/entities.test.ts`는 DB 접속 없이 TypeORM metadata를 검증합니다. 실제 PostgreSQL 동작이 필요한 기능은 별도의 통합 테스트에서 검증합니다.

## 11. 문서 변경 규칙

- 제품의 사용자 가치·업무 규칙은 `product_spec.md`에 기록합니다.
- 시스템 구조·API·데이터·보안은 `tech_spec.md`에 기록합니다.
- 설치·환경변수·bootstrap·운영 절차는 `install_guide.md`에 기록합니다.
- 구현상의 권장 방식은 이 문서에 기록하되, 공식 정책처럼 표현하지 않습니다.
- 문서와 코드가 달라지면 실제 동작을 확인한 후 문서를 갱신합니다.
