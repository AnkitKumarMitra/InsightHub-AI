import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

/**
 * Chat message list container
 */
function ChatWindow({ messages, children }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, children]);

  return (
    <div className="flex-grow-1 overflow-auto pe-2">
      {messages.length === 0 ? (
        <div className="h-100 d-flex align-items-center justify-content-center text-muted">
          Ask your first question to get started 👋
        </div>
      ) : (
        messages.map((msg, index) => (
          <MessageBubble
            key={index}
            role={msg.role}
            content={msg.content}
          />
        ))
      )}

      {/* Extra UI like typing indicator */}
      {children}

      <div ref={bottomRef} />
    </div>
  );
}

export default ChatWindow;