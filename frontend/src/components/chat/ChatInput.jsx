import { useState } from "react";

/**
 * Chat input box
 */
function ChatInput({ onSend, loading }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    onSend(input.trim());
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex gap-2">
      <input
        type="text"
        className="form-control"
        placeholder="Ask a question..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={loading}
        aria-label="Ask a question"
      />

      <button
        type="submit"
        className="btn btn-primary px-4"
        disabled={loading || !input.trim()}
      >
        {loading ? (
          <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          />
        ) : (
          "Send"
        )}
      </button>
    </form>
  );
}

export default ChatInput;