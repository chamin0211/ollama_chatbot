import { useState } from "react"

function ChatInput({ onSend, isLoading }) {
  const [inputValue, setInputValue] = useState("")

  const handleSend = () => {
    const trimmed = inputValue.trim()
    if (!trimmed || isLoading) {
      return
    }
    onSend(trimmed)
    setInputValue("")
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-input">
      <input
        type="text"
        className="chat-input__field"
        placeholder="메시지를 입력하세요"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      <button
        type="button"
        className="chat-input__button"
        onClick={handleSend}
        disabled={isLoading}
      >
        {isLoading ? "응답 생성 중..." : "전송"}
      </button>
    </div>
  )
}

export default ChatInput
