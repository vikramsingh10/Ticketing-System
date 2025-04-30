import React, { useState } from "react";
import "../styles/ChatBotCustomize.css";

const ChatBotCustomize = ({ setHeaderColor, setBgColor, setMessages, setFormPlaceholders, setWelcomeMessage }) => {
  const [headerColor, setHeaderColorState] = useState("#33475B");
  const [bgColor, setBgColorState] = useState("#EEEEEE");
  const [customMessage1, setCustomMessage1] = useState("How can I help you?");
  const [customMessage2, setCustomMessage2] = useState("Ask me anything!");
  const [formPlaceholderName, setFormPlaceholderName] = useState("Your name");
  const [formPlaceholderPhone, setFormPlaceholderPhone] = useState("+1 (000) 000-0000");
  const [formPlaceholderEmail, setFormPlaceholderEmail] = useState("example@gmail.com");
  const [welcomeMessage, setWelcomeMessageState] = useState("👋 Want to chat about Hubly? I'm a chatbot here to help you find your way.");

  const handleHeaderColorChange = (color) => {
    setHeaderColorState(color);
    setHeaderColor(color);
  };

  const handleBgColorChange = (color) => {
    setBgColorState(color);
    setBgColor(color);
  };

  const handleCustomMessageChange = (message, index) => {
    if (index === 1) {
      setCustomMessage1(message);
      setMessages(prev => prev.map(msg => msg.index === 1 ? { ...msg, content: message } : msg));
    } else if (index === 2) {
      setCustomMessage2(message);
      setMessages(prev => prev.map(msg => msg.index === 2 ? { ...msg, content: message } : msg));
    }
  };

  const handleFormPlaceholderChange = (field, value) => {
    if (field === 'name') {
      setFormPlaceholderName(value);
      setFormPlaceholders(prev => ({ ...prev, name: value }));
    } else if (field === 'phone') {
      setFormPlaceholderPhone(value);
      setFormPlaceholders(prev => ({ ...prev, phone: value }));
    } else if (field === 'email') {
      setFormPlaceholderEmail(value);
      setFormPlaceholders(prev => ({ ...prev, email: value }));
    }
  };

  const handleWelcomeMessageChange = (message) => {
    setWelcomeMessageState(message);
    setWelcomeMessage(message);
  };

  return (
    <div className="chatbot-page">
      <div className="chatbot-preview">
        <div className="chat-window" style={{ backgroundColor: bgColor }}>
          <div className="chat-header" style={{ backgroundColor: headerColor }}>Hubly</div>
          <div className="chat-body">
            <div className="chat-message">{customMessage1}</div>
            <div className="chat-message">{customMessage2}</div>
            <div className="chat-form">
              <p><strong>Introduce Yourself</strong></p>
              <input
                type="text"
                value={formPlaceholderName}
                onChange={(e) => handleFormPlaceholderChange('name', e.target.value)}
                placeholder={formPlaceholderName}
              />
              <input
                type="text"
                value={formPlaceholderPhone}
                onChange={(e) => handleFormPlaceholderChange('phone', e.target.value)}
                placeholder={formPlaceholderPhone}
              />
              <input
                type="email"
                value={formPlaceholderEmail}
                onChange={(e) => handleFormPlaceholderChange('email', e.target.value)}
                placeholder={formPlaceholderEmail}
              />
              <button className="btn">Thank You!</button>
            </div>
          </div>
          <div className="chat-input-bar">Write a message <span>📩</span></div>
        </div>
        <div className="welcome-popup">
          {welcomeMessage}
          <span className="popup-close">×</span>
        </div>
      </div>

      <div className="chatbot-controls">
        <div className="control-section">
          <h3>Header Color</h3>
          <div className="color-options">
            <div
              className="color white"
              onClick={() => handleHeaderColorChange('white')}
            ></div>
            <div
              className="color black"
              onClick={() => handleHeaderColorChange('black')}
            ></div>
            <div
              className="color blue"
              onClick={() => handleHeaderColorChange('#33475B')}
            ></div>
            <input type="text" value={headerColor} readOnly />
          </div>
        </div>

        <div className="control-section">
          <h3>Custom Background Color</h3>
          <div className="color-options">
            <div
              className="color white"
              onClick={() => handleBgColorChange('white')}
            ></div>
            <div
              className="color black"
              onClick={() => handleBgColorChange('black')}
            ></div>
            <input type="text" value={bgColor} readOnly />
          </div>
        </div>

        <div className="control-section">
          <h3>Customize Message</h3>
          <input
            type="text"
            value={customMessage1}
            onChange={(e) => handleCustomMessageChange(e.target.value, 1)}
          />
          <input
            type="text"
            value={customMessage2}
            onChange={(e) => handleCustomMessageChange(e.target.value, 2)}
          />
        </div>

        <div className="control-section">
          <h3>Introduction Form</h3>
          <input
            type="text"
            value={formPlaceholderName}
            onChange={(e) => handleFormPlaceholderChange('name', e.target.value)}
          />
          <input
            type="text"
            value={formPlaceholderPhone}
            onChange={(e) => handleFormPlaceholderChange('phone', e.target.value)}
          />
          <input
            type="text"
            value={formPlaceholderEmail}
            onChange={(e) => handleFormPlaceholderChange('email', e.target.value)}
          />
          <button className="btn">Thank You!</button>
        </div>

        <div className="control-section">
          <h3>Welcome Message</h3>
          <textarea
            rows="3"
            value={welcomeMessage}
            onChange={(e) => handleWelcomeMessageChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatBotCustomize;
