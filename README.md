# CMMS HPS

React 화면을 기준으로 구성한 NestJS/TypeORM 영속성 모델입니다.

```text
frontend/   React + Vite 소스, 정적 파일, 화면용 타입, mock API
backend/    NestJS 영속성 모듈, PostgreSQL 엔티티, 관계 검증 테스트
shared/     양쪽에서 함께 사용하는 고정 코드와 운영 분류 기본값
```

## 설치와 실행

Node.js 24 기준입니다. 각 프로젝트의 의존성과 lockfile은 독립적으로 관리합니다.

```bash
npm ci --prefix frontend
npm ci --prefix backend
npm run dev
npm run build:backend
npm run test:backend
npm run build:frontend
```

루트의 `npm run dev`, `npm run lint`, `npm run preview`는 `frontend/` 명령으로 연결됩니다. `npm run build`는 백엔드와 프런트엔드 빌드를 순서대로 실행합니다.

현재 백엔드는 엔티티와 NestJS 연결 모듈까지 제공합니다. HTTP 서버, 로그인, CRUD 컨트롤러, DB 마이그레이션은 포함하지 않습니다. React의 mock API는 그대로 사용합니다.

## 공통 코드

- [shared/domain-codes.ts](shared/domain-codes.ts): 결재 상태·행동·참여유형, 모듈, 구매 상태, 재고 거래유형, 역할·권한 등 고정 코드와 표시명. TypeScript 타입은 상수의 키에서 파생합니다.
- [shared/domain-codes.ts](shared/domain-codes.ts): 모듈명과 결재 관련 고정 코드. 운영 분류 데이터는 `code_group`·`code_item` 테이블에서 관리합니다.
- [backend/README.md](backend/README.md): 엔티티 키, 참조 관계, API 매핑, NestJS 연결 방법.

## 검증 상태

백엔드 빌드와 PostgreSQL 메타데이터 테스트, 프런트엔드 Vite 번들 생성은 검증했습니다. 실제 PostgreSQL 접속 및 DDL 적용은 수행하지 않았습니다.

기존 React 화면에는 `department/dept`, 점검·작업 화면의 `title/name`, `workType/type`, 작업허가 필드 등 타입 불일치가 남아 있어 `build:frontend`의 TypeScript 단계는 실패합니다. 이동 전부터 존재하던 오류이며, 결재 참여자 키와 결재 모듈 관련 불일치는 이번 변경에서 수정했습니다.
