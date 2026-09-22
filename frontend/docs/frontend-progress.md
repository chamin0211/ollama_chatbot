## [1.1] vite.config.js에 `/chat`, `/models` 경로를 `http://127.0.0.1:8000`으로 보내는 server.proxy 설정 추가
- 날짜: 2026-09-22
- 변경 파일: frontend/vite.config.js, frontend/docs/frontend-task.md
- 한 일: Context7로 Vite 최신 `server.proxy` 문법(문자열 shorthand)을 확인한 뒤, `/chat`과 `/models` 요청을 `http://127.0.0.1:8000`으로 전달하는 proxy 설정을 추가했다. `npm run lint`, `npm run build` 모두 통과를 확인했다.
- 확인 방법: `frontend/vite.config.js`의 `server.proxy` 블록을 확인한다. 백엔드가 8000번 포트에서 실행 중일 때 프론트 개발 서버를 띄우고 `/chat`, `/models`로 요청을 보내면 프록시되는지 확인할 수 있다.
- 결정/이슈: 백엔드 라우트가 `/api` 같은 접두사 없이 `/chat`, `/models`로 고정되어 있어, proxy 키도 접두사나 `rewrite` 없이 두 경로를 그대로 사용하기로 결정함. 그 외 이슈 없음.

## [1.2] App.jsx의 기존 Vite 기본 템플릿 코드를 제거하고 빈 레이아웃으로 정리
- 날짜: 2026-09-22
- 변경 파일: frontend/src/App.jsx, frontend/src/App.css
- 한 일: App.jsx에서 카운터 버튼, hero 이미지, Documentation/Connect with us 섹션 등 Vite 기본 템플릿 코드를 전부 제거하고 `<div className="app"></div>`만 남긴 빈 레이아웃으로 정리했다. App.css도 템플릿 전용 스타일(.counter, .hero, #next-steps 등)을 모두 비웠다. `npm run lint`, `npm run build` 통과를 확인했다.
- 확인 방법: `frontend/src/App.jsx`, `frontend/src/App.css`를 열어 템플릿 코드가 제거됐는지 확인한다. 화면은 이후 3.0 단계에서 컴포넌트들이 채워질 때까지 빈 화면으로 보이는 게 정상이다.
- 결정/이슈: hero.png/react.svg/vite.svg 등 assets 폴더의 이미지 파일 자체는 이번 작업 범위(App.jsx, App.css)에 포함되지 않아 삭제하지 않고 그대로 두었다. 이슈 없음.

## [2.1] chatApi.js에 sendChatMessage 함수 구현
- 날짜: 2026-09-22
- 변경 파일: frontend/src/api/chatApi.js, frontend/docs/frontend-task.md
- 한 일: 네이티브 `fetch`로 `POST /chat`을 호출하는 `sendChatMessage`를 구현하고, camelCase 인자를 snake_case JSON으로 변환해 전송했다. 422(배열 detail)/500(문자열 detail) 응답을 사람이 읽을 수 있는 메시지로 변환해 `Error`로 throw하는 `parseErrorResponse` 공통 함수를 추가했다. `npm run lint`, `npm run build` 통과를 확인했다.
- 확인 방법: `frontend/src/api/chatApi.js`에서 `sendChatMessage`와 `parseErrorResponse`를 확인한다. 백엔드를 8000번 포트에서 실행한 뒤 브라우저 콘솔 등에서 `sendChatMessage({ message: "안녕" })`을 호출하면 `{ model, message, elapsedTime }`이 반환되는지 확인할 수 있다.
- 결정/이슈: 이 작업은 외부 라이브러리 없이 네이티브 `fetch` API만 사용하므로 Context7 조회는 생략했다. `parseErrorResponse`는 2.2의 `fetchModels`에서도 재사용할 예정으로 export하지 않은 파일 내부 헬퍼로 작성함. 이슈 없음.

## [2.2] chatApi.js에 fetchModels 함수 구현
- 날짜: 2026-09-22
- 변경 파일: frontend/src/api/chatApi.js, frontend/docs/frontend-task.md
- 한 일: 네이티브 `fetch`로 `GET /models`를 호출하는 `fetchModels`를 구현하고, 응답의 `models` 배열을 그대로 반환하도록 했다. 실패 시 2.1에서 만든 `parseErrorResponse`를 재사용해 `Error`로 throw한다. `npm run lint`, `npm run build` 통과를 확인했고, 2.1/2.2가 모두 끝나 상위 작업 2.0도 체크했다.
- 확인 방법: `frontend/src/api/chatApi.js`에서 `fetchModels`를 확인한다. 백엔드를 8000번 포트에서 실행한 뒤 브라우저 콘솔 등에서 `fetchModels()`를 호출하면 설치된 모델 이름 배열(`string[]`)이 반환되는지 확인할 수 있다.
- 결정/이슈: 2.1과 동일하게 외부 라이브러리 없이 네이티브 `fetch`만 사용해 Context7 조회는 생략했다. 이슈 없음.
