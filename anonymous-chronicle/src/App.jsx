import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./ pages/Home.jsx";
import AdminLogin from "./ pages/AdminLogin.jsx";
import AdminDashboard from "./ pages/AdminDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website */}
        <Route path="/" element={<Home />} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;