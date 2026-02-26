import { useState } from "react";

export default function InputBar({ onSend, disabled }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    // if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="input-bar">
      <input
      
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Send a message..."
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button onClick={handleSend} >
        Send
      </button>
    </div>
  );
}