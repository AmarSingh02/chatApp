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
  const [searchQuery, setSearchQuery] = useState(() => {
    return localStorage.getItem('chat_search') || '';
  });


  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('chat_search', searchQuery);
  }, [searchQuery]);

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

  // const sendMessage = async (text) => {
  //   if (!text.trim()) return;

  //   let chatId = activeId;

  //   // If no active chat, create one
  //   if (!activeChat) {
  //     chatId = Date.now();
  //     const newChat = {
  //       id: chatId,
  //       title: text.length > 30 ? text.slice(0, 30) + "..." : text,
  //       messages: [],
  //     };
  //     setConversations((prev) => [newChat, ...prev]);
  //     setActiveId(chatId);
  //   }

  //   const userMsg = { id: Date.now(), role: "user", content: text };

  //   setConversations((prev) =>
  //     prev.map((chat) =>
  //       chat.id === chatId
  //         ? { ...chat, messages: [...chat.messages, userMsg] }
  //         : chat
  //     )
  //   );

  //   setLoading(true);

  //   try {
  //     const res = await fetch("http://localhost:3000/api/chat", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         messages: [{ role: "user", content: text }],
  //       }),
  //     });

  //     const data = await res.json();

  //     const botMsg = {
  //       id: Date.now() + 1,
  //       role: "assistant",
  //       content: data.reply,
  //     };

  //     setConversations((prev) =>
  //       prev.map((chat) =>
  //         chat.id === chatId
  //           ? { ...chat, messages: [...chat.messages, botMsg] }
  //           : chat
  //       )
  //     );
  //   } catch (err) {
  //     console.error("Chat API error:", err);

  //     const errorMsg = {
  //       id: Date.now() + 2,
  //       role: "assistant",
  //       content: " Failed to get response from AI.",
  //     };

  //     setConversations((prev) =>
  //       prev.map((chat) =>
  //         chat.id === chatId
  //           ? { ...chat, messages: [...chat.messages, errorMsg] }
  //           : chat
  //       )
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const sendMessage = async (text) => {
  if (!text.trim()) return;

  let chatId = activeId || Date.now();
  const botId = Date.now() + 1;

  // Create new chat if needed
  if (!activeChat) {
    const newChat = {
      id: chatId,
      title: text.length > 30 ? text.slice(0, 30) + "..." : text,
      messages: [],
    };
    setConversations((prev) => [newChat, ...prev]);
    setActiveId(chatId);
  }

  const userMsg = { id: Date.now(), role: "user", content: text };
  const emptyBotMsg = { id: botId, role: "assistant", content: "" };

  // Optimistically add user + empty bot message
  setConversations((prev) =>
    prev.map((chat) =>
      chat.id === chatId
        ? { ...chat, messages: [...chat.messages, userMsg, emptyBotMsg] }
        : chat
    )
  );

  setLoading(true);

  try {
    const chatForContext =
      activeChat?.messages?.slice(-10) || []; // 🧠 memory trim (safe fallback)

    const res = await fetch("http://localhost:3000/api/chat-stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [...chatForContext, { role: "user", content: text }],
      }),
    });

    if (!res.body) throw new Error("No response body");

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      setConversations((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: chat.messages.map((m) =>
                  m.id === botId ? { ...m, content: m.content + chunk } : m
                ),
              }
            : chat
        )
      );
    }
  } catch (err) {
    console.error("Streaming error:", err);

    setConversations((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: chat.messages.map((m) =>
                m.id === botId
                  ? { ...m, content: "❌ Failed to get response from AI." }
                  : m
              ),
            }
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
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
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