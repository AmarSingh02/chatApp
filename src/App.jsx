import React, { useEffect, useState } from "react";
import Sidebar from "./component/Sidebar";
import ChatArea from "./component/ChatArea";
import "./App.css";

const STORAGE_KEY = "ai_chat_conversations";

export default function App() {
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [activeId, setActiveId] = useState(null);
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations]);

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "Your Chat",
      messages: [],
    };
    setConversations((prev) => [newChat, ...prev]);
    setActiveId(newChat.id);
  };

  const activeChat = conversations.find((c) => c.id === activeId);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    let chatId = activeId;

    // If no active chat, create one
    if (!activeChat) {
      chatId = Date.now();
      const newChat = {
        id: chatId,
        title: text.length > 30 ? text.slice(0, 30) + "..." : text,
        messages: [],
      };
      setConversations((prev) => [newChat, ...prev]);
      setActiveId(chatId);
    }

    const userMsg = { id: Date.now(), role: "user", content: text };

    setConversations((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, userMsg] }
          : chat
      )
    );

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: text }],
        }),
      });

      const data = await res.json();

      const botMsg = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.reply,
      };

      setConversations((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? { ...chat, messages: [...chat.messages, botMsg] }
            : chat
        )
      );
    } catch (err) {
      console.error("Chat API error:", err);

      const errorMsg = {
        id: Date.now() + 2,
        role: "assistant",
        content: " Failed to get response from AI.",
      };

      setConversations((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? { ...chat, messages: [...chat.messages, errorMsg] }
            : chat
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`app ${theme}`}>
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onNewChat={createNewChat}
        onSelect={setActiveId}
      />

      <ChatArea
        chat={activeChat}
        onSend={sendMessage}
        theme={theme}
        setTheme={setTheme}
        loading={loading}
      />
    </div>
  );
}