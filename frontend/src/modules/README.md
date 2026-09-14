# Frontend modules

프론트엔드 도메인 모듈은 백엔드의 `backend/src/modules`와 동일한 도메인 경계를 사용합니다.

각 모듈은 다음 책임을 가집니다.

- `api/`: 해당 도메인의 백엔드 API 호출
- `types/`: 해당 도메인의 요청·응답 타입
- `pages/`: 해당 도메인의 화면 및 화면 전용 컴포넌트
- `templates/`: 해당 도메인의 문서·입력 템플릿

`app/`과 `widgets/`는 모듈을 조립하고, `shared/`는 여러 모듈에서 재사용하는 공통 기능만 보관합니다.
