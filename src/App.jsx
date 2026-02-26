import React, { useEffect, useState } from "react";
import Sidebar from "./component/Sidebar";
import ChatArea from "./component/ChatArea";
import './App.css'

const STORAGE_KEY = "ai_chat_conversations";

export default function App() {
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [activeId, setActiveId] = useState(null);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations]);

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "Your Chat ",
      messages: [],
    };
    setConversations((prev) => [newChat, ...prev]);
    setActiveId(newChat.id);
  };

  const activeChat = conversations.find((c) => c.id === activeId);


  const sendMessage = (text) => {
    // If no active chat, create a new one
    if (!activeChat) {
      const chatId = Date.now();
      const userMsg = { id: Date.now() + 1, role: "user", text };
      
      const newChat = {
        id: chatId,
        title: text.length > 30 ? text.slice(0, 30) + '...' : text, // First message as title
        messages: [userMsg],
      };
      
      setConversations((prev) => [newChat, ...prev]);
      setActiveId(chatId);
      
      // Bot reply
      setTimeout(() => {
        const botMsg = {
          id: Date.now() + 2,
          role: "bot",
          text: " Dummy Text reply (API can be added later for the response) ",
        };
        
        setConversations((prev) =>
          prev.map((chat) =>
            chat.id === chatId
              ? { ...chat, messages: [...chat.messages, botMsg] }
              : chat
          )
        );
      }, 700);
      
      return;
    }

    // Add message to existing chat
    const userMsg = { id: Date.now(), role: "user", text };

    setConversations((prev) =>
      prev.map((chat) => {
        if (chat.id === activeId) {
          const isFirstMessage = chat.messages.length === 0;

          return {
            ...chat,
            title: isFirstMessage ? (text.length > 30 ? text.slice(0, 25) + '...' : text) : chat.title,
            messages: [...chat.messages, userMsg],
          };
        }
        return chat;
      })
    );

    setTimeout(() => {
      const botMsg = {
        id: Date.now() + 1,
        role: "bot",
        text: "🤖 Dummy AI reply (API can be added later)",
      };

      setConversations((prev) =>
        prev.map((chat) =>
          chat.id === activeId
            ? { ...chat, messages: [...chat.messages, botMsg] }
            : chat
        )
      );
    }, 700);
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
      />
    </div>
  );
}