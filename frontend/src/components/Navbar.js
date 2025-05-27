// src/components/Navbar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import languageText from "../utils/languageText";

function Navbar({ isAdmin, language, setLanguage, theme, toggleTheme, setShowLogoutAlert }) {
  const location = useLocation();
  const onHomePage = location.pathname === "/";

  const navbarText = languageText[language] || {};

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top rounded-bottom">
      <div className="container-fluid px-3">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="Logo" width="70" height="50" className="d-inline-block align-top" />
          <span className="brand-text">
            CROSSCRATE <span className="highlight">EXIM</span>
          </span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mt-2 mt-lg-0 custom-nav">
            {onHomePage ? (
              <>
                <li className="nav-item"><a className="nav-link" href="#home">{navbarText.navbar?.home || "Home"}</a></li>
                <li className="nav-item"><a className="nav-link" href="#products">{navbarText.navbar?.products || "Products"}</a></li>
                <li className="nav-item"><a className="nav-link" href="#about">{navbarText.navbar?.about || "About"}</a></li>
                <li className="nav-item"><a className="nav-link" href="#mission">{navbarText.navbar?.mission || "Mission"}</a></li>
                <li className="nav-item"><a className="nav-link" href="#values">{navbarText.navbar?.values || "Values"}</a></li>
                <li className="nav-item"><a className="nav-link" href="#contact">{navbarText.navbar?.contact || "Contact"}</a></li>
              </>
            ) : (
              <>
                <li className="nav-item"><Link className="nav-link" to="/">{navbarText.navbar?.home || "Home"}</Link></li>
              </>
            )}
          </ul>

          <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-2">
            <select
              className="form-select form-select-sm me-2"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ width: "auto" }}
            >
              <option value="en">English</option>
              <option value="ta">Tamil</option>
              <option value="hi">Hindi</option>
            </select>

            <button className="btn btn-outline-light btn-sm me-2" onClick={toggleTheme}>
              Theme
            </button>

            {isAdmin ? (
              <>
                <Link to="/dashboard" className="btn btn-warning btn-sm me-2">
                  Admin Panel
                </Link>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    localStorage.removeItem("token");
                    setShowLogoutAlert(true);
                    setTimeout(() => {
                      window.location.href = "/";
                    }, 1500);
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/admin" className="btn btn-success btn-sm">
                {navbarText.navbar?.login || "Login"}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
