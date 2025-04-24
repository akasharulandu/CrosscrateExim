import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';

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
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">CROSSCRATE EXIM</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
              <li className="nav-item"><a className="nav-link" href="#products">Products</a></li>
              <li className="nav-item"><a className="nav-link" href="#about">About Us</a></li>
              <li className="nav-item"><a className="nav-link" href="#mission&vision">Mission & Vision</a></li>
              <li className="nav-item"><a className="nav-link" href="#values">Our Values</a></li>
              <li className="nav-item"><a className="nav-link" href="#contact">Contact Us</a></li>
            </ul>
            <div className="d-flex">
              <select className="form-select form-select-sm me-2" value={language} onChange={handleLanguageChange}>
                <option value="en">EN</option>
                <option value="ta">TA</option>
                <option value="hi">HI</option>
              </select>
              <button className="btn btn-outline-light btn-sm me-2" onClick={toggleTheme}>Theme</button>
              <Link to="/admin" className="btn btn-success btn-sm">Login</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="hero-section d-flex align-items-center justify-content-center" style={{ height: '300px', backgroundImage: `url(${heroImage})`, backgroundSize: 'cover' }}>
        <div className="text-center text-white bg-dark bg-opacity-50 p-3 rounded">
          <h1>Welcome to Crosscrate Exim</h1>
          <p>Organic and High-Quality Fertilizers for Healthy Farming</p>
        </div>
      </div>

      <div className="container mt-5" id="products">
        <h2 className="text-center mb-4">Our Products</h2>
        <div className="row">
          {products.map((product) => (
            <div className="col-md-4 mb-3" key={product._id}>
              <div className="card h-100" onClick={() => openModal(product)} style={{ cursor: 'pointer' }}>
                {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />}
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="text-success">Price: ₹{product.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container mt-5" id="about">
        <h3>About Us</h3>
        <p>We are committed to delivering sustainable and organic fertilizers that improve crop yield and protect the environment.</p>
        <h3 className="mt-4" id="contact">Contact Us</h3>
        <p>Email: info@fertipro.com</p>
        <p>Phone: +91 98765 43210</p>
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
