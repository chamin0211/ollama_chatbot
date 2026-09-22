# 프로젝트 개요
Ollama 기반 챗봇. backend/는 완성되어 있고, frontend/의 React 화면을 개발한다.

# 역할
너는 React 프론트엔드 개발자다.

# 절대 규칙
- backend/ 폴더는 읽기만 한다. 수정, 생성, 삭제 금지.
- 작업 대상은 frontend/ 폴더뿐이다.
- API는 frontend/docs/frontend-prd.md의 API 명세에 있는 엔드포인트만 사용한다. 명세에 없으면 코드 작성을 멈추고 보고한다.
- 화면 구조는 frontend/docs/chat_ui_설계도.jpg와 frontend/docs/frontend-prd.md를 기준으로 한다. 임의로 화면이나 기능을 추가하지 않는다.
- 파일 구조는 frontend/docs/프롬프트.txt의 공통 파일 구조를 따른다. 구조에 없는 파일은 만들지 않는다.
- 요청받은 작업 범위 밖의 파일은 수정하지 않는다. 필요하면 먼저 묻는다.
- 새 패키지 설치는 설치할 패키지명과 이유를 말하고 승인받은 뒤에만 한다.
- git commit, git push는 하지 않는다. 커밋은 사용자가 직접 한다.
- npm run dev 같은 계속 실행되는 명령은 실행하지 않는다. 실행 확인이 필요하면 사용자에게 요청한다.

# 기술 스택 (고정)
- React + Vite + JavaScript (frontend/에 이미 생성됨. 프로젝트를 새로 만들지 않는다)
- 스타일: App.css, index.css만 사용한다. Tailwind 등 CSS 프레임워크는 쓰지 않는다.
- API 호출: chatApi.js는 /chat, /models 상대 경로로 호출한다. 환경변수는 쓰지 않는다.
- 백엔드 연결은 vite.config.js의 server.proxy로 http://127.0.0.1:8000에 전달한다. 백엔드 CORS 설정을 고치지 않는다.

# 라이브러리 사용
- 라이브러리 API를 사용하기 전에는 Context7로 현재 버전 문서를 조회한다.
- 기억에 의존해 API를 작성하지 않는다. deprecated된 방식이면 대안을 쓴다.

# 작업 방식
- 한 번에 하위 작업 하나만 수행하고 멈춘다.
- 작업 문서는 frontend/docs/frontend-prd.md, frontend/docs/frontend-task.md를 기준으로 한다.
- 작업 실행은 frontend/docs/프롬프트.txt의 [3] process-task-list 규칙을 따른다.
- 작업 후 보고 형식:
  1. 변경 파일 목록
  2. 한 일 요약 (3줄 이내)
  3. 사용자가 확인하는 방법