import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./ChatBot.css";

const ChatBot = ({ userId }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
   {
  sender: "bot",
  text: `Hi 👋 I’m your Portfolio Assistant.

You can ask me:
• How is my portfolio?
• Am I in profit?
• What is today’s gain?
• Which is my best stock?
• Show my recent orders`
}
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
  if (!input.trim() || loading) return;

  const userMessage = { sender: "user", text: input };
  setMessages((prev) => [...prev, userMessage]);
  setInput("");
  setLoading(true);

  try {
    const res = await axios.post("http://localhost:5000/api/chat", {
      message: input,
      userId
    });

    const botMessage = { sender: "bot", text: res.data.reply };
    setMessages((prev) => [...prev, botMessage]);
  } catch (err) {
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "⚠️ Something went wrong." }
    ]);
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
            Portfolio Assistant
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message-row ${
                  msg.sender === "user" ? "user" : "bot"
                }`}
              >
                <div className="message-bubble">
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="message-row bot">
                <div className="message-bubble">
                  Typing...
                </div>
              </div>
            )}

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