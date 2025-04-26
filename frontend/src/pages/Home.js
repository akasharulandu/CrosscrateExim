import React, { useEffect, useState } from "react";
import { Button, Table } from 'react-bootstrap';
import './Home.css';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import About from "../pages/About";
import MissionVision from "../pages/MissionVision";
import OurValues from "../pages/OurValues";
import Contact from "../pages/Contact";
import ProductCard from "../components/ProductCard";
import languageText from "../utils/languageText";

function Home() {
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

  return (
    <div className={`home-container ${theme}`}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container">
          <a className="navbar-brand" href="#">CROSSCRATE EXIM</a>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><a className="nav-link" href="#">{languageText[language].navbar.home}</a></li>
              <li className="nav-item"><a className="nav-link" href="#products">{languageText[language].navbar.products}</a></li>
              <li className="nav-item"><a className="nav-link" href="#about">{languageText[language].navbar.about}</a></li>
              <li className="nav-item"><a className="nav-link" href="#mission">{languageText[language].navbar.mission}</a></li>
              <li className="nav-item"><a className="nav-link" href="#values">{languageText[language].navbar.values}</a></li>
              <li className="nav-item"><a className="nav-link" href="#contact">{languageText[language].navbar.contact}</a></li>
            </ul>
            <div className="d-flex">
              <select className="form-select form-select-sm me-2" value={language} onChange={handleLanguageChange}>
                <option value="en">English</option>
                <option value="ta">Tamil</option>
                <option value="hi">Hindi</option>
              </select>
              <button className="btn btn-outline-light btn-sm me-2" onClick={toggleTheme}>Theme</button>
              <a href="/admin" className="btn btn-success btn-sm">{languageText[language].navbar.login}</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="hero-section d-flex align-items-center justify-content-center" style={{ height: '300px', backgroundImage: `url(${heroImage})`, backgroundSize: 'cover' }}>
        <div className="text-center text-white bg-dark bg-opacity-50 p-3 rounded">
          <h1>{languageText[language].welcome}</h1>
          <p>{languageText[language].tagline}</p>
        </div>
      </div>

      <div className="container mt-5" id="products">
        <h2 className="text-center mb-4">{languageText[language].navbar.products}</h2>
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
            {languageText[language].submit}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Home;
