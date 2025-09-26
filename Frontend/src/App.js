import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";
import AddEventPage from "./pages/AddEventPage"
import AdminDashboard from "./pages/AdminDashboard";
import EventDetails from "./pages/EventDetails";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} /> 
          <Route path="/landing" element={<LandingPage />} /> 
          <Route path="/add-events" element={<AddEventPage />} /> 
          <Route path="/admin-dashboard" element={<AdminDashboard />} /> 
          <Route path="/event/:id" element={<EventDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
