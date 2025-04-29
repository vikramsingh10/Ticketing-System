import React from "react";
import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "../components/DashboardLayout";

import LandingPage from "../pages/LandingPage";
import Signup from "../pages/SignUp";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ContactCenter from "../pages/ContactCenter";
import Analytics from "../pages/Analytics";
import ChatbotCustomize from "../pages/ChatbotCustomize";
import Team from "../pages/Team";
import Setting from "../pages/Setting";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contact-center" element={<ContactCenter />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/chatbot" element={<ChatbotCustomize />} />
          <Route path="/team" element={<Team />} />
          <Route path="/setting" element={<Setting />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
