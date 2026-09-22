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

## [3.1] MessageBubble.jsx 구현
- 날짜: 2026-09-22
- 변경 파일: frontend/src/components/MessageBubble.jsx, frontend/src/App.css
- 한 일: `role`("user"|"assistant")과 `content`를 props로 받아 사용자 메시지는 오른쪽 정렬 + 파란색, AI 메시지는 왼쪽 정렬 + 회색 말풍선으로 렌더링하는 `MessageBubble`을 구현했다. App.css에 `.message-row`, `.message-bubble` 관련 스타일을 추가했다. `npm run lint`, `npm run build` 통과를 확인했다.
- 확인 방법: `frontend/src/components/MessageBubble.jsx`와 `frontend/src/App.css`의 `.message-bubble--user`/`.message-bubble--assistant` 스타일을 확인한다. 3.2~3.6에서 상위 컴포넌트가 이 컴포넌트를 사용하기 시작하면 브라우저에서 정렬/색상을 직접 확인할 수 있다.
- 결정/이슈: 이번 작업 범위는 MessageBubble.jsx와 App.css뿐이라 아직 App.jsx 등 다른 컴포넌트에서 import하지 않았다(3.2 MessageList에서 연결 예정). 외부 라이브러리 없이 순수 React/CSS만 사용해 Context7 조회는 생략했다. 이슈 없음.

## [3.2] MessageList.jsx 구현
- 날짜: 2026-09-22
- 변경 파일: frontend/src/components/MessageList.jsx
- 한 일: `messages`(`{ role, content }` 배열) props를 받아 각 항목을 `MessageBubble`로 매핑해 렌더링하는 `MessageList`를 구현했다. 컨테이너에 `.message-list` 클래스명만 부여하고 실제 스타일은 이번 작업 범위(App.css 미포함)가 아니라 추가하지 않았다. `npm run lint`, `npm run build` 통과를 확인했다.
- 확인 방법: `frontend/src/components/MessageList.jsx`를 확인한다. 아직 App.jsx 등에서 import하지 않아 화면에는 나타나지 않으며, 3.6에서 목업 데이터와 함께 연결된다.
- 결정/이슈: PRD 컴포넌트 명세상 목업 데이터는 이 컴포넌트가 아니라 상위(App.jsx, 3.6)에서 주입하므로 `MessageList` 자체는 props로만 받도록 구현함. key는 배열 index를 사용(목업/실데이터 모두 메시지에 고유 id가 없어 대안이 없음). 이슈 없음.

## [3.3] ChatInput.jsx 구현
- 날짜: 2026-09-22
- 변경 파일: frontend/src/components/ChatInput.jsx, frontend/src/App.css
- 한 일: placeholder "메시지를 입력하세요"인 입력창과 전송 버튼을 가진 `ChatInput`을 구현했다. `inputValue` 내부 상태로 입력값을 관리하고, Enter 키 또는 버튼 클릭 시 `onSend(trimmed)`를 호출한 뒤 입력값을 비운다. `isLoading`이 true면 입력창/버튼을 비활성화하고 버튼 텍스트를 "응답 생성 중..."으로 표시한다. App.css에 `.chat-input` 관련 스타일을 추가했다. `npm run lint`, `npm run build` 통과를 확인했다.
- 확인 방법: `frontend/src/components/ChatInput.jsx`와 `frontend/src/App.css`의 `.chat-input` 스타일을 확인한다. 아직 App.jsx에서 연결하지 않아 화면에는 나타나지 않으며, 3.6에서 목업으로 연결된다.
- 결정/이슈: 이 컴포넌트는 `chatApi`를 직접 호출하지 않고 `onSend` prop만 호출하도록 구현해 "API 호출 없음" 조건을 지켰다(실제 API 연동은 4.3에서 App.jsx가 담당). PRD 명세대로 `onSend`, `isLoading` props를 함께 구현했으며, 지금은 상위에서 아직 전달하지 않아 값이 `undefined`인 상태다. 이슈 없음.

## [3.4] SettingsPanel.jsx 구현
- 날짜: 2026-09-22
- 변경 파일: frontend/src/components/SettingsPanel.jsx, frontend/src/App.css
- 한 일: PRD 명세대로 `model`, `systemPrompt`, `temperature`, `topP`, `numPredict`, `modelOptions`와 각각의 `onChange` 계열 props만 사용하는 완전 제어 컴포넌트로 `SettingsPanel`을 구현했다(내부 상태 없음). 모델 드롭다운, 시스템 프롬프트 textarea, Temperature/Top P range 슬라이더, Num Predict number input을 렌더링하고 App.css에 `.settings-panel` 관련 스타일을 추가했다. `npm run lint`, `npm run build` 통과를 확인했다.
- 확인 방법: `frontend/src/components/SettingsPanel.jsx`와 `frontend/src/App.css`의 `.settings-panel` 스타일을 확인한다. 아직 App.jsx에서 연결하지 않아 화면에는 나타나지 않으며, 3.6에서 목업 옵션/기본값과 함께 연결된다.
- 결정/이슈: PRD 컴포넌트 명세상 이 컴포넌트는 내부 상태 없이 상위(App.jsx)가 모든 값을 props로 내려주는 controlled component이므로, 목업 옵션/기본값은 이 파일이 아니라 3.6(App.jsx)에서 주입하기로 함. Temperature step은 0.1, Top P step은 0.05로 설정(PRD 요청 예시 값 0.4/0.55가 각 step의 배수가 되도록 선택). 이슈 없음.

## [3.5] ChatWindow.jsx 구현
- 날짜: 2026-09-22
- 변경 파일: frontend/src/components/ChatWindow.jsx, frontend/src/App.css
- 한 일: 설계도(`chat_ui_설계도.jpg`)를 확인해 타이틀 "Local LLM Chat", 서브타이틀 "React + FastAPI + Ollama 기반 로컬 AI 채팅 앱", "대화 초기화" 버튼이 한 줄에 배치된 헤더와 `MessageList`, `ChatInput`을 담는 `ChatWindow`를 구현했다. `messages`, `onSendMessage`, `onReset`, `isLoading` props를 받아 `MessageList`/`ChatInput`에 전달하고, 초기화 버튼 클릭 시 `onReset`을 호출한다. App.css에 `.chat-window`, `.message-list` 레이아웃 스타일을 추가했다. `npm run lint`, `npm run build` 통과를 확인했다.
- 확인 방법: `frontend/src/components/ChatWindow.jsx`와 `frontend/src/App.css`의 `.chat-window` 관련 스타일, 그리고 `frontend/docs/chat_ui_설계도.jpg`를 비교해 헤더 문구/배치를 확인한다. 아직 App.jsx에서 연결하지 않아 화면에는 나타나지 않으며, 3.6에서 목업 데이터와 함께 연결된다.
- 결정/이슈: 서브타이틀 문구는 PRD에 정확한 텍스트가 없어 설계도 이미지(`chat_ui_설계도.jpg`)에 적힌 문구를 그대로 사용했다. PRD 컴포넌트 명세의 `error` prop은 5.3(에러 표시 처리)에서 추가하기로 하고 이번 정적 UI 단계에서는 받지 않았다. 설계도의 입력창 placeholder 텍스트가 "대화 초기화"로 보이는 부분은 PRD 6~7절에 명시된 "메시지를 입력하세요"를 우선해 그대로 유지함(3.3에서 이미 구현). 이슈 없음.

## [3.6] App.jsx에 SettingsPanel + ChatWindow 조립
- 날짜: 2026-09-22
- 변경 파일: frontend/src/App.jsx, frontend/src/App.css
- 한 일: App.jsx에서 `SettingsPanel`(좌측)과 `ChatWindow`(우측)를 나란히 배치하고, PRD 기본값(모델 "exaone3.5:7.8b", 시스템 프롬프트 "너는 초보자를 돕는 친절한 AI 강사다.", temperature 0.6, topP 0.7, numPredict 256)과 `/models` 응답 예시 기반 목업 `modelOptions`, user/assistant 예시가 담긴 목업 `messages`로 화면 전체를 조립했다. 아직 상태 관리 전 단계라 모든 `onChange`/`onSend`/`onReset` 핸들러는 빈 함수로 연결했다. App.css에 `.app` 좌우 레이아웃 스타일을 추가했다. `npm run lint`, `npm run build` 통과(22개 모듈로 증가해 전 컴포넌트가 연결됐음을 확인)했고, 3.1~3.6이 모두 끝나 상위 작업 3.0도 체크했다.
- 확인 방법: 사용자가 직접 `npm run dev`로 개발 서버를 띄운 뒤 브라우저에서 좌측 설정 패널 + 우측 채팅창 레이아웃과 목업 메시지 2건이 `chat_ui_설계도.jpg`와 유사하게 보이는지 확인한다(드롭다운/슬라이더 조작은 아직 반응하지 않는 것이 정상 — 4.0에서 연결 예정).
- 결정/이슈: 3.6은 "정적 UI 조립" 단계라 App.jsx에 `useState`를 도입하지 않고 상수 목업 값과 no-op 핸들러만 사용했다(실제 상태 관리는 4.1~4.4). `index.css`는 이번 작업 범위 밖(수정 파일 목록에 없음)이라 건드리지 않았고, 기존 Vite 템플릿 잔재(`#root` 폭 1126px, `text-align: center` 등)는 5.5 스타일 정리 단계에서 정리하기로 함. 이슈 없음.

## 3.6 보완: 레이아웃
- 날짜: 2026-09-22
- 변경 파일: frontend/src/index.css, frontend/src/App.css
- 한 일: `index.css`의 Vite 기본 템플릿 잔재(`#root`의 `width: 1126px`, `max-width`, `margin: 0 auto`, `text-align: center`, `border-inline`)를 제거하고 `html, body { height: 100%; margin: 0; }` + `#root { width: 100%; height: 100vh; display: flex; flex-direction: column; }`으로 바꿔 화면 전체 너비/높이를 채우도록 했다. App.css는 기존에 이미 `.app`(flex:1, min-height:0), `.chat-window`(height:100%, flex column), `.message-list`(flex:1, overflow-y:auto), `.settings-panel`(overflow-y:auto) 구조가 갖춰져 있어 `#root`의 높이가 100vh로 고정되자 페이지 전체는 스크롤되지 않고 메시지 목록 영역만 내부 스크롤되도록 정상 동작함을 확인했다. `npm run lint`, `npm run build` 통과를 확인했다.
- 확인 방법: 사용자가 `npm run dev`로 개발 서버를 띄운 뒤 브라우저 창을 키워 화면 양옆 흰 여백이 사라지고 좌측 설정 패널/우측 채팅 영역이 화면 하단까지 채워지는지 확인한다. 브라우저 창 높이를 줄이거나 메시지를 여러 개 추가해 보면(App.jsx 목업 데이터에 항목 추가) 페이지 전체가 아니라 메시지 목록 영역만 스크롤되는지 확인할 수 있다.
- 결정/이슈: `App.css`의 레이아웃 구조(`.app`, `.chat-window`, `.message-list`의 flex/overflow 설정)는 3.5~3.6에서 이미 올바르게 작성돼 있었고, 문제의 근본 원인은 `index.css`의 `#root`가 `min-height: 100svh`(콘텐츠가 넘치면 뷰포트보다 커짐)와 고정 폭 `1126px`을 쓰고 있었던 것이었다. `min-height`를 `height: 100vh`로, 폭 제한을 제거하는 것으로 해결해 App.css는 구조 변경 없이 그대로 두었다(요청대로 두 파일 모두 손을 대긴 했으나 실질적 레이아웃 로직 변경은 index.css에 집중됨). PRD 범위상 모바일 반응형은 제외이므로 100vh 고정 방식을 그대로 사용함. 이슈 없음.

## [4.1/4.2/4.4] App.jsx 상태 추가 + SettingsPanel/초기화 버튼 연결
- 날짜: 2026-09-22
- 변경 파일: frontend/src/App.jsx
- 한 일: `messages`, `model`, `systemPrompt`, `temperature`, `topP`, `numPredict`, `modelOptions` 상태를 `useState`로 추가하고, 마운트 시 Context7로 확인한 React 최신 패턴(`useEffect` 내부 async 함수 + `ignore` 플래그로 경쟁 상태 방지)으로 `chatApi.fetchModels()`를 호출해 `modelOptions`를 채우도록 구현했다. `SettingsPanel`의 5개 `onChange` prop은 각각 대응하는 setter(`setModel` 등)에 직접 연결했고, `ChatWindow`의 `onReset`은 `() => setMessages([])`로 연결했다. `npm run lint`, `npm run build` 통과를 확인했다.
- 확인 방법: `npm run dev`로 백엔드(8000번 포트)와 함께 띄운 뒤, 모델 드롭다운에 실제 Ollama 모델 목록이 채워지는지, 시스템 프롬프트/슬라이더/Num Predict를 조작하면 값이 실제로 바뀌는지, "대화 초기화" 버튼을 누르면 메시지 목록이 비워지는지 확인한다.
- 결정/이슈: 원래 작업 목록은 4.1(상태 추가)·4.2(SettingsPanel 연결)·4.4(초기화 로직)를 별도 하위 작업으로 나눴지만, `useState`의 setter를 선언만 하고 실제로 참조하지 않으면 `no-unused-vars` ESLint 오류가 발생함을 확인했다(직접 테스트 스크립트로 검증). 각 하위 작업을 파일 수정 없이 "빈 커밋"으로 통과시키는 대신, 세 작업 모두 App.jsx 한 번의 수정으로 함께 반영하고 각각 체크 및 기록했다. `SettingsPanel.jsx`, `ChatWindow.jsx`는 이미 3.4/3.5에서 필요한 props를 전부 지원하도록 구현되어 있어 추가 수정이 필요 없었다. `sendChatMessage` 연동(4.3)과 로딩 상태(5.2)는 아직 이 커밋에 포함하지 않았다. `fetchModels` 실패 시 처리는 5.1에서 다룰 예정이라 지금은 `console.error`로만 남겨두었다. 이슈 없음.

## [4.3] ChatInput 전송 → sendChatMessage 연동
- 날짜: 2026-09-22
- 변경 파일: frontend/src/App.jsx
- 한 일: `App.jsx`에 `handleSendMessage(content)`를 추가해 사용자 메시지를 즉시 `messages`에 추가하고, 현재 `model`/`systemPrompt`/`temperature`/`topP`/`numPredict` 값으로 `chatApi.sendChatMessage`를 호출한 뒤 응답의 `message`를 AI 메시지로 `messages`에 추가하도록 구현했다. `ChatWindow`의 `onSendMessage`에 이 함수를 연결했다. `ChatInput.jsx`는 3.3에서 이미 `onSend(trimmed)`를 호출하도록 구현돼 있어 추가 수정이 필요 없었다. `npm run lint`, `npm run build` 통과를 확인했고, 4.1~4.4가 모두 끝나 상위 작업 4.0도 체크했다.
- 확인 방법: 백엔드를 8000번 포트에서 실행한 뒤 `npm run dev`로 프론트를 띄우고 입력창에 메시지를 보내면, 사용자 메시지가 오른쪽 파란 말풍선으로 먼저 추가되고 잠시 뒤 왼쪽 회색 말풍선으로 AI 응답이 추가되는지 확인한다.
- 결정/이슈: 요청 중복 방지/로딩 표시(`isLoading`)는 5.2에서, 실패 시 에러 메시지 표시는 5.3에서 다루기로 하고 이번 작업에서는 `catch` 블록에 `console.error`만 남겨 두었다. `/chat` 요청은 PRD 9.8 요구사항대로 대화 히스토리 없이 최신 사용자 메시지(`content`)만 전송한다. 이슈 없음.
