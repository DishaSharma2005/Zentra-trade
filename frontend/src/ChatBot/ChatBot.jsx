import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "./ChatBot.css";

const ChatBot = ({ userId }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: `Hi 👋 I'm your AI Portfolio Assistant.

I can provide tailored financial advice based on your live portfolio, help you strategize your investments, or explain trading concepts.

What's on your mind today?`
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { sender: "user", text: input };
    const chatHistory = [...messages, userMessage];
    setMessages(chatHistory);
    setInput("");
    setLoading(true);

    // Add empty bot message that will be streamed into
    setMessages((prev) => [...prev, { sender: "bot", text: "" }]);

    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          history: chatHistory.slice(1).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
          userId,
        }),
      });

      if (!response.ok) throw new Error("HTTP Error " + response.status);
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let buffer = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() || "";

          for (const line of parts) {
            if (line.startsWith("data: ")) {
              const dataStr = line.substring(6);
              if (dataStr === "[DONE]") {
                done = true;
                break;
              }
              try {
                const data = JSON.parse(dataStr);
                setMessages((prev) => {
                  const updated = [...prev];
                  const lastMsg = updated[updated.length - 1];
                  updated[updated.length - 1] = {
                    ...lastMsg,
                    text: lastMsg.text + data.text,
                  };
                  return updated;
                });
              } catch (e) {
                console.error("Error parsing stream data", e);
              }
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          sender: "bot",
          text: "⚠️ Something went wrong connecting to the AI.",
        };
        return updated;
      });
    }

    setLoading(false);
  };
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <>
      {/* Floating Button */}
      <div className="chat-toggle" onClick={() => setOpen(!open)}>
        💬
      </div>

      {/* Chat Window */}
      {open && (
        <div className="chat-container">
          <div className="chat-header">
            Portfolio AI Advisor
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message-row ${msg.sender === "user" ? "user" : "bot"
                  }`}
              >
                <div className="message-bubble">
                  {msg.sender === "bot" ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}



            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;