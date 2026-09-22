### 관련 파일

- vite.config.js : 개발 서버 proxy 설정 (`/chat`, `/models` → `http://127.0.0.1:8000`)
- src/api/chatApi.js : API 호출 로직 (`sendChatMessage`, `fetchModels`)
- src/components/MessageBubble.jsx : 메시지 한 건 표시
- src/components/MessageList.jsx : 메시지 목록 렌더링
- src/components/ChatInput.jsx : 메시지 입력창 + 전송 버튼
- src/components/SettingsPanel.jsx : 모델/시스템 프롬프트/파라미터 설정 패널
- src/components/ChatWindow.jsx : 헤더 + MessageList + ChatInput 컨테이너
- src/App.jsx : 최상위 상태 관리 및 레이아웃
- src/App.css : 앱 스타일
- src/index.css : 전역 스타일

### 작업 목록

- [ ] 1.0 기본 설정
  - [ ] 1.1 vite.config.js에 `/chat`, `/models` 경로를 `http://127.0.0.1:8000`으로 보내는 server.proxy 설정 추가 (수정 파일: vite.config.js)
  - [ ] 1.2 App.jsx의 기존 Vite 기본 템플릿 코드(카운터, 로고, hero 섹션, 문서/소셜 링크)를 제거하고 빈 레이아웃으로 정리 (수정 파일: App.jsx, App.css)

- [ ] 2.0 API 계층 구현
  - [ ] 2.1 chatApi.js에 `sendChatMessage({ message, model, systemPrompt, temperature, topP, numPredict })` 함수 구현 — camelCase 인자를 snake_case JSON으로 변환해 `POST /chat` 호출, `{ model, message, elapsedTime }` 반환. 실패 시 422(배열 detail)와 500(문자열 detail)을 모두 사람이 읽을 수 있는 메시지로 변환해 `Error`로 throw하는 공통 에러 파싱 로직 포함 (수정 파일: src/api/chatApi.js)
  - [ ] 2.2 chatApi.js에 `fetchModels()` 함수 구현 — `GET /models` 호출 후 `models` 배열 반환, 실패 시 2.1의 공통 에러 파싱 로직을 재사용해 `Error`로 throw (수정 파일: src/api/chatApi.js)

- [ ] 3.0 정적 UI 구현 (목업 데이터, API 연결 없음)
  - [ ] 3.1 MessageBubble.jsx 구현 — `role`("user"|"assistant")에 따라 정렬/색상이 다른 말풍선 렌더링. 사용자: 오른쪽 정렬 + 파란색 계열, AI: 왼쪽 정렬 + 회색 계열 (수정 파일: src/components/MessageBubble.jsx, App.css)
  - [ ] 3.2 MessageList.jsx 구현 — 목업 메시지 배열을 받아 MessageBubble 리스트 렌더링 (수정 파일: src/components/MessageList.jsx)
  - [ ] 3.3 ChatInput.jsx 구현 — 입력창(placeholder: "메시지를 입력하세요") + 전송 버튼 정적 UI, `inputValue` 내부 상태만 연결 (API 호출 없음) (수정 파일: src/components/ChatInput.jsx, App.css)
  - [ ] 3.4 SettingsPanel.jsx 구현 — 모델 드롭다운, 시스템 프롬프트, Temperature/Top P/Num Predict 슬라이더·입력 정적 UI (목업 옵션/기본값 사용) (수정 파일: src/components/SettingsPanel.jsx, App.css)
  - [ ] 3.5 ChatWindow.jsx 구현 — 헤더("Local LLM Chat"/서브타이틀/"대화 초기화" 버튼) + MessageList + ChatInput 배치 (수정 파일: src/components/ChatWindow.jsx, App.css)
  - [ ] 3.6 App.jsx에 SettingsPanel + ChatWindow를 좌우로 배치, 목업 데이터로 화면 전체 조립 (수정 파일: App.jsx, App.css)

- [ ] 4.0 상태 관리와 API 연결
  - [ ] 4.1 App.jsx에 `messages`, `model`, `systemPrompt`, `temperature`, `topP`, `numPredict`, `modelOptions` 상태 추가하고 마운트 시 `fetchModels` 호출 (수정 파일: App.jsx)
  - [ ] 4.2 SettingsPanel에 상태값과 `onChange` 핸들러를 props로 연결 (수정 파일: App.jsx, SettingsPanel.jsx)
  - [ ] 4.3 ChatInput 전송 시 사용자 메시지를 `messages`에 추가하고 `sendChatMessage` 호출 → 응답 도착 시 AI 메시지 추가 (수정 파일: App.jsx, ChatInput.jsx)
  - [ ] 4.4 ChatWindow의 "대화 초기화" 버튼 클릭 시 확인 모달 없이 즉시 `messages`를 빈 배열로 초기화하는 로직 연결 (수정 파일: App.jsx, ChatWindow.jsx)

- [ ] 5.0 예외 처리 마무리 및 스타일 정리
  - [ ] 5.1 모델 목록 로딩/실패 상태 처리 — 로딩 중 드롭다운 비활성화, 실패 시 재시도 버튼 없이 에러 문구만 표시 (수정 파일: App.jsx, SettingsPanel.jsx)
  - [ ] 5.2 메시지 전송 로딩 상태 처리 — 응답 대기 중 ChatInput 전송 버튼을 "응답 생성 중..."으로 표시하고 비활성화 (수정 파일: App.jsx, ChatInput.jsx)
  - [ ] 5.3 `/chat` 실패 시 에러 메시지 표시 처리 — chatApi.js가 변환한 메시지(422/500 공통)를 동일한 방식으로 채팅 영역에 표시 (수정 파일: App.jsx, ChatWindow.jsx)
  - [ ] 5.4 대화가 없을 때 "메시지를 입력해 대화를 시작하세요" 빈 상태 안내 문구 표시 (수정 파일: MessageList.jsx)
  - [ ] 5.5 App.css/index.css 전체 스타일을 설계도 기준으로 정리 (수정 파일: App.css, index.css)
