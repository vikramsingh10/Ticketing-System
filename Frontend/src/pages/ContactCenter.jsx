import React, { useEffect, useState } from "react";
import { useSocket } from "../contexts/SocketContext";
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
  const [showAssignConfirm, setShowAssignConfirm] = useState(false); // New state for assignment confirmation
  const [pendingStatus, setPendingStatus] = useState(null);
  const [selectedTicketId, setSelectedTicketId] = useState(
    localStorage.getItem("selectedTicketId") || ""
  );
  const [selectedMemberId, setSelectedMemberId] = useState(""); // New state for selected team member
  const [error, setError] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  // Fetch tickets from the backend
  const fetchTickets = async () => {
    try {
      const fetchedTickets = await getAllTickets();
      setTickets(fetchedTickets);

      // Set first ticket as default if none selected
      if (!selectedTicketId && fetchedTickets.length > 0) {
        const firstId = fetchedTickets[0]._id;
        setSelectedTicketId(firstId);
        localStorage.setItem("selectedTicketId", firstId);
      }
    } catch (err) {
      setError("Failed to fetch tickets.");
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all team members
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
    const loadTicketAndJoinRoom = async () => {
      if (!selectedTicketId || !socket) return;

      try {
        const fetchedTicket = await getTicketById(selectedTicketId);
        setTicket(fetchedTicket);
        socket.emit("join_room", selectedTicketId);
      } catch (err) {
        console.error("Invalid ticket selected:", err);
        setTicket(null);
        setSelectedTicketId("");
        localStorage.removeItem("selectedTicketId");
      }
    };

    loadTicketAndJoinRoom();

    socket?.on("receive_message", (message) => {
      // Only add non-bot messages to the Contact Center view
      if (message.sender !== "chatbot") {
        setTicket((prevTicket) => ({
          ...prevTicket,
          messages: [...(prevTicket?.messages || []), message],
        }));
      }
    });

    socket?.on("session_closed", () => {
      alert("Chat session has been closed.");
    });

    return () => {
      socket?.off("receive_message");
      socket?.off("session_closed");
    };
  }, [selectedTicketId, socket]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = { content: message, sender: "admin" };

    try {
      // Emit the message via Socket.IO
      if (socket) {
        socket.emit("send_message", {
          ticketId: selectedTicketId,
          message: newMessage,
        });
      }

      // Clear the message input field
      setMessage("");
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
      socket.emit("close_session", selectedTicketId);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const cancelResolve = () => {
    setShowConfirm(false);
    setPendingStatus(null);
  };

  const handleAssignTeammate = (memberId) => {
    if (memberId !== ticket.assignedTo?._id) {
      setSelectedMemberId(memberId);
      setShowAssignConfirm(true);
    }
  };

  const confirmAssignTeammate = async () => {
    try {
      const updatedTicket = await assignTicket(ticket._id, selectedMemberId);
      setTicket(updatedTicket);
      setShowAssignConfirm(false);
      setSelectedMemberId("");
    } catch (err) {
      console.error("Error assigning teammate:", err);
    }
  };

  const cancelAssignTeammate = () => {
    setShowAssignConfirm(false);
    setSelectedMemberId("");
  };

  if (error) return <p>{error}</p>;
  if (loading) return <p>Loading tickets...</p>;
  if (!ticket) return <p>There are no Tickets.</p>;

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
              }}>
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
          {ticket.messages
            ?.filter((msg) => msg.sender !== "chatbot") // Filter out chatbot messages
            .map((msg, idx) => (
              <div
                key={idx}
                className={msg.sender === "admin" ? "admin-msg" : "user-msg"}>
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
            onClick={handleSendMessage}></span>
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
            <div className="button-div">
              <button className="cancel-btn" onClick={cancelResolve}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={confirmResolve}>
                Confirm
              </button>
            </div>
          </div>
        )}

        {showAssignConfirm && (
          <div className="confirmation-popup">
            <p>
              Chat will be assigned to a different team member. Confirm?
            </p>
            <div className="button-div">
              <button className="cancel-btn" onClick={cancelAssignTeammate}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={confirmAssignTeammate}>
                Confirm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactCenter;
