const API_BASE_URL = "http://localhost:5000/api";
export const getToken = () => localStorage.getItem("token");

export const getAllTickets = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!response.ok) throw new Error("Failed to fetch tickets");
    const tickets = await response.json();
    console.log("Fetched tickets:", tickets);
    return tickets;
  } catch (error) {
    console.error(error);
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
    console.error(error);
    throw new Error("Error adding ticket");
  }
};

export const getTicketById = async (ticketId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!response.ok) throw new Error("Failed to fetch ticket");
    return response.json();
  } catch (error) {
    console.error(error);
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
    return response.json();
  } catch (error) {
    console.error(error);
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
    return response.json();
  } catch (error) {
    console.error(error);
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
    return await response.json();
  } catch (error) {
    console.error(error);
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
    return response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Error assigning ticket");
  }
};
