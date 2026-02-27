export default function Message({ role, content }) {
  return (
    <div className={`msg ${role}`}>
      {content}
      <style>{`
        .msg {
          max-width: 75%;
          padding: 10px 12px;
          border-radius: 8px;
          line-height: 1.4;
        }
        .msg.user {
          background: var(--message-user-bg);
          margin-left: auto;
          color: var(--text-primary);
        }
        .msg.bot {
          background: var(--message-bot-bg);
          margin-right: auto;
          color: var(--text-primary);
          border: 1px solid var(--border-color);
        }
      `}</style>
    </div>
  );
}

