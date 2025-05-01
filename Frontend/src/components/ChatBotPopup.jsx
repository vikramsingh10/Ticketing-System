import React, { useState, useEffect } from "react";
import "../styles/ChatBotPopup.css";
import { addTicket } from "../services/ticketService";
import { useSocket } from "../contexts/SocketContext";
import { useChatBotSettings } from "../contexts/ChatBotSettingsContext";

const ChatBotPopup = () => {
  const { settings } = useChatBotSettings();
  const socket = useSocket();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(true);
  const [messages, setMessages] = useState(
    settings.messages.map((msg) => ({ content: msg, sender: "chatbot" }))
  );
  const [firstMessageContent, setFirstMessageContent] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [currentInput, setCurrentInput] = useState("");
  const [ticketId, setTicketId] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [responseReceived, setResponseReceived] = useState(false);

  const [errors, setErrors] = useState({
    phone: "",
    email: "",
  });

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    setIsWelcomeVisible(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    const message = currentInput.trim();
    const newMsg = { content: message, sender: "user" };

    if (socket) {
      socket.emit("send_message", {
        message: newMsg,
        ticketId,
      });
    }
    
    setMessages((prevMessages) => [...prevMessages, newMsg]);

    if (!firstMessageContent) {
      setFirstMessageContent(message);
      setIsFormVisible(true);

      setTimeout(() => {
        const chatbotMessage = {
          content: "Thanks! Can you please provide your details?",
          sender: "chatbot",
        };
        setMessages((prevMessages) => [...prevMessages, chatbotMessage]);

        if (socket) {
          socket.emit("send_message", {
            message: chatbotMessage,
            ticketId,
          });
        }
      }, 500);
    }

    setIsWaitingForResponse(true);

    const timeoutDuration =
      (settings.missedChatTimer.hours * 3600 +
        settings.missedChatTimer.minutes * 60 +
        settings.missedChatTimer.seconds) *
      1000;

    const id = setTimeout(() => {
      if (isWaitingForResponse && !responseReceived) {
        const chatbotMessage = {
          content: "We will get back to you shortly!",
          sender: "chatbot",
        };
        setMessages((prevMessages) => [...prevMessages, chatbotMessage]);

        if (socket) {
          socket.emit("send_message", {
            message: chatbotMessage,
            ticketId,
          });
        }

        setResponseReceived(true);
      }
    }, timeoutDuration || 60000);

    setTimeoutId(id);
    setCurrentInput("");
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(userDetails.phone)) {
      validationErrors.phone = "Please enter a valid phone number (10 digits).";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userDetails.email)) {
      validationErrors.email = "Please enter a valid email address.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newTicket = {
      ...userDetails,
      title: firstMessageContent,
     
      status: "unresolved",
      messages: [...messages, firstMessageContent]
    };

    try {
      const savedTicket = await addTicket(newTicket);
      setIsFormVisible(false);
      setTicketId(savedTicket._id);

      if (socket) {
        socket.emit("join_room", savedTicket._id);
        
        const firstMsg = {
          content: firstMessageContent,
          sender: "user",
          timestamp: new Date(),
        };

        socket.emit("send_message", {
          ticketId: savedTicket._id,
          message: firstMsg,
        });
      }
       
    } catch (error) {
      console.error("Error submitting ticket:", error);
    }
  };

  useEffect(() => {
    if (!socket || !ticketId) return;

    socket.on("receive_message", (message) => {
      if (message.sender === "admin" || message.sender === "chatbot") {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on("session_closed", () => {
      setMessages((prev) => [
        ...prev,
        { content: "Session has ended. Thank you!", sender: "chatbot" },
      ]);
    });

    return () => {
      socket.off("receive_message");
      socket.off("session_closed");
    };
  }, [socket, ticketId]);
  useEffect(() => {
    const initialMsgs = settings.messages.map((msg) => ({
      content: msg,
      sender: "chatbot",
    }));
    setMessages(initialMsgs);
  }, [settings.messages]);
  return (
    <>
      {isChatOpen && (
        <div className="chatbot-window">
          <div
            className="chatbot-header"
            style={{ backgroundColor: settings.headerColor }}>
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

          <div
            className="chatbot-body"
            style={{ backgroundColor: settings.backgroundColor }}>
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
                    placeholder={settings.formFields.name}
                    value={userDetails.name}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, name: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder={settings.formFields.phone}
                    value={userDetails.phone}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, phone: e.target.value })
                    }
                  />
                  {errors.phone && <p className="error-text">{errors.phone}</p>}
                  <input
                    type="email"
                    placeholder={settings.formFields.email}
                    value={userDetails.email}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, email: e.target.value })
                    }
                  />
                  {errors.email && <p className="error-text">{errors.email}</p>}
                  <button className="submit-btn" onClick={handleSubmitForm}>
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="chatbot-footer">
            <form onSubmit={(e)=>handleSendMessage(e)} style={{ display: "flex" }}>
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
            <p>{settings.welcomeMessage}</p>
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
