import React, { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import "../styles/icons.css";
import { AuthContext } from "../contexts/authContext";

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  const icons = [
    {
      id: "Dashboard",
      iconClass: "material-symbols-light--home-outline",
      label: "Dashboard",
    },
    {
      id: "Contact Center",
      iconClass: "bitcoin-icons--message-outline",
      label: "Contact Center",
    },
    { id: "Analytics", iconClass: "uil--analytics", label: "Analytics" },
    { id: "Chat Bot", iconClass: "fluent--bot-20-regular", label: "Chat Bot" },
    { id: "Team", iconClass: "ri--team-fill", label: "Team" },
    {
      id: "Settings",
      iconClass: "material-symbols-light--settings-outline",
      label: "Settings",
    },
  ];

  useEffect(() => {
    if (!user) {
      navigate("/signin", { replace: true });
    }
  }, [user, navigate]);

  const toggleLogout = () => {
    setShowLogout((prevState) => !prevState);
  };

  const handleNavigation = (id) => {
    setActiveTab(id);
    switch (id) {
      case "Dashboard":
        navigate("/dashboard");
        break;
      case "Contact Center":
        navigate("/contact-center");
        break;
      case "Analytics":
        navigate("/analytics");
        break;
      case "Chat Bot":
        navigate("/chatbot");
        break;
      case "Team":
        navigate("/team");
        break;
      case "Settings":
        navigate("/setting");
        break;
      default:
        navigate("/dashboard");
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <img
          onClick={() => handleNavigation("Dashboard")}
          src="/assets/logos.png"
          alt="Logo"
          className="logoa"
        />

        <nav className="nav-icons">
          {icons.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => handleNavigation(item.id)}>
              <span className={item.iconClass}></span>
              {activeTab === item.id && (
                <span className="icon-label">{item.label}</span>
              )}
            </div>
          ))}
        </nav>

        <div className="user-icon">
          <span onClick={toggleLogout}>
            <img
              className="user-profile"
              src="/assets/profile.png"
              alt="user-image"
            />
          </span>

          {showLogout && (
            <div className="logout-btn">
              <button onClick={logout}>Logout</button>
            </div>
          )}
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
