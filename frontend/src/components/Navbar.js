import React from "react";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbar({ theme, toggleTheme, language, setLanguage, isAdmin, setIsAdmin }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAdmin(false);
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">Crosscrate Exim</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
          {/* <li className="nav-item"><Link className="nav-link" to="/products">Products</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li> */}
            <li className="nav-item"><Link className="nav-link" to="/products">Products</Link></li>
             <li className="nav-item"><Link className="nav-link" to="/about">About Us</Link></li>
             <li className="nav-item"><Link className="nav-link" to="/mission">Mission & Vision</Link></li>
             <li className="nav-item"><Link className="nav-link" to="/values">Our Values</Link></li>
             <li className="nav-item"><Link className="nav-link" to="/contact">Contact Us</Link></li>
        </ul>
        <div className="d-flex align-items-center">
          <label className="text-white me-2">Theme</label>
          <div className="form-check form-switch text-white me-3">
            <input className="form-check-input" type="checkbox" onChange={toggleTheme} checked={theme === "dark"} />
          </div>
          <select className="form-select me-3" value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="ta">Tamil</option>
            <option value="hi">Hindi</option>
          </select>
          {isAdmin ? (
            <button className="btn btn-outline-warning btn-sm" onClick={handleLogout}>Logout</button>
          ) : (
            <Link className="btn btn-outline-light btn-sm" to="/admin">Admin Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;