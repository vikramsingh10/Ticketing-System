# Ticketing-System
{
A full-featured Ticketing System built using the MERN stack (MongoDB, Express, React, Node.js). The application supports event scheduling, real-time chat, analytics, customizable chatbot, and role-based ticket management. 
}
# Deployed live project link 
{
https://ticketing-system-fngx1ex8k-vikramsingh10s-projects.vercel.app/
}
# Demo Login Credentials
{ 
 email: vikram10@gmail.com
 password: VikramSingh
}
### How To Use ###
{ 
1. to create ticket using chatbot fisrt it should be logged in otherwise it will give error in console.
2. once the ticket is created using chat bot and you are logged in do not refresh the window or browser page otherwise it will give error it is the vercel problem.
   You just toggle between contact center and dashboard it will automatically rerender and ticket will also be rendered.
}

#  Setup Instructions locally
{
Prerequisites
Node.js (v18 or higher)
MongoDB (MongoDB Atlas)
Vite (used for the frontend dev server)
Git

1. Clone the Repository
git clone https://github.com/vikramsingh10/ticketing-system.git
cd ticketing-system
2. Backend Setup
cd backend
npm install
Create a .env file inside the backend/ folder and add the following:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
Start the backend server:
npm run dev
The backend will run on http://localhost:5000.

3. Frontend Setup
cd ../frontend
npm install
npm run dev
The frontend will run on http://localhost:5173.
}

# Features Implemented
{
# Authentication
- Signup & Login (JWT-based)
- Role-based access (admin, teammate)

# Dashboard
- Ticket summary (all tickets, resolved, unresolved)

# Quick navigation

# Contact Center
- Chat-based ticket interface
- View all chats and toggle between all chats
- User Details
- Assign ticket to different team members
- set ticket status to resolved and unresolved
- Live Chat with user from admin
 -Local storage support for quick transitions

# Analytics
Charts for:
- Missed chats
- Avg. reply time
- Resolution rate
- Total chats

# Chatbot
- Real-time chatbot preview
- Live customization (color, greeting, avatar)
- Persistent chatbot settings (localStorage + backend sync)
- Color picker integration

# Team
- Add/edit/delete teammates
- Auto-assign chats to admin

# Settings
- Profile management
- Password Change ( same password will be assigned to team members createed and team member can login using this password )
  
Logout

# Live Chat
# WebSocket (Socket.IO) based real-time messaging
}
