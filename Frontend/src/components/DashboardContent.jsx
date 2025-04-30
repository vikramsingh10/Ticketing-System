import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  getAllTickets,
  getToken,
  deleteTicket,
} from "../services/ticketService";

const DashboardContent = () => {
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("Unresolved");
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  const fetchTickets = async () => {
    try {
      const fetchedTickets = await getAllTickets();
      setTickets(fetchedTickets);
    } catch (error) {
      console.error("Error fetching tickets", error);
    }
  };

  const refreshTickets = () => {
    fetchTickets();
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const openTicket = (ticketId) => {
    console.log("Opening ticket with ID:", ticketId);
    if (ticketId) {
      localStorage.setItem("selectedTicketId", ticketId);
      navigate("/contact-center");
    } else {
      console.error("Ticket ID is undefined or null");
    }
  };

  const statusFilteredTickets = tickets.filter((ticket) => {
    if (activeTab === "Resolved") return ticket.status === "resolved";
    if (activeTab === "Unresolved") return ticket.status === "unresolved";
    return true;
  });
  const filteredTickets = statusFilteredTickets.filter((ticket) => {
    const search = searchText.toLowerCase();
    return (
      (ticket._id || "").toLowerCase().includes(search) ||
      (ticket.phone || "").toLowerCase().includes(search) ||
      (ticket.name || "").toLowerCase().includes(search) ||
      (ticket.title || "").toLowerCase().includes(search)
    );
  });
  
  const API_BASE_URL = "http://localhost:5000/api";

  const handleDelete = async (_id) => {
    try {
      await deleteTicket(_id);
    } catch (error) {
      console.error("Failed to delete ticket:", error);
    }
  };

  return (
    <>
      <h2 style={{ color: "#6A6B70" }}>Dashboard</h2>

      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search by ticket #, mobile number, or issue"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "All" ? "active" : ""}`}
          onClick={() => setActiveTab("All")}>
          All Tickets
        </button>
        <button
          className={`tab ${activeTab === "Resolved" ? "active" : ""}`}
          onClick={() => setActiveTab("Resolved")}>
          Resolved
        </button>
        <button
          className={`tab ${activeTab === "Unresolved" ? "active" : ""}`}
          onClick={() => setActiveTab("Unresolved")}>
          Unresolved
        </button>
      </div>

      {filteredTickets.length > 0 ? (
        filteredTickets.map((ticket) => {
          if (!ticket._id) {
            console.error("Ticket ID is missing", ticket);
            return null;
          }
          return (
            <div key={ticket._id} className="ticket-card">
              <div className="ticket-header">
                <span className="status-dot"></span>
                <strong>Ticket# {ticket.ticketNumber || ticket._id}</strong>

                <span className="posted-time">Posted at {ticket.postedAt}</span>
                <span className="ticket-time">{ticket.time}</span>
              </div>
              <p className="ticket-message">{ticket.title}</p>
              <div className="ticket-footer">
                <div className="user-info">
                  <img src="/assets/img.png" alt="User" className="avatar" />
                  <div>
                    <p>{ticket.name}</p>
                    <p className="user-contact">{ticket.phone}</p>
                    <p className="user-contact">{ticket.email}</p>
                  </div>
                </div>
                <div className="ticket-btn">
                  <button
                    className="open-ticket-link"
                    onClick={() => openTicket(ticket._id)}>
                    Open Ticket
                  </button>
                  <button
                    className="open-ticket-link"
                    onClick={() => handleDelete(ticket._id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p style={{ color: "#888", marginTop: "1rem" }}>
          No tickets match your search.
        </p>
      )}
    </>
  );
};

export default DashboardContent;
