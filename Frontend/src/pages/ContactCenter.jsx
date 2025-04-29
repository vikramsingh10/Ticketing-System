import React, { useEffect, useState } from "react";
import {
  getAllTickets,
  getTicketById,
  addMessageToTicket,
  updateTicketStatusAPI,
  assignTicket,
} from "../services/ticketService";
import { getAllTeamMembers } from "../services/teamService";
import "../styles/ContactCenter.css";

const ContactCenter = () => {
  const [tickets, setTickets] = useState([]);
  const [ticket, setTicket] = useState(null);
  const [message, setMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [selectedTicketId, setSelectedTicketId] = useState(
    localStorage.getItem("selectedTicketId") || ""
  );
  const [error, setError] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);

  const fetchTickets = async () => {
    try {
      const fetchedTickets = await getAllTickets();
      setTickets(fetchedTickets);
    } catch (err) {
      setError("Failed to fetch tickets.");
      console.error("Error fetching tickets:", err);
    }
  };

  const fetchTicket = async () => {
    if (!selectedTicketId) return;

    try {
      const fetchedTicket = await getTicketById(selectedTicketId);
      setTicket(fetchedTicket);
    } catch (err) {
      setError("Failed to fetch ticket.");
      console.error("Error fetching ticket:", err);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const members = await getAllTeamMembers();
      setTeamMembers(members);
    } catch (err) {
      console.error("Error fetching team members:", err);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchTeamMembers();
  }, []);

  useEffect(() => {
    fetchTicket();
  }, [selectedTicketId]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = { content: message, sender: "admin" };
    const updatedMessages = [...ticket.messages, newMessage];

    try {
      await addMessageToTicket(selectedTicketId, updatedMessages);
      setTicket((prevTicket) => ({
        ...prevTicket,
        messages: updatedMessages,
      }));
      setMessage("");

      // Simulate chatbot response
      const botMessage = { content: "This is a bot response.", sender: "chatbot" };
      const updatedMessagesWithBot = [...updatedMessages, botMessage];

      await addMessageToTicket(selectedTicketId, updatedMessagesWithBot);
      setTicket((prevTicket) => ({
        ...prevTicket,
        messages: updatedMessagesWithBot,
      }));
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!ticket) return;

    if (newStatus === "resolved" && ticket.status !== "resolved") {
      setPendingStatus("resolved");
      setShowConfirm(true);
    } else if (newStatus === "unresolved" && ticket.status !== "unresolved") {
      try {
        await updateTicketStatusAPI(selectedTicketId, "unresolved");
        setTicket((prevTicket) => ({ ...prevTicket, status: "unresolved" }));
      } catch (error) {
        console.error("Error updating status:", error);
      }
    }
  };

  const confirmResolve = async () => {
    try {
      await updateTicketStatusAPI(selectedTicketId, "resolved");
      setTicket((prevTicket) => ({ ...prevTicket, status: "resolved" }));
      setShowConfirm(false);
      setPendingStatus(null);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const cancelResolve = () => {
    setShowConfirm(false);
    setPendingStatus(null);
  };

  const handleAssignTeammate = async (memberId) => {
    try {
      const updatedTicket = await assignTicket(ticket._id, memberId);
      setTicket(updatedTicket);
    } catch (err) {
      console.error("Error assigning teammate:", err);
    }
  };

  if (error) return <p>{error}</p>;
  if (!ticket) return <p>Loading...</p>;

  return (
    <div className="contact-center-container">
      <div className="chat-list">
        <div className="heading">Contact Center</div>
        <div className="chats-head">
          <p style={{ color: "#888888" }}>
            <span>Chats</span>
          </p>
        </div>

        {tickets.length === 0 ? (
          <p>No tickets available</p>
        ) : (
          tickets.map((ticket) => (
            <div
              key={ticket._id}
              className={`chat-title ${
                ticket._id === selectedTicketId ? "active-chat" : ""
              }`}
              onClick={() => {
                setSelectedTicketId(ticket._id);
                localStorage.setItem("selectedTicketId", ticket._id);
              }}
            >
              <img src="/assets/img.png" alt="avatar" className="avatar" />
              <div>
                <p>Chat {ticket._id.split("-")[1]}</p>
                <p className="chat-msg">{ticket.title}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="chat-windows">
        <h3>Ticket# {ticket.ticketNumber || ticket._id}</h3>
        <div className="chat-msgs">
          {ticket.messages?.map((msg, idx) => (
            <div
              key={idx}
              className={msg.sender === "admin" ? "admin-msg" : "user-msg"}
            >
              {msg.content}
            </div>
          ))}
        </div>
        <div className="message-input-wrapper">
          <input
            className="chat-inputs"
            placeholder="Type here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <span
            className="material-symbols--send"
            onClick={handleSendMessage}
          ></span>
        </div>
      </div>
      <div className="ticket-info">
        <div>
          <img src="/assets/img.png" alt="avatar" className="avatar" />
          <span>Chats</span>
        </div>

        <span style={{ color: "#184E7F" }}>Details</span>
        <p>
          <span className="mdi--contact-outline"></span>
          {ticket.name}
        </p>
        <p>
          <span className="mdi-light--phone"></span>
          {ticket.phone}
        </p>
        <p>
          <span className="material-symbols-light--mail-outline"></span>
          {ticket.email}
        </p>

        <span style={{ color: "#184E7F" }}>Teammates</span>
        <select
          value={ticket.assignedTo?._id || ""}
          onChange={(e) => handleAssignTeammate(e.target.value)}>
          <option value="">Unassigned</option>
          {teamMembers.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name}
            </option>
          ))}
        </select>

        <p>Ticket Status</p>
        <select
          value={ticket.status}
          onChange={(e) => handleStatusChange(e.target.value)}>
          <option value="resolved">Resolved</option>
          <option value="unresolved">Unresolved</option>
        </select>

        {showConfirm && pendingStatus === "resolved" && (
          <div className="confirmation-popup">
            <p>Chats will be closed. Confirm?</p>
            <button onClick={confirmResolve}>Confirm</button>
            <button onClick={cancelResolve}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};
  

export default ContactCenter;
