import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminManageDimensions from '../components/AdminManageDimensions'; 
import languageText from "../utils/languageText";
import ProductTable from "../components/ProductTable";

function AdminDashboard() {
  const navigate = useNavigate();
  const [heroPhoto, setHeroPhoto] = useState(null);
  const [heroPreview, setHeroPreview] = useState(null);
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // If token missing, redirect to login
    } else {
      fetchProducts();
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setProducts(res.data);
      console.log("responseeeeeeeeeeeeeeeeeee",res.data);
    } catch (err) {
      console.error("Fetching products failed:", err);
    }
  };



  const uploadHeroImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("photo", heroPhoto);

    try {
      await axios.post("/api/hero/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      alert("Hero image updated!");
      setHeroPhoto(null);
      setHeroPreview(null);
    } catch (err) {
      console.error("Hero image upload failed:", err);
      alert("Hero image upload failed");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // Clear token, then go home
  };

  const goBackToHome = () => {
    navigate("/"); // Just go home without touching token
  };

  return (
    

    // {/*Admin Dashboard Layout*/}
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Admin Dashboard</h2>
        <div>
          <button className="btn btn-secondary me-2" onClick={goBackToHome}>Back to Home</button>
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>
      </div>


      {/* Hero Image Upload */}
      <div className="w-50 mb-5">
        <h4>Update Hero Image</h4>
        <form onSubmit={uploadHeroImage}>
          <input
            type="file"
            className="form-control mb-2"
            onChange={(e) => {
              setHeroPhoto(e.target.files[0]);
              setHeroPreview(URL.createObjectURL(e.target.files[0]));
            }}
          />
          {heroPreview && (
            <img
              src={heroPreview}
              alt="Hero Preview"
              className="img-fluid mb-2"
              style={{ maxHeight: '200px' }}
            />
          )}
          <button type="submit" className="btn btn-primary">Upload Hero Image</button>
        </form>
      </div>
 <div>
      <ProductTable />
    </div>
    </div>
  );
}

export default AdminDashboard;
