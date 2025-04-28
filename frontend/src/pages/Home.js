import React, { useEffect, useState } from "react";
import { Button, Table } from 'react-bootstrap';
import './Home.css';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import { Link } from "react-router-dom"; // ADDED
import About from "../pages/About";
import MissionVision from "../pages/MissionVision";
import OurValues from "../pages/OurValues";
import Contact from "../pages/Contact";
import ProductCard from "../components/ProductCard";
import languageText from "../utils/languageText";

function Home({ isAdmin }) { // RECEIVE isAdmin
  const [products, setProducts] = useState([]);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const [heroImage, setHeroImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = () => {
    axios.get("/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  };

  useEffect(() => {
    fetchProducts();
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

  const handleClose = () => setShowModal(false);

  const navbarText = languageText[language] || {};

  return (
    <div className={`home-container ${theme}`}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container">
          <a className="navbar-brand" href="#">CROSSCRATE EXIM</a>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><a className="nav-link" href="#">{navbarText.navbar?.home || 'Home'}</a></li>
              <li className="nav-item"><a className="nav-link" href="#products">{navbarText.navbar?.products || 'Products'}</a></li>
              <li className="nav-item"><a className="nav-link" href="#about">{navbarText.navbar?.about || 'About'}</a></li>
              <li className="nav-item"><a className="nav-link" href="#mission">{navbarText.navbar?.mission || 'Mission'}</a></li>
              <li className="nav-item"><a className="nav-link" href="#values">{navbarText.navbar?.values || 'Values'}</a></li>
              <li className="nav-item"><a className="nav-link" href="#contact">{navbarText.navbar?.contact || 'Contact'}</a></li>
            </ul>
            <div className="d-flex">
              <select className="form-select form-select-sm me-2" value={language} onChange={handleLanguageChange}>
                <option value="en">English</option>
                <option value="ta">Tamil</option>
                <option value="hi">Hindi</option>
              </select>
              <button className="btn btn-outline-light btn-sm me-2" onClick={toggleTheme}>Theme</button>
              {isAdmin ? (
  <>
    <Link to="/dashboard" className="btn btn-warning btn-sm me-2">
      Admin Panel
    </Link>
    <button
      className="btn btn-danger btn-sm"
      onClick={() => {
        localStorage.removeItem("token");
        window.location.href = "/";
      }}
    >
      Logout
    </button>
  </>
) : (
  <a href="/admin" className="btn btn-success btn-sm">
    {navbarText.navbar?.login || 'Login'}
  </a>
)}

            </div>
          </div>
        </div>
      </nav>

      <div className="hero-section d-flex align-items-center justify-content-center" style={{ height: '300px', backgroundImage: `url(${heroImage})`, backgroundSize: 'cover' }}>
        <div className="text-center text-white bg-dark bg-opacity-50 p-3 rounded">
          <h1>{navbarText.welcome || 'Welcome to Crosscrate Exim'}</h1>
          <p>{navbarText.tagline || 'Your one-stop solution for all fertilizers'}</p>
        </div>
      </div>

      <div className="container mt-5" id="products">
        <h2 className="text-center mb-4">{navbarText.navbar?.products || 'Products'}</h2>
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
          {selectedProduct?.imageUrl && <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="img-fluid mb-3" />}
          <p><strong>Description:</strong> {selectedProduct?.description}</p>
          <p><strong>Price:</strong> ₹{selectedProduct?.price}</p>
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
