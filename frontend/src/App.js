import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAdmin(true);  // Checks if a valid token exists and sets isAdmin to true
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Login setIsAdmin={setIsAdmin} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAdmin={isAdmin}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
          
      </Routes>
    </Router>
  );
}

export default App;
