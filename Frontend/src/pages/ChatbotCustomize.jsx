import React, { useEffect } from "react";
import "../styles/ChatBotCustomize.css";
import { useChatBotSettings } from "../contexts/ChatBotSettingsContext";

const ChatBotCustomize = () => {
  const { settings, setSettings } = useChatBotSettings();

  const handleColorChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleMessageChange = (index, value) => {
    const updatedMessages = [...settings.messages];
    updatedMessages[index] = value;
    setSettings((prev) => ({ ...prev, messages: updatedMessages }));
  };

  const addMessage = () => {
    setSettings((prev) => ({
      ...prev,
      messages: [...prev.messages, ""],
    }));
  };

  const removeMessage = (index) => {
    const updatedMessages = settings.messages.filter((_, i) => i !== index);
    setSettings((prev) => ({ ...prev, messages: updatedMessages }));
  };

  const handleFormFieldChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      formFields: { ...prev.formFields, [field]: value },
    }));
  };

  const handleWelcomeChange = (value) => {
    setSettings((prev) => ({ ...prev, welcomeMessage: value }));
  };

  const handleTimerChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      missedChatTimer: {
        ...prev.missedChatTimer,
        [field]: parseInt(value) || 0,
      },
    }));
  };

  useEffect(() => {
    localStorage.setItem("chatbot-settings", JSON.stringify(settings));
  }, [settings]);

  return (
    <div className="chatbot-page">
      <div className="chatbot-preview">
        <div className="chat-window">
          <div
            className="chat-header"
            style={{ backgroundColor: settings.headerColor }}>
            Hubly
          </div>
          <div
            className="chat-body"
            style={{ backgroundColor: settings.backgroundColor }}>
            {settings.messages.map((msg, idx) => (
              <div className="chat-message" key={idx}>
                {msg}
              </div>
            ))}
            <div className="chat-form">
              <p>
                <strong>Introduce Yourself</strong>
              </p>
              <input type="text" placeholder={settings.formFields.name} />
              <input type="text" placeholder={settings.formFields.phone} />
              <input type="email" placeholder={settings.formFields.email} />
              <button className="btn">Thank You!</button>
            </div>
          </div>
          <div className="chat-input-bar">
            Write a message <span>📩</span>
          </div>
        </div>

        <div className="welcome-popup">
          {settings.welcomeMessage}
          <span className="popup-close">×</span>
        </div>
      </div>

      <div className="chatbot-controls">
        <div className="control-section">
          <h3>Header Color</h3>
          <input
            type="color"
            value={settings.headerColor}
            onChange={(e) => handleColorChange("headerColor", e.target.value)}
          />
          <input type="text" value={settings.headerColor} readOnly />
        </div>

        <div className="control-section">
          <h3>Background Color</h3>
          <input
            type="color"
            value={settings.backgroundColor}
            onChange={(e) =>
              handleColorChange("backgroundColor", e.target.value)
            }
          />
          <input type="text" value={settings.backgroundColor} readOnly />
        </div>

        <div className="control-section">
          <h3>Customize Message</h3>
          {settings.messages.map((msg, index) => (
            <div key={index} style={{ display: "flex", gap: "5px" }}>
              <input
                type="text"
                value={msg}
                onChange={(e) => handleMessageChange(index, e.target.value)}
              />
              <button onClick={() => removeMessage(index)}>❌</button>
            </div>
          ))}
          <button onClick={addMessage} className="btn">
            ➕ Add Message
          </button>
        </div>

        <div className="control-section">
          <h3>Introduction Form</h3>
          <input
            type="text"
            placeholder="Name"
            value={settings.formFields.name}
            onChange={(e) => handleFormFieldChange("name", e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone"
            value={settings.formFields.phone}
            onChange={(e) => handleFormFieldChange("phone", e.target.value)}
          />
          <input
            type="text"
            placeholder="Email"
            value={settings.formFields.email}
            onChange={(e) => handleFormFieldChange("email", e.target.value)}
          />
          <button className="btn">Thank You!</button>
        </div>

        <div className="control-section">
          <h3>Welcome Message</h3>
          <textarea
            rows="3"
            value={settings.welcomeMessage}
            onChange={(e) => handleWelcomeChange(e.target.value)}
          />
        </div>

        <div className="control-section">
          <h3>Missed Chat Timer</h3>
          <div className="timer-inputs">
            <input
              type="number"
              value={settings.missedChatTimer.hours}
              onChange={(e) => handleTimerChange("hours", e.target.value)}
            />{" "}
            :{" "}
            <input
              type="number"
              value={settings.missedChatTimer.minutes}
              onChange={(e) => handleTimerChange("minutes", e.target.value)}
            />{" "}
            :{" "}
            <input
              type="number"
              value={settings.missedChatTimer.seconds}
              onChange={(e) => handleTimerChange("seconds", e.target.value)}
            />
          </div>
          <button className="btn">Save</button>
        </div>
      </div>
    </div>
  );
};

export default ChatBotCustomize;
