
import React, { useMemo } from 'react'
import './style.css'

export default function Sidebar({ conversations = [], activeId, onNewChat, onSelect, searchQuery, onSearchChange }) {
  const query = searchQuery || ''

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return conversations
    return conversations.filter((c) => (c.title || '').toLowerCase().includes(q))
  }, [conversations, query])

  return (
    <aside className="sidebar">
      <h2>MY LLM</h2>

      <button className="new-chat" onClick={onNewChat}>
        + New Chat
      </button>

      <input
        className="search"
        placeholder="Search chats..."
        value={query}
        onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
      />

      <div className="chat-list">
        {filtered.length === 0 && <div className="empty">No chats found</div>}

        {filtered.map((chat) => (
          <div
            key={chat.id}
            className={`chat-item ${activeId === chat.id ? 'active' : ''}`}
            onClick={() => onSelect(chat.id)}
          >
            {chat.title}
          </div>
        ))}
      </div>
    </aside>
  )
}