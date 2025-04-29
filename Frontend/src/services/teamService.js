const API_URL = "http://localhost:5000/api/team";

export const getAllTeamMembers = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Failed to fetch team members");
  return response.json();
};

export const addTeamMember = async (newMember) => {
  const existingMember = await checkDuplicate(newMember.email, newMember.phone);
  if (existingMember) {
    throw new Error("A member with this email or phone number already exists.");
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newMember),
  });
  if (!response.ok) throw response;
  return response.json();
};

export const deleteTeamMember = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete team member");
  return res.json();
};

export const updateTeamMember = async (id, data) => {
  const existingMember = await checkDuplicate(data.email, data.phone, id);
  if (existingMember) {
    throw new Error("A member with this email or phone number already exists.");
  }

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

const checkDuplicate = async (email, phone, excludeId = null) => {
  const teamMembers = await getAllTeamMembers();
  return teamMembers.find(
    (member) =>
      (member.email === email || member.phone === phone) &&
      (!excludeId || member._id !== excludeId)
  );
};
