// src/pages/Home.js
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import "./Home.css";
import axios from "axios";
import About from "../pages/About";
import MissionVision from "../pages/MissionVision";
import OurValues from "../pages/OurValues";
import Contact from "../pages/Contact";
import ProductCard from "../components/ProductCard";
import languageText from "../utils/languageText";
import Navbar from "../components/Navbar";

function Home({ isAdmin }) {
  const [products, setProducts] = useState([]);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const [heroImage, setHeroImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  useEffect(() => {
    fetchProducts();
    axios
      .get("/api/hero")
      .then((res) => setHeroImage(res.data?.imageUrl || null))
      .catch((err) => console.error("Failed to fetch hero image:", err));
  }, []);

  const fetchProducts = () => {
    axios
      .get("/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.className =
      newTheme === "light" ? "bg-light text-dark" : "bg-dark text-white";
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const navbarText = languageText[language] || {};

  return (
    <div
      className={`home-container ${theme}`}
      style={{
        background: theme === "light"
          ? "linear-gradient(135deg,rgb(197, 245, 237) 0%,rgb(254, 201, 234) 100%)" // warm peach gradient for light
          : "linear-gradient(135deg,rgb(48, 48, 49) 0%,rgb(35, 35, 35) 100%)", // cool blue gradient for dark
        minHeight: "100vh",
        transition: "background 0.5s ease",
      }}
    >
      {showLogoutAlert && (
        <div
          className="alert alert-success alert-dismissible fade show position-fixed end-0 m-3 slide-in-alert"
          role="alert"
          style={{ zIndex: 9999, top: "70px" }}
        >
          Logout Successful!
        </div>
      )}

      <Navbar
        isAdmin={isAdmin}
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        toggleTheme={toggleTheme}
        setShowLogoutAlert={setShowLogoutAlert}
      />

      <div
        className="hero-section d-flex align-items-center justify-content-center"
        style={{
          height: "300px",
          backgroundImage: `url(${heroImage || ""})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="text-center text-white bg-dark bg-opacity-50 p-3 rounded">
          <h1>{navbarText.welcome || "Welcome to Crosscrate International Exim"}</h1>
          <p>{navbarText.tagline || "Your one-stop solution for all cocopeat products"}</p>
        </div>
      </div>

      <div className="container mt-5" id="products">
        <h2 className="text-center mb-4 fw-bold">
          {navbarText.navbar?.products || "Products"}
        </h2>
        <div className="row">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} onClick={openModal} />
          ))}
        </div>
      </div>

      <div className="container mt-5" id="about">
        <About language={language} />
      </div>

      <div className="container mt-5" id="mission">
        <MissionVision language={language} />
      </div>

      <div className="container mt-5" id="values">
        <OurValues language={language} />
      </div>

      <div className="container mt-5" id="contact">
        <Contact language={language} />
      </div>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct?.imageUrl && (
            <img
              src={selectedProduct.imageUrl}
              alt={selectedProduct.name}
              className="img-fluid mb-3"
            />
          )}
          <p>
            <strong>Description:</strong> {selectedProduct?.description}
          </p>
          <p>
            <strong>Price:</strong> ₹{selectedProduct?.price}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Home;
