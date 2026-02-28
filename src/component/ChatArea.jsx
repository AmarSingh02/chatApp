/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import InputBar from "./InputBox";
import Message from "./Message";
import ScrollToTop from "./ScrollToTop";


export default function ChatArea({ chat, onSend, theme, setTheme, loading }) {
  const [lastChat, setLastChat] = useState(chat);

  // remember the most recent non-null chat so we can render it while a new one
  // is being created or during a brief state transition
  useEffect(() => {
    if (chat) {
      setLastChat(chat);
    }
  }, [chat]);

  const displayChat = chat || lastChat;

  return (
    <main className="chat-area">
      <header className="top-bar">
        <span>What's up, User?</span>
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>

      <div className="messages">
        {!displayChat && !loading && <h2 className="empty">Start a new chat 👋</h2>}
        {displayChat?.messages.map((m) => (
          <Message key={m.id} {...m} />
        ))}

        {loading && (
          <div className="loader">
            <span>Thinking...</span>
          </div>
        )}
      </div>

      <InputBar onSend={onSend} disabled={loading} />

       <ScrollToTop />
    </main>
  );
}