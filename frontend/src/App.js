import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavigationBar from './components/Navbar';
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("light"); // or "dark"
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAdmin(true);
  }, []);

  // Toggle theme function example
  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
    // You can add code here to apply the theme to body or root element
  };

  return (
    <Router>
      {/* Navbar appears on every page */}
      <NavigationBar
        isAdmin={isAdmin}
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        toggleTheme={toggleTheme}
        setShowLogoutAlert={setShowLogoutAlert}
      />

      {/* Optionally show logout alert */}
      {showLogoutAlert && (
        <div className="alert alert-warning text-center" role="alert">
          Logging out...
        </div>
      )}

      <Routes>
        <Route path="/" element={<Home isAdmin={isAdmin} />} />
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
