import React, { createContext, useState, useContext, useEffect } from "react";

const ChatBotSettingsContext = createContext();

export const useChatBotSettings = () => useContext(ChatBotSettingsContext);

export const ChatBotSettingsProvider = ({ children }) => {
  const defaultSettings = {
    headerColor: "#33475B",
    backgroundColor: "#f4f4f4",
    messages: ["How can I help you?", "Ask me anything!"],
    welcomeMessage:
      "👋 Want to chat about Hubly? I'm a chatbot here to help you find your way.",
    formFields: {
      name: "Your name",
      phone: "+1 (000) 000-0000",
      email: "example@gmail.com",
    },
    missedChatTimer: { hours: 0, minutes: 1, seconds: 0 },
  };

  const [settings, setSettings] = useState(() => {
    const stored = localStorage.getItem("chatbot-settings");
    return stored ? JSON.parse(stored) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem("chatbot-settings", JSON.stringify(settings));
  }, [settings]);

  return (
    <ChatBotSettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </ChatBotSettingsContext.Provider>
  );
};
