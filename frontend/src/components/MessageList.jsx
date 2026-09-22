import MessageBubble from "./MessageBubble"

function MessageList({ messages }) {
  if (messages.length === 0) {
    return (
      <div className="message-list message-list--empty">
        <p className="message-list__empty-text">메시지를 입력해 대화를 시작하세요</p>
      </div>
    )
  }

  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <MessageBubble key={index} role={message.role} content={message.content} />
      ))}
    </div>
  )
}

export default MessageList
