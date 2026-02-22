import { useState } from "react";
import ChatWindow from "../components/chat/ChatWindow";
import ChatInput from "../components/chat/ChatInput";
import { askQuestion } from "../api/chat.api";
import TypingIndicator from "../components/chat/TypingIndicator";

/**
 * Chat page (AI assistant)
 */
function Chat() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSend = async (question) => {
        setError("");

        // Add user message immediately
        setMessages((prev) => [
            ...prev,
            { role: "user", content: question },
        ]);

        try {
            setLoading(true);

            const answer = await askQuestion(question);

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: answer },
            ]);
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Something went wrong. Please try again."
            );

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "⚠️ I couldn’t process your request right now. Please try again.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-12 col-lg-10 col-xl-8">
                {/* Page Header */}
                <div className="mb-4">
                    <h4 className="fw-bold mb-1">AI Knowledge Assistant</h4>
                    <p className="text-muted mb-0">
                        Ask questions based on your uploaded documents
                    </p>
                </div>

                {/* Chat Card */}
                <div
                    className="card shadow-sm border-0"
                    style={{ minHeight: "65vh" }}
                >
                    <div className="card-body d-flex flex-column">
                        {/* Messages */}
                        <ChatWindow messages={messages}>
                            {loading && <TypingIndicator />}
                        </ChatWindow>

                        {/* Error */}
                        {error && (
                            <div className="alert alert-danger py-2 mt-2">
                                {error}
                            </div>
                        )}

                        {/* Input */}
                        <div className="mt-3">
                            <ChatInput onSend={handleSend} loading={loading} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;