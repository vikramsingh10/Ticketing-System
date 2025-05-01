import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import AuthProvider from "./contexts/authContext";
import SocketProvider from "./contexts/SocketContext";
import { ChatBotSettingsProvider } from "./contexts/ChatBotSettingsContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <ChatBotSettingsProvider>
            <AppRoutes />
          </ChatBotSettingsProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;
