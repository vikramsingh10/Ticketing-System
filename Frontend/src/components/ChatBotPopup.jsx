import React, { useState } from "react";
import "../styles/ChatBotPopup.css";
import { addTicket } from "../services/ticketService";

const ChatBotPopup = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(true);
  const [messages, setMessages] = useState([]);
  const [firstMessageContent, setFirstMessageContent] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [currentInput, setCurrentInput] = useState("");

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    setIsWelcomeVisible(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    const message = currentInput.trim();
    const newMsg = { content: message, sender: "user" };
    setMessages((prev) => [...prev, newMsg]);

    if (!firstMessageContent) {
      setFirstMessageContent(message);
      setIsFormVisible(true);
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "Thanks! Can you please provide your details?",
            isUser: false,
          },
        ]);
      }, 500);
    } else {
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "We will get back to you shortly!", isUser: false },
        ]);
      }, 500);
    }

    setCurrentInput("");
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const newTicket = {
      ...userDetails,
      title: firstMessageContent,
      description: firstMessageContent,
      status: "unresolved",
    };

    try {
      await addTicket(newTicket);
      setIsFormVisible(false);
    } catch (error) {
      console.error("Error submitting ticket:", error);
    }
  };

  return (
    <>
      {isChatOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <img
                src="./assets/bot-icon.png"
                alt="Chatbot"
                className="bot-icon"
              />
              <span>Hubly</span>
            </div>
            <button className="close-btn" onClick={toggleChat}>
              ×
            </button>
          </div>

          <div className="chatbot-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chatbot-message ${
                  msg.sender === "user" ? "user-msg" : "bot-msg"
                }`}>
                {msg.content}
              </div>
            ))}

            {isFormVisible && (
              <div className="chatbot-form">
                <img
                  src="./assets/bot-icon.png"
                  alt="Chatbot"
                  className="bot-icon"
                />
                <div>
                  <h4>Introduce Yourself</h4>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={userDetails.name}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, name: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Your Phone"
                    value={userDetails.phone}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, phone: e.target.value })
                    }
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={userDetails.email}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, email: e.target.value })
                    }
                  />
                  <button className="submit-btn" onClick={handleSubmitForm}>
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="chatbot-footer">
            <form onSubmit={handleSendMessage} style={{ display: "flex" }}>
              <input
                type="text"
                placeholder="Write a message"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
              />
              <button type="submit" className="send-btn">
                ➤
              </button>
            </form>
          </div>
        </div>
      )}

      {isWelcomeVisible && (
        <div className="chatbot-popup">
          <div className="chatbot-header-popup">
            <img
              src="./assets/bot-icon.png"
              alt="Chatbot"
              className="bot-icon"
            />
            <button
              className="close-btn"
              onClick={() => setIsWelcomeVisible(false)}>
              ×
            </button>
          </div>
          <div className="chatbot-body-popup">
            <p>
              👋 Want to chat about Hubly? I'm a chatbot here to help you find
              your way.
            </p>
          </div>
        </div>
      )}

      <button className="chatbot-toggle-btn" onClick={toggleChat}>
        <img src="./assets/chat-icon.png" alt="Open Chat" />
      </button>
    </>
  );
};

export default ChatBotPopup;
