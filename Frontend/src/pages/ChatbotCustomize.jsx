import React from "react";
import "../styles/ChatBotCustomize.css";

const ChatBotCustomize = () => {
  return (
    <div className="chatbot-page">
     
      <div className="chatbot-preview">
        <div className="chat-window">
          <div className="chat-header">Hubly</div>
          <div className="chat-body">
            <div className="chat-message">How can I help you?</div>
            <div className="chat-message">Ask me anything!</div>
            <div className="chat-form">
              <p><strong>Introduce Yourself</strong></p>
              <input type="text" placeholder="Your name" />
              <input type="text" placeholder="+1 (000) 000-0000" />
              <input type="email" placeholder="example@gmail.com" />
              <button className="btn">Thank You!</button>
            </div>
          </div>
          <div className="chat-input-bar">Write a message <span>📩</span></div>
        </div>

        <div className="welcome-popup">
          👋 Want to chat about Hubly? I'm a chatbot here to help you find your way.
          <span className="popup-close">×</span>
        </div>
      </div>

     
      <div className="chatbot-controls">
        <div className="control-section">
          <h3>Header Color</h3>
          <div className="color-options">
            <div className="color white"></div>
            <div className="color black"></div>
            <div className="color blue selected"></div>
            <input type="text" value="#33475B" readOnly />
          </div>
        </div>

        <div className="control-section">
          <h3>Custom Background Color</h3>
          <div className="color-options">
            <div className="color white selected"></div>
            <div className="color black"></div>
            <input type="text" value="#EEEEEE" readOnly />
          </div>
        </div>

        <div className="control-section">
          <h3>Customize Message</h3>
          <input type="text" defaultValue="How can I help you?" />
          <input type="text" defaultValue="Ask me anything!" />
        </div>

        <div className="control-section">
          <h3>Introduction Form</h3>
          <input type="text" defaultValue="Your name" />
          <input type="text" defaultValue="+1 (000) 000-0000" />
          <input type="text" defaultValue="example@gmail.com" />
          <button className="btn">Thank You!</button>
        </div>

        <div className="control-section">
          <h3>Welcome Message</h3>
          <textarea rows="3" defaultValue="👋 Want to chat about Hubly? I'm a chatbot here to help you find your way." />
        </div>

        <div className="control-section">
          <h3>Missed Chat Timer</h3>
          <div className="timer-inputs">
            <input type="number" defaultValue="12" /> :
            <input type="number" defaultValue="09" /> :
            <input type="number" defaultValue="59" />
          </div>
          <button className="btn">Save</button>
        </div>
      </div>
    </div>
  );
};

export default ChatBotCustomize;
