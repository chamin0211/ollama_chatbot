# 채팅 UI 프론트엔드 PRD

## 1. 개요

Ollama 기반 로컬 LLM과 대화하는 채팅 웹 UI를 React로 구현한다. 사용자는 화면에서 모델과 생성 파라미터를 직접 조절하며, 기존에 완성되어 있는 FastAPI 백엔드(`backend/`)에 메시지를 보내고 응답을 받는다. 백엔드는 수정하지 않고, `frontend/` 폴더에서 화면만 새로 만든다.

## 2. 목표

- `chat_ui_설계도.jpg`에 그려진 화면(모델 설정 사이드바 + 채팅 영역)을 그대로 구현한다.
- 사용자가 메시지를 입력해 전송하면 즉시 로딩 상태가 표시되고, 응답 도착 시 화면에 반영된다.
- 백엔드 `POST /chat`, `GET /models` 두 엔드포인트만으로 전체 기능이 동작한다.

## 3. 사용자 시나리오

1. 사용자는 사용 가능한 모델을 고르기 위해 페이지 접속 시 모델 드롭다운에서 설치된 Ollama 모델 목록을 확인한다.
2. 사용자는 AI의 답변 스타일을 조정하기 위해 시스템 프롬프트, Temperature, Top P, Num Predict 값을 설정한다.
3. 사용자는 질문을 하기 위해 하단 입력창에 메시지를 작성하고 전송한다.
4. 사용자는 응답을 기다리는 동안 현재 요청이 처리 중임을 확인하기 위해 "응답 생성 중..." 상태를 본다.
5. 사용자는 대화를 새로 시작하기 위해 "대화 초기화" 버튼을 눌러 메시지 목록을 비운다.

## 4. 화면 구조

### 4.1 설계도 영역 ↔ 컴포넌트 대응 표

| 설계도 영역 | 대응 컴포넌트 |
|---|---|
| 좌측 사이드바 (모델/시스템 프롬프트/Temperature/Top P/Num Predict) | `SettingsPanel.jsx` |
| 우측 전체 영역(헤더 + 메시지목록 + 입력창을 담는 컨테이너) | `ChatWindow.jsx` |
| 메시지 목록 영역 | `MessageList.jsx` |
| 메시지 목록 안의 말풍선 1개 | `MessageBubble.jsx` |
| 하단 입력창 + 전송/응답상태 버튼 | `ChatInput.jsx` |

### 4.2 컴포넌트 트리

```
App
├─ SettingsPanel
└─ ChatWindow
   ├─ (헤더: 타이틀/서브타이틀/초기화 버튼 — ChatWindow 내부에 직접 포함)
   ├─ MessageList
   │  └─ MessageBubble (반복)
   └─ ChatInput
```

### 4.3 반응형 동작

`chat_ui_설계도.jpg`는 데스크톱 레이아웃만 제공하므로, 아래 브레이크포인트 하나만 추가한다.

- 뷰포트 너비 768px 초과: 기존 설계도대로 `SettingsPanel`(좌측 고정폭 사이드바) + `ChatWindow`(우측)의 좌우 2단 레이아웃을 유지한다.
- 뷰포트 너비 768px 이하: `App`의 최상위 레이아웃(`.app`)이 세로(column)로 전환되어 `SettingsPanel`이 위, `ChatWindow`가 아래로 쌓인다. `SettingsPanel`의 고정 너비(280px)는 100%로 바뀐다.
- 컴포넌트 구조·props·기능 요구사항은 변경하지 않는다. CSS(App.css)의 미디어 쿼리만으로 구현한다.

## 5. 컴포넌트 명세

### App.jsx
- 역할: 최상위 컴포넌트. `SettingsPanel`과 `ChatWindow`를 좌우로 배치하고, 대화 메시지·모델 설정 상태를 소유해 하위 컴포넌트에 props로 내려준다.
- Props: 없음(최상위)
- 내부 상태: `messages`(배열), `model`, `systemPrompt`, `temperature`, `topP`, `numPredict`, `isLoading`, `error`
- 사용자 동작: 없음(하위 컴포넌트에서 올라온 이벤트로 상태만 갱신)

### SettingsPanel.jsx
- 역할: 모델 선택, 시스템 프롬프트, Temperature/Top P/Num Predict 조절 UI
- Props: `model`, `systemPrompt`, `temperature`, `topP`, `numPredict`, `modelOptions`, `onModelChange`, `onSystemPromptChange`, `onTemperatureChange`, `onTopPChange`, `onNumPredictChange`
- 내부 상태: 없음 (모두 상위에서 props로 제어되는 controlled component)
- 사용자 동작: 드롭다운에서 모델 선택, 시스템 프롬프트 텍스트 입력, 슬라이더 드래그(Temperature/Top P), Num Predict 숫자 입력

### ChatWindow.jsx
- 역할: 헤더(타이틀 "Local LLM Chat", 서브타이틀, "대화 초기화" 버튼)와 `MessageList`, `ChatInput`을 담는 우측 메인 영역
- Props: `messages`, `onSendMessage`, `onReset`, `isLoading`, `error`
- 내부 상태: 없음
- 사용자 동작: "대화 초기화" 버튼 클릭 → `onReset` 호출

### MessageList.jsx
- 역할: `messages` 배열을 순회하며 `MessageBubble`을 렌더링
- Props: `messages`(배열, 각 항목 `{ role, content }`)
- 내부 상태: 없음
- 사용자 동작: 스크롤

### MessageBubble.jsx
- 역할: 메시지 한 건을 역할(사용자/AI)에 따라 다른 정렬·색상으로 표시. 사용자 메시지는 오른쪽 정렬 + 파란색 계열 배경, AI 메시지는 왼쪽 정렬 + 회색 계열 배경.
- Props: `role`("user" | "assistant"), `content`(string)
- 내부 상태: 없음
- 사용자 동작: 없음(읽기 전용)

### ChatInput.jsx
- 역할: 메시지 입력창과 전송 버튼(응답 생성 중에는 "응답 생성 중..." 상태로 전환). 입력창 placeholder는 "메시지를 입력하세요".
- Props: `onSend`, `isLoading`
- 내부 상태: `inputValue`(입력 중인 텍스트)
- 사용자 동작: 텍스트 입력, Enter 키로 전송, 버튼 클릭으로 전송

## 6. API 명세

Base URL(개발): 프론트엔드 코드는 `http://127.0.0.1:8000`을 직접 호출하지 않는다. `vite.config.js`의 `server.proxy`가 `/chat`, `/models` 경로를 `http://127.0.0.1:8000`(backend/main.py 실행 포트)으로 전달하고, `chatApi.js`는 상대 경로(`/chat`, `/models`)로 fetch한다. 환경변수는 사용하지 않는다.

### POST /chat

요청 예시:
```json
{
  "message": "React와 FastAPI를 연결해서 로컬 LLM 채팅 앱을 만드는 과정을 3단계로 설명해줘.",
  "model": "gemma3:4b",
  "system_prompt": "너는 초보자를 돕는 AI 강사다. 답변은 명확하고 간결하게 작성한다.",
  "temperature": 0.4,
  "top_p": 0.55,
  "num_predict": 256
}
```
- `message` 필수, 나머지는 생략 시 서버 기본값 사용(`model`: "exaone3.5:7.8b", `system_prompt`: "너는 초보자를 돕는 친절한 AI 강사다.", `temperature`: 0.6, `top_p`: 0.7, `num_predict`: 256)
- 제약: `temperature` 0.0~2.0, `top_p` 0.0~1.0, `num_predict` 1~2048 (범위를 벗어나면 FastAPI가 422 응답)

응답 예시(200):
```json
{
  "model": "gemma3:4b",
  "message": "1단계: FastAPI로 /chat 엔드포인트를 만든다...",
  "elapsed_time": 2.341
}
```

에러: 두 가지 형식이 있다.
- 422 (요청 필드 검증 실패, 예: `num_predict`가 1~2048 범위를 벗어남): FastAPI 기본 검증 에러 형식으로 `detail`이 **배열**이다. `{"detail": [{"loc": ["body", "num_predict"], "msg": "...", "type": "..."}]}`
- 500 (서버 내부 오류): `detail`이 **문자열**이다. `{"detail": "채팅 처리 중 오류가 발생했습니다: <메시지>"}`

스트리밍 여부: **아니오.** 전체 응답이 완성된 후 한 번에 반환된다. 타이핑 효과 같은 부분 렌더링은 불필요하다.

### GET /models

요청: 파라미터 없음

응답 예시(200):
```json
{ "models": ["gemma3:4b", "exaone3.5:7.8b"] }
```

에러: Ollama 서버(`localhost:11434`) 조회 실패 시 500, `{"detail": "모델 목록 조회 중 오류가 발생했습니다.: <메시지>"}`

## 7. chatApi.js 함수 명세

| 함수명 | 인자 | 반환값 | 호출 엔드포인트 |
|---|---|---|---|
| `sendChatMessage` | `{ message, model, systemPrompt, temperature, topP, numPredict }` | `Promise<{ model: string, message: string, elapsedTime: number }>` | `POST /chat` (camelCase 인자를 snake_case JSON으로 변환해 전송) |
| `fetchModels` | 없음 | `Promise<string[]>` | `GET /models` (응답의 `models` 배열을 그대로 반환) |

두 함수 모두 실패 시 응답의 `detail`을 사람이 읽을 수 있는 문자열로 변환해 `Error`를 throw한다. `/chat`의 422 응답은 `detail` 배열의 각 항목 `msg`를 이어붙여 하나의 문자열로 만들고, 500 응답은 `detail` 문자열을 그대로 사용한다. 호출하는 쪽(App.jsx)은 형식 구분 없이 `error.message`만 사용하면 된다.

## 8. 컴포넌트-API 매핑 표

| 컴포넌트 | 연동 함수(chatApi.js) | 시점 |
|---|---|---|
| App (마운트 시) | `fetchModels` | 최초 렌더링 시 1회 호출해 `modelOptions` 상태 채움 |
| ChatInput → App | `sendChatMessage` | 사용자가 메시지 전송 시 |
| SettingsPanel | 없음 | 값 변경은 App의 상태만 갱신, 직접 API 호출 없음 |
| MessageList / MessageBubble | 없음 | App의 `messages` 상태를 props로 받아 렌더링만 담당 |

## 9. 기능 요구사항

1. App 마운트 시 `chatApi.fetchModels()`를 호출해 `modelOptions`를 채우고, `SettingsPanel`의 모델 드롭다운에 전달한다.
2. `SettingsPanel`의 각 입력(모델/시스템 프롬프트/Temperature/Top P/Num Predict)이 변경되면 App의 해당 상태를 갱신한다.
3. `ChatInput`에서 메시지를 전송하면(Enter 키 또는 버튼 클릭) 해당 메시지를 `{ role: "user", content }`로 `messages`에 즉시 추가한다.
4. 전송과 동시에 `chatApi.sendChatMessage`를 현재 `model`, `systemPrompt`, `temperature`, `topP`, `numPredict` 값과 함께 호출한다.
5. 요청이 진행 중인 동안 `isLoading`을 true로 두어 `ChatInput`의 전송 버튼이 "응답 생성 중..."으로 표시되고 비활성화된다.
6. 응답이 도착하면 `{ role: "assistant", content: response.message }`를 `messages`에 추가하고 `isLoading`을 false로 되돌린다.
7. `ChatWindow`의 "대화 초기화" 버튼을 클릭하면 확인 절차 없이 즉시 `messages`를 빈 배열로 초기화한다(백엔드 호출 없음).
8. `/chat` 요청은 대화 히스토리를 포함하지 않고 최신 사용자 메시지만 전송한다(백엔드가 세션을 기억하지 않으므로).

## 10. 예외 처리

| 상태 | 처리 |
|---|---|
| 로딩(모델 목록) | `fetchModels` 진행 중에는 모델 드롭다운을 비활성화하고 "불러오는 중..." 표시. 실패 시 재시도 버튼 없이 에러 문구만 표시한다 |
| 로딩(응답 대기) | `ChatInput` 전송 버튼을 "응답 생성 중..."으로 표시하고 비활성화, 중복 전송 방지 |
| 에러(`/chat` 실패, 422/500 공통) | `chatApi.js`가 422(배열)와 500(문자열) 응답을 모두 사람이 읽을 수 있는 메시지로 변환하므로, 형식 구분 없이 동일한 방식으로 `error` 상태에 저장하고 채팅 영역에 에러 메시지를 표시한다. 방금 보낸 사용자 메시지는 목록에 그대로 남긴다 |
| 빈 상태(대화 없음) | `messages`가 빈 배열이면 `MessageList`에 "메시지를 입력해 대화를 시작하세요" 문구를 표시한다 |

## 11. 범위 밖

- `backend/` 코드 수정 (CORS 설정 변경 포함)
- `chat_ui_설계도.jpg`에 없는 화면/기능 (로그인, 대화 저장/불러오기, 다크모드 등)
- 공통 파일 구조에 없는 파일/폴더 생성 (예: 별도 상태관리 라이브러리 도입, 추가 컴포넌트 분리 등)
- 대화 히스토리를 서버가 기억하도록 만드는 기능 (`backend/` 수정이 필요해 범위 밖)
- 스트리밍 응답 UI(타이핑 효과) — 백엔드가 비스트리밍이라 해당 없음

## 12. 확인 필요

(현재 확인 필요 항목 없음 — 이전에 있던 7개 항목은 모두 사용자 결정으로 해결되어 관련 섹션에 반영함)
