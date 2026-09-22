import MessageList from "./MessageList"
import ChatInput from "./ChatInput"

function ChatWindow({ messages, onSendMessage, onReset, isLoading, error }) {
  return (
    <div className="chat-window">
      <div className="chat-window__header">
        <div className="chat-window__title-group">
          <h1 className="chat-window__title">Local LLM Chat</h1>
          <p className="chat-window__subtitle">React + FastAPI + Ollama 기반 로컬 AI 채팅 앱</p>
        </div>
        <button type="button" className="chat-window__reset-button" onClick={onReset}>
          대화 초기화
        </button>
      </div>

      <MessageList messages={messages} />

      {error && <p className="chat-window__error">{error}</p>}

      <ChatInput onSend={onSendMessage} isLoading={isLoading} />
    </div>
  )
}

export default ChatWindow
