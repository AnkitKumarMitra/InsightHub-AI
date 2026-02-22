/**
 * Message bubble for chat
 * @param {Object} props
 * @param {"user" | "assistant"} props.role
 * @param {string} props.content
 */
function MessageBubble({ role, content }) {
  const isUser = role === "user";

  return (
    <div
      className={`d-flex mb-3 ${
        isUser ? "justify-content-end" : "justify-content-start"
      }`}
    >
      <div
        className={`px-3 py-2 rounded-3 ${
          isUser
            ? "bg-primary text-white"
            : "bg-white border text-dark"
        }`}
        style={{
          maxWidth: "80%",
          whiteSpace: "pre-wrap",
          lineHeight: "1.5",
        }}
        aria-label={isUser ? "User message" : "Assistant message"}
      >
        {content}
      </div>
    </div>
  );
}

export default MessageBubble;