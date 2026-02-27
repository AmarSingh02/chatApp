import InputBar from "./InputBox";
import Message from "./Message";


export default function ChatArea({ chat, onSend, theme, setTheme, loading }) {
  return (
    <main className="chat-area">
      <header className="top-bar">
        <span>What's up, User?</span>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </header>

      <div className="messages">
        {!chat && <h2 className="empty">Start a new chat 👋</h2>}
        {chat?.messages.map((m) => (
          <Message key={m.id} {...m} />
        ))}

        {loading && (
          <div className="loader">
            <span>Thinking...</span>
          </div>
        )}
      </div>

      <InputBar onSend={onSend} disabled={loading} />
    </main>
  );
}