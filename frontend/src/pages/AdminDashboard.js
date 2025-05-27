import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from "../components/Navbar";
import ProductTable from "../components/ProductTable";

function AdminDashboard() {
  const navigate = useNavigate();

  // Navbar props states
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("light");
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  // Hero Image upload states
  const [heroPhoto, setHeroPhoto] = useState(null);
  const [heroPreview, setHeroPreview] = useState(null);

  // Products state
  const [products, setProducts] = useState([]);

  // Welcome message state
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchProducts();
      // Show welcome message only once after login
      const timeout = setTimeout(() => setShowWelcome(false), 1000); // auto-hide after 3s
      return () => clearTimeout(timeout);
    }
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Fetching products failed:", err);
    }
  };

  const uploadHeroImage = async (e) => {
    e.preventDefault();
    if (!heroPhoto) {
      alert("Please select a photo before uploading.");
      return;
    }
    const formData = new FormData();
    formData.append("photo", heroPhoto);

    try {
      await axios.post("/api/hero/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Hero image updated!");
      setHeroPhoto(null);
      setHeroPreview(null);
    } catch (err) {
      console.error("Hero image upload failed:", err);
      alert("Hero image upload failed");
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const goBackToHome = () => {
    navigate("/");
  };

  return (
    <>
      <Navbar
        isAdmin={true}
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        toggleTheme={toggleTheme}
        setShowLogoutAlert={setShowLogoutAlert}
      />

      <div className="container mt-5 pt-5">
        {showWelcome && (
          <div className="alert alert-success text-center" role="alert">
            Welcome to Admin Dashboard!
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Admin Dashboard</h2>
        </div>

        <div className="w-50 mb-5">
          <h4>Update Hero Image</h4>
          <form onSubmit={uploadHeroImage}>
            <input
              type="file"
              className="form-control mb-2"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setHeroPhoto(e.target.files[0]);
                  setHeroPreview(URL.createObjectURL(e.target.files[0]));
                } else {
                  setHeroPhoto(null);
                  setHeroPreview(null);
                }
              }}
            />
            {heroPreview && (
              <img
                src={heroPreview}
                alt="Hero Preview"
                className="img-fluid mb-2"
                style={{ maxHeight: "200px" }}
              />
            )}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!heroPhoto}
            >
              Upload Hero Image
            </button>
          </form>
        </div>

        <div>
          <ProductTable products={products} />
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
