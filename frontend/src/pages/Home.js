// ✅ Final Home.js with anchor-based scrolling for About, Mission, Values, Contact

import React, { useEffect, useState } from "react";
import './Home.css';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import About from "../pages/About";
import MissionVision from "../pages/MissionVision";
import OurValues from "../pages/OurValues";
import Contact from "../pages/Contact";
import ProductCard from "../components/ProductCard";


function Home() {
  const [products, setProducts] = useState([]);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const [heroImage, setHeroImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    axios.get("/api/products").then((res) => setProducts(res.data));
    axios.get("/api/hero").then((res) => setHeroImage(res.data?.imageUrl));
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.className = newTheme === "light" ? "bg-light text-dark" : "bg-dark text-white";
  };

  const handleLanguageChange = (e) => setLanguage(e.target.value);

  const openModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  return (
    <div className={`home-container ${theme}`}>      
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container">
          <a className="navbar-brand" href="#">CROSSCRATE EXIM</a>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><a className="nav-link" href="#">Home</a></li>
              <li className="nav-item"><a className="nav-link" href="#products">Products</a></li>
              <li className="nav-item"><a className="nav-link" href="#about">About Us</a></li>
              <li className="nav-item"><a className="nav-link" href="#mission">Mission & Vision</a></li>
              <li className="nav-item"><a className="nav-link" href="#values">Our Values</a></li>
              <li className="nav-item"><a className="nav-link" href="#contact">Contact Us</a></li>
            </ul>
            <div className="d-flex">
              <select className="form-select form-select-sm me-2" value={language} onChange={handleLanguageChange}>
                <option value="en">English</option>
                <option value="ta">Tamil</option>
                <option value="hi">Hindi</option>
              </select>
              <button className="btn btn-outline-light btn-sm me-2" onClick={toggleTheme}>Theme</button>
              <a href="/admin" className="btn btn-success btn-sm">Login</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="hero-section d-flex align-items-center justify-content-center" style={{ height: '300px', backgroundImage: `url(${heroImage})`, backgroundSize: 'cover' }}>
        <div className="text-center text-white bg-dark bg-opacity-50 p-3 rounded">
          <h1>Welcome to Crosscrate International Exim</h1>
          <p>Organic and High-Quality Fertilizers for Healthy Farming</p>
        </div>
      </div>

      <div className="container mt-5" id="products">
        <h2 className="text-center mb-4">Our Products</h2>
        <div className="row">
          {products.map((product) => (
          <ProductCard key={product._id} product={product} onClick={openModal} />
          ))}
        </div>
      </div>

      {/* Reusing page sections at bottom of Home */}
      <div className="container mt-5" id="about">
        <About />
      </div>

      <div className="container mt-5" id="mission">
        <MissionVision />
      </div>

      <div className="container mt-5" id="values">
        <OurValues />
      </div>

      <div className="container mt-5" id="contact">
        <Contact />
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct?.imageUrl && <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="img-fluid mb-3" />}
          <p><strong>Description:</strong> {selectedProduct?.description}</p>
          <p><strong>Price:</strong> ₹{selectedProduct?.price}</p>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Home;
