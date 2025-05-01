const API_BASE_URL = "http://localhost:5000/api";
export const getToken = () => localStorage.getItem("token");

export const getAllTickets = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!response.ok) throw new Error("Failed to fetch tickets");
    const tickets = await response.json();
    
    return tickets;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw new Error("Error fetching tickets");
  }
};

export const addTicket = async (newTicket) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(newTicket),
    });
    if (!response.ok) throw new Error("Failed to add ticket");
    const ticket = await response.json();
    console.log("Ticket added successfully:", ticket);
    return ticket;
  } catch (error) {
    console.error("Error adding ticket:", error);
    throw new Error("Error adding ticket");
  }
};

export const getTicketById = async (ticketId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!response.ok) throw new Error("Failed to fetch ticket");
    const ticket = await response.json();
    return ticket;
  } catch (error) {
    console.error("Error fetching ticket:", error);
    throw new Error("Error fetching ticket");
  }
};

export const addMessageToTicket = async (ticketId, updatedMessages) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/tickets/${ticketId}/messages`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ messages: updatedMessages }),
      }
    );
    if (!response.ok) throw new Error("Failed to add message to ticket");
    const updatedTicket = await response.json();
    console.log("Message added to ticket:", updatedTicket);
    return updatedTicket;
  } catch (error) {
    console.error("Error adding message to ticket:", error);
    throw new Error("Error adding message to ticket");
  }
};

export const updateTicketStatusAPI = async (ticketId, newStatus) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!response.ok) throw new Error("Failed to update ticket status");
    const updatedTicket = await response.json();
    console.log("Ticket status updated:", updatedTicket);
    return updatedTicket;
  } catch (error) {
    console.error("Error updating ticket status:", error);
    throw new Error("Error updating ticket status");
  }
};

export const deleteTicket = async (ticketId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    if (!response.ok) throw new Error("Failed to delete ticket");
    const deletedTicket = await response.json();
    console.log("Ticket deleted successfully:", deletedTicket);
    return deletedTicket;
  } catch (error) {
    console.error("Error deleting ticket:", error);
    throw new Error("Error deleting ticket");
  }
};

export const assignTicket = async (ticketId, teamMemberId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/assign`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ teamMemberId }),
    });

    if (!response.ok) throw new Error("Failed to assign ticket");
    const updatedTicket = await response.json();
    console.log("Ticket assigned successfully:", updatedTicket);
    return updatedTicket;
  } catch (error) {
    console.error("Error assigning ticket:", error);
    throw new Error("Error assigning ticket");
  }
};
