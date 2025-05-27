// src/pages/Home.js
import React, { useEffect, useState } from "react";
import { Button, Modal, Carousel } from "react-bootstrap";
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
  const [currentIndex, setCurrentIndex] = useState(null);
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
    const index = products.findIndex((p) => p._id === product._id);
    setSelectedProduct(product);
    setCurrentIndex(index);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleNext = () => {
    if (currentIndex < products.length - 1) {
      const nextIndex = currentIndex + 1;
      setSelectedProduct(products[nextIndex]);
      setCurrentIndex(nextIndex);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setSelectedProduct(products[prevIndex]);
      setCurrentIndex(prevIndex);
    }
  };

  const navbarText = languageText[language] || {};

  return (
    <div
      className={`home-container ${theme}`}
      style={{
        background:
          theme === "light"
            ? "linear-gradient(135deg,rgb(227, 249, 247),rgb(253, 218, 237))"
            : "linear-gradient(135deg, #1c1c1c, #2c2c2c)",
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
            <ProductCard
              key={product._id}
              product={product}
              onClick={openModal}
              language={language}
            />
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

      <div className="container mt-5" id="contact" style={{ paddingBottom: "3rem" }}>
        <Contact language={language} />
      </div>

      {/* Product Fullscreen Modal */}
      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        size="xl"
        className="fade modal-fade"
        backdrop="static"
      >
        <Modal.Header closeButton style={{ background: "#212529", color: "white" }}>
          <Modal.Title>{selectedProduct?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            background: "linear-gradient(135deg, #f0f0f0 0%, #dcdcdc 100%)",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <div className="row">
            <div className="col-md-6">
              {selectedProduct?.images?.length > 0 ? (
                <Carousel fade>
                  {selectedProduct.images.map((imgUrl, idx) => (
                    <Carousel.Item key={idx}>
                      <img
                        src={imgUrl}
                        alt={`Slide ${idx}`}
                        className="d-block w-100"
                        style={{ maxHeight: "400px", objectFit: "cover", borderRadius: "8px" }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              ) : (
                selectedProduct?.imageUrl && (
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    className="img-fluid rounded"
                    style={{ maxHeight: "400px", objectFit: "cover" }}
                  />
                )
              )}
            </div>

            <div className="col-md-6">
              <div className="p-3 bg-white shadow rounded fancy-scrollbar" style={{ maxHeight: "400px", overflowY: "auto" }}>
                <p><strong>Description:</strong></p>
                <p>{selectedProduct?.description}</p>

                <p><strong>Price:</strong> ₹{selectedProduct?.price}</p>

                {selectedProduct?.dimensions && (
                  <>
                    <hr />
                    <p><strong>Dimensions:</strong></p>
                    <ul className="mb-0">
                      {selectedProduct.dimensions.map((dim, idx) => (
                        <li key={idx}>{dim}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <Button variant="secondary" onClick={handlePrevious} disabled={currentIndex === 0}>
            ◀ Previous
          </Button>
          <Button variant="secondary" onClick={handleNext} disabled={currentIndex === products.length - 1}>
            Next ▶
          </Button>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Home;
