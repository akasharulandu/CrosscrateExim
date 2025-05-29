import React, { useEffect, useState, useRef } from "react";
import { Button, Modal, Carousel } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaWhatsapp, FaEnvelope, FaFilePdf } from "react-icons/fa";
import "./Home.css";
import axios from "axios";
import About from "../pages/About";
import MissionVision from "../pages/MissionVision";
import OurValues from "../pages/OurValues";
import Contact from "../pages/Contact";
import ProductCard from "../components/ProductCard";
import languageText from "../utils/languageText";
import Navbar from "../components/Navbar";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function Home({ isAdmin }) {
  const [products, setProducts] = useState([]);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const [heroImage, setHeroImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  const productDetailsRef = useRef(null);

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

  const handleDownloadPDF = async () => {
    if (!productDetailsRef.current || !selectedProduct) return;
    const original = productDetailsRef.current;


    const container = productDetailsRef.current;
    const originalStyle = {
      maxHeight: container.style.maxHeight,
      overflowY: container.style.overflowY,
    };

    // Remove height limit for full rendering
    container.style.maxHeight = "unset";
    container.style.overflowY = "visible";

    const logo = new Image();
    logo.src = "/logo.png"; // Ensure this path is correct (public folder)

    logo.onload = () => {
      html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      }).then((canvas) => {
        // Restore original styles
        container.style.maxHeight = originalStyle.maxHeight;
        container.style.overflowY = originalStyle.overflowY;

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Header
        pdf.setFillColor(240, 240, 240);
        pdf.rect(0, 0, pageWidth, 297, "F");
        pdf.addImage(logo, "PNG", 15, 15, 35, 35);
        pdf.setFontSize(22);
        pdf.setTextColor(0, 102, 102);
        pdf.text("Crosscrate International Exim", 55, 25);
        pdf.setFontSize(12);
        pdf.setTextColor(50, 50, 50);
        pdf.text("Email: contact@crosscrate.com", 55, 33);
        pdf.text("Phone: +91 98765 43210", 55, 39);
        pdf.text("Website: www.crosscrate.com", 55, 45);
        pdf.setDrawColor(180);
        pdf.line(10, 55, pageWidth - 10, 55);
        pdf.setFontSize(14);
        pdf.setTextColor(60, 60, 60);
        pdf.text("Product Information ↓", 15, 65);

        // Image
        const imgWidth = pageWidth - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let imgY = 75;

        if (imgHeight > pageHeight - imgY - 10) {
          pdf.addPage();
          imgY = 10;
        }

        pdf.addImage(imgData, "PNG", 10, imgY, imgWidth, imgHeight);
        pdf.save(`${selectedProduct?.name || "product"}.pdf`);
      });
    };
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

      {/* Modal with Fancy PDF button */}
      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        size="xl"
        className="fade modal-fade"
        backdrop="static"
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Modal.Header
            closeButton
            style={{
              backgroundImage: "linear-gradient(90deg, rgb(11 146 128), rgb(222 182 198)",
              color: "#ffffff",
              borderTopLeftRadius: "0.3rem",
              borderTopRightRadius: "0.3rem",
            }}
          >
            <Modal.Title className="w-100 text-center fw-bold">{selectedProduct?.name}</Modal.Title>
          </Modal.Header>

          <Modal.Body
            style={{
              background: "linear-gradient(135deg, #f0f0f0 0%, #dcdcdc 100%)",
            }}
          >
            <div className="row" ref={productDetailsRef}>
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
                <div
                  className="p-3 bg-white shadow rounded fancy-scrollbar"
                  style={{ maxHeight: "400px", overflowY: "auto" }}
                >
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
                  <hr />
                  <div className="d-flex justify-content-start gap-3 mt-3">
                    <a
                      href={`https://wa.me/?text=Check out this product: ${selectedProduct?.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-success fs-5"
                    >
                      <FaWhatsapp />
                    </a>
                    <a
                      href={`mailto:?subject=Product Details - ${selectedProduct?.name}&body=Check out this product: ${selectedProduct?.description}`}
                      className="text-primary fs-5"
                    >
                      <FaEnvelope />
                    </a>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDownloadPDF();
                      }}
                      className="text-danger fs-5"
                    >
                      <FaFilePdf />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handlePrevious} disabled={currentIndex === 0}>
              Previous
            </Button>
            <Button
              variant="secondary"
              onClick={handleNext}
              disabled={currentIndex === products.length - 1}
            >
              Next
            </Button>
            <Button variant="danger" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </motion.div>
      </Modal>
    </div>
  );
}

export default Home;
