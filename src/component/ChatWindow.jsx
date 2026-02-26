import React, { useEffect, useRef } from "react";
import Message from "./Message";
import InputBox from "./InputBox";

export default function ChatWindow({ messages, onSend }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-window">
        {messages.map((msg) => (
          <Message key={msg.id} {...msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      <InputBox onSend={onSend} />
    </div>
  );
}