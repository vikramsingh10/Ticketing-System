import React, { useState, useEffect } from "react";
import "../styles/ChatBotPopup.css";
import { addTicket } from "../services/ticketService";
import { useSocket } from "../contexts/SocketContext";

const ChatBotPopup = ({
  
}) => {
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
  const [ticketId, setTicketId] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [responseReceived, setResponseReceived] = useState(false);

  const [errors, setErrors] = useState({
    phone: "",
    email: "",
  });

  const socket = useSocket();

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    setIsWelcomeVisible(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    const message = currentInput.trim();
    const newMsg = { content: message, sender: "user" };

    // Emit the user's message to the backend
    if (socket) {
      socket.emit("send_message", {
        message: newMsg,
        ticketId: ticketId, // Ensure ticketId is being passed
      });
    }

    // Update the messages state with the user's message
    setMessages((prevMessages) => [...prevMessages, newMsg]);

    // If it's the first message, handle the form and chatbot prompt
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
            ticketId: ticketId,
          });
        }
      }, 500);
    }

    // Track if waiting for response from contact center
    setIsWaitingForResponse(true);

    // Start a timer for 1 minute to check if no response is received
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
            ticketId: ticketId,
          });
        }

        setResponseReceived(true); // Set this flag to true after sending the message
      }
    }, 60000); // 1 minute = 60000 ms

    setTimeoutId(id); // Save the timeoutId for clearing it later

    // Clear input field after sending the message
    setCurrentInput("");
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    // Perform validation before submitting the form
    const validationErrors = {};

    // Phone number validation (simple example: only digits, length 10)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(userDetails.phone)) {
      validationErrors.phone = "Please enter a valid phone number (10 digits).";
    }

    // Email validation (basic validation using regex)
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
      description: firstMessageContent,
      status: "unresolved",
    };

    try {
      const savedTicket = await addTicket(newTicket);
      setIsFormVisible(false);
      setTicketId(savedTicket._id);

      // 👇 join the ticket room (check if socket exists)
      if (socket) {
        socket.emit("join_room", savedTicket._id);

        // 👇 send initial message via socket
        const firstMsg = {
          content: firstMessageContent,
          sender: "user",
          timestamp: new Date(),
        };

        socket.emit("send_message", {
          ticketId: savedTicket._id,
          message: firstMsg,
        });
      } else {
        console.warn("Socket not connected. Cannot emit events.");
      }

      // 👇 save message locally
      const firstMsg = {
        content: firstMessageContent,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, firstMsg]);
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
                  {errors.phone && <p className="error-text">{errors.phone}</p>}

                  <input
                    type="email"
                    placeholder="Your Email"
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
