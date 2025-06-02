// import React, { useEffect, useState, useRef } from "react";
// import { Button, Modal, Carousel } from "react-bootstrap";
// import { useLocation } from "react-router-dom";
// import { motion } from "framer-motion";
// import { FaWhatsapp, FaEnvelope, FaFilePdf } from "react-icons/fa";
// import "./Home.css";
// import axios from "axios";
// import About from "../pages/About";
// import MissionVision from "../pages/MissionVision";
// import OurValues from "../pages/OurValues";
// import Contact from "../pages/Contact";
// import ProductCard from "../components/ProductCard";
// import languageText from "../utils/languageText";
// import Navbar from "../components/Navbar";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// function Home({ isAdmin }) {
//   const [products, setProducts] = useState([]);
//   const [theme, setTheme] = useState("light");
//   const [language, setLanguage] = useState("en");
//   const [heroImage, setHeroImage] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [currentIndex, setCurrentIndex] = useState(null);
//   const [showLogoutAlert, setShowLogoutAlert] = useState(false);

//   const productDetailsRef = useRef(null);

//   useEffect(() => {
//     fetchProducts();
//     axios
//       .get("/api/hero")
//       .then((res) => setHeroImage(res.data?.imageUrl || null))
//       .catch((err) => console.error("Failed to fetch hero image:", err));
//   }, []);

//   const fetchProducts = () => {
//     axios
//       .get("/api/products")
//       .then((res) => setProducts(res.data))
//       .catch((err) => console.error("Error fetching products:", err));
//   };

//   const toggleTheme = () => {
//     const newTheme = theme === "light" ? "dark" : "light";
//     setTheme(newTheme);
//     document.body.className =
//       newTheme === "light" ? "bg-light text-dark" : "bg-dark text-white";
//   };

//   const openModal = (product) => {
//     const index = products.findIndex((p) => p._id === product._id);
//     setSelectedProduct(product);
//     setCurrentIndex(index);
//     setShowModal(true);
//   };

//   const handleClose = () => setShowModal(false);

//   const handleNext = () => {
//     if (currentIndex < products.length - 1) {
//       const nextIndex = currentIndex + 1;
//       setSelectedProduct(products[nextIndex]);
//       setCurrentIndex(nextIndex);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentIndex > 0) {
//       const prevIndex = currentIndex - 1;
//       setSelectedProduct(products[prevIndex]);
//       setCurrentIndex(prevIndex);
//     }
//   };

//   const handleDownloadPDF = async () => {
//     if (!productDetailsRef.current || !selectedProduct) return;

//     // Find the fancy-scrollbar div inside the productDetailsRef
//     const container = productDetailsRef.current;
//     const fancyScrollbar = container.querySelector('.fancy-scrollbar');

//     // Save original styles
//     const originalStyle = fancyScrollbar
//       ? {
//           maxHeight: fancyScrollbar.style.maxHeight,
//           overflowY: fancyScrollbar.style.overflowY,
//         }
//       : null;

//     // Remove height limit for full rendering
//     if (fancyScrollbar) {
//       fancyScrollbar.style.maxHeight = "unset";
//       fancyScrollbar.style.overflowY = "visible";
//     }

//     // Hide all elements with pdf-hide class BEFORE creating the logo image
//     const pdfHideElements = container.querySelectorAll('.pdf-hide');
//     pdfHideElements.forEach(el => {
//       el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important;';
//     });

//     // Wait a moment for the DOM to update
//     await new Promise(resolve => setTimeout(resolve, 100));

//     const logo = new Image();
//     logo.src = "/logo.png"; // Ensure this path is correct (public folder)

//     logo.onload = () => {
//       // Force reflow and wait for DOM update
//       setTimeout(async () => {
//         try {
//           const canvas = await html2canvas(container, {
//             scale: 2,
//             useCORS: true,
//             allowTaint: true,
//             onclone: function(clonedDoc) {
//               // Also hide elements in the cloned document
//               const clonedHideElements = clonedDoc.querySelectorAll('.pdf-hide');
//               clonedHideElements.forEach(el => {
//                 el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important;';
//               });
//             }
//           });

//           // Restore original styles
//           if (fancyScrollbar && originalStyle) {
//             fancyScrollbar.style.maxHeight = originalStyle.maxHeight;
//             fancyScrollbar.style.overflowY = originalStyle.overflowY;
//           }

//           const imgData = canvas.toDataURL("image/png");
//           const pdf = new jsPDF("p", "mm", "a4");

//           const pageWidth = pdf.internal.pageSize.getWidth();
//           const pageHeight = pdf.internal.pageSize.getHeight();

//           // Header
//           pdf.setFillColor(240, 240, 240);
//           pdf.rect(0, 0, pageWidth, 297, "F");
//           pdf.addImage(logo, "PNG", 15, 15, 35, 35);
//           pdf.setFontSize(22);
//           pdf.setTextColor(0, 102, 102);
//           pdf.text("Crosscrate International Exim", 55, 25);
//           pdf.setFontSize(12);
//           pdf.setTextColor(50, 50, 50);
//           pdf.text("Email: contact@crosscrate.com", 55, 33);
//           pdf.text("Phone: +91 98765 43210", 55, 39);
//           pdf.text("Website: www.crosscrate.com", 55, 45);
//           pdf.text("Address: Al Ameen, Parimanam, Muttom-Allepey, Kerala, India- 690511", 55, 51);
//           pdf.setDrawColor(180);
//           pdf.line(10, 55, pageWidth - 10, 55);
          
//           // Add product title
//           pdf.setFontSize(14);
//           pdf.setTextColor(60, 60, 60);
//           pdf.text(`${productText.productDetails || "Product Details"}: ${selectedProduct?.name || ""}`, 15, 65);

//           // Image
//           const imgWidth = pageWidth - 20;
//           const imgHeight = (canvas.height * imgWidth) / canvas.width;
//           let imgY = 75;

//           if (imgHeight > pageHeight - imgY - 10) {
//             pdf.addPage();
//             imgY = 10;
//           }

//           pdf.addImage(imgData, "PNG", 10, imgY, imgWidth, imgHeight);
//           pdf.save(`${selectedProduct?.name || "product"}.pdf`);
//         } finally {
//           // Always restore the elements regardless of success or failure
//           pdfHideElements.forEach(el => {
//             el.style.cssText = '';
//           });
//         }
//       }, 50);
//     };
//   };

//   // Get translations
//   const navbarText = languageText[language]?.navbar || {};
//   const productText = languageText[language]?.products || {};
//   const adminText = languageText[language]?.admin || {};
//   const actionsText = languageText[language]?.actions || {};

//   const themeClass = theme === "dark" ? "dark-theme" : "light-theme";

//   return (
//     <div
//       className={`home-container ${theme} ${themeClass}`}
//       style={{
//         background:
//           theme === "light"
//             ? "linear-gradient(135deg,rgb(227, 249, 247),rgb(253, 218, 237))"
//             : "linear-gradient(135deg,rgb(32, 36, 35),rgb(25, 28, 27))",
//         minHeight: "100vh",
//         transition: "background 0.5s ease",
//       }}
//     >
//       {showLogoutAlert && (
//         <div
//           className="alert alert-success alert-dismissible fade show position-fixed end-0 m-3 slide-in-alert"
//           role="alert"
//           style={{ zIndex: 9999, top: "70px" }}
//         >
//           Logout Successful!
//         </div>
//       )}

//       <Navbar
//         isAdmin={isAdmin}
//         language={language}
//         setLanguage={setLanguage}
//         theme={theme}
//         toggleTheme={toggleTheme}
//         setShowLogoutAlert={setShowLogoutAlert}
//       />

//       <div
//         className="hero-section d-flex align-items-center justify-content-center"
//         style={{
//           height: "300px",
//           backgroundImage: `url(${heroImage || ""})`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       >
//         <div className="text-center text-white bg-dark bg-opacity-50 p-3 rounded">
//           <h1 style={{
//             background: "linear-gradient(45deg,rgb(243, 238, 238),rgb(255, 255, 255))",
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//             textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
//             fontSize: "2.5rem",
//             fontWeight: "bold"
//           }}>
//             {navbarText.welcome || "Welcome to Crosscrate International Exim"}
//           </h1>
//           <p style={{
//             background: "linear-gradient(45deg,rgb(6, 223, 93),rgb(246, 234, 237))", 
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//             fontSize: "1.2rem",
//             fontWeight: "500"
//           }}>
//             {navbarText.tagline || "Your one-stop solution for all cocopeat products"}
//           </p>
//         </div>
//       </div>

//       <div className="container mt-5" id="products">
//         <h2 className="text-center mb-4 fw-bold">
//           {navbarText.navbar?.products}
//         </h2>
//         <div className="row">
//           {products.map((product) => (
//             <div className="col-md-4 col-sm-6 mb-4" key={product._id}>
//               <div className="product-card" onClick={() => openModal(product)}>
//                 <img
//                   src={product.images?.[0] || product.imageUrl}
//                   alt={product.name}
//                   className="product-image"
//                 />
//                 <div className="product-body">
//                   <div className="product-title text-center fw-bold">{product.name}</div>
//                   <div className="product-description">{product.description}</div>
//                   {/* <div className="product-price">₹{product.price}</div> */}
//                   <div className="product-tags">
//                     {product.tags?.map((tag, idx) => (
//                       <span className="product-tag" key={idx}>{tag}</span>
//                     ))}
//                   </div>
//                   <button className="view-details-btn">
//                     {productText.viewDetails || "View Details"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="container mt-5" id="about">
//         <About language={language} />
//       </div>

//       <div className="container mt-5" id="mission">
//         <MissionVision language={language} />
//       </div>

//       <div className="container mt-5" id="values">
//         <OurValues language={language} />
//       </div>

//       <div className="container mt-5" id="contact" style={{ paddingBottom: "3rem" }}>
//         <Contact language={language} />
//       </div>

//       {/* Modal with Fancy PDF button */}
//       <Modal
//         show={showModal}
//         onHide={handleClose}
//         centered
//         size="xl"
//         className="fade modal-fade"
//         backdrop="static"
//       >
//         <motion.div
//           initial={{ y: 100, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.4 }}
//         >
//           <Modal.Header
//             closeButton
//             style={{
//               backgroundImage: "linear-gradient(90deg, rgb(11 146 128), rgb(222 182 198)",
//               color: "#ffffff",
//               borderTopLeftRadius: "0.3rem",
//               borderTopRightRadius: "0.3rem",
//             }}
//           >
//             <Modal.Title className="w-100 text-center fw-bold">
//               {selectedProduct?.name || productText.productDetails || "Product Details"}
//             </Modal.Title>
//           </Modal.Header>

//           <Modal.Body
//             style={{
//               background: "linear-gradient(135deg, #f0f0f0 0%, #dcdcdc 100%)",
//             }}
//           >
//             <div className="row" ref={productDetailsRef}>
//               <div className="col-md-6">
//                 {selectedProduct?.images?.length > 0 ? (
//                   <Carousel fade>
//                     {selectedProduct.images.map((imgUrl, idx) => (
//                       <Carousel.Item key={idx}>
//                         <img
//                           src={imgUrl}
//                           alt={`Slide ${idx}`}
//                           className="d-block w-100"
//                           style={{ maxHeight: "400px", objectFit: "cover", borderRadius: "8px" }}
//                         />
//                       </Carousel.Item>
//                     ))}
//                   </Carousel>
//                 ) : (
//                   selectedProduct?.imageUrl && (
//                     <img
//                       src={selectedProduct.imageUrl}
//                       alt={selectedProduct.name}
//                       className="img-fluid rounded"
//                       style={{ maxHeight: "400px", objectFit: "cover" }}
//                     />
//                   )
//                 )}
//               </div>

//               <div className="col-md-6">
//                 <div
//                   className="p-3 bg-white shadow rounded fancy-scrollbar"
//                   style={{ maxHeight: "400px", overflowY: "auto" }}
//                 >
//                   <p><strong>{productText.description || "Description"}:</strong></p>
//                   <p>{selectedProduct?.description}</p>

//                   <p><strong>{productText.price || "Price"}:</strong> ₹{selectedProduct?.price}</p>

//                   {selectedProduct?.specs && selectedProduct.specs.length > 0 && (
//                     <>
//                       <div className="specs-container p-3 rounded mt-4" style={{
//                         background: theme === "dark" ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.4)',
//                         border: `1px solid ${theme === "dark" ? '#444' : '#ddd'}`,
//                         boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
//                       }}>
//                         <h6 className="specs-title mb-3" style={{ 
//                           color: theme === "dark" ? '#34495e' : '#34495e',
//                           background: theme === "dark" ? '#34495e' : '#f0f0f0',
//                           borderBottom: `2px solid ${theme === "dark" ? '#444' : '#eee'}`,
//                           paddingBottom: '10px'
//                         }}>
//                           {productText.specifications || "Specifications"}
//                         </h6>
//                         <div className="specs-grid">
//                           {selectedProduct.specs.map((spec, idx) => (
//                             <div 
//                               key={idx} 
//                               className="spec-item p-2 rounded mb-2"
//                               style={{
//                                 background: theme === "dark" ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.4)',
//                                 border: `1px solid ${theme === "dark" ? '#333' : '#eee'}`,
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 gap: '10px'
//                               }}
//                             >
//                               <div className="spec-number" style={{
//                                 minWidth: '28px',
//                                 height: '28px',
//                                 borderRadius: '50%',
//                                 background: theme === "dark" ? '#1f1f1f' : '#f0f0f0',
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 justifyContent: 'center',
//                                 fontSize: '0.8rem',
//                                 color: theme === "dark" ? '#fff' : '#666'
//                               }}>
//                                 {idx + 1}
//                               </div>
//                               <div className="spec-content" style={{
//                                 flex: 1,
//                                 display: 'flex',
//                                 justifyContent: 'space-between',
//                                 alignItems: 'center',
//                                 gap: '10px'
//                               }}>
//                                 <span className="spec-label" style={{
//                                   fontWeight: '500',
//                                   color: theme === "dark" ? '#ccc' : '#666'
//                                 }}>
//                                   {spec.label}
//                                 </span>
//                                 <span className="spec-value" style={{
//                                   color: theme === "dark" ? '#fff' : '#333',
//                                   background: theme === "dark" ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
//                                   padding: '4px 12px',
//                                   borderRadius: '4px',
//                                   fontSize: '0.9rem'
//                                 }}>
//                                   {spec.value}
//                                 </span>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </>
//                   )}

//                   <hr />
//                   <div className="d-flex justify-content-start gap-3 mt-3 pdf-hide">
//                     <a
//                       href={`https://wa.me/?text=${encodeURIComponent(
//                         `${productText.share || "Check out this product"}: ${selectedProduct?.name}\n${navbarText.welcome || "Welcome to Crosscrate International Exim"}!\n` +
//                         `https://www.crosscrate.com/product/${selectedProduct?._id}`
//                       )}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-success fs-5"
//                       title={productText.share || "Share Product"}
//                     >
//                       <FaWhatsapp />
//                     </a>
//                     <a
//                       href={`mailto:?subject=${encodeURIComponent(productText.share || "Check out this product")}: ${selectedProduct?.name}&body=${selectedProduct?.description}`}
//                       className="text-primary fs-5"
//                       title={productText.byEmail || "Share by Email"}
//                     >
//                       <FaEnvelope />
//                     </a>
//                     <a
//                       href="#"
//                       onClick={(e) => {
//                         e.preventDefault();
//                         handleDownloadPDF();
//                       }}
//                       className="text-danger fs-5"
//                       title={productText.downloadPdf || "Download PDF"}
//                     >
//                       <FaFilePdf />
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Modal.Body>

//           <Modal.Footer>
//             <Button variant="secondary" onClick={handlePrevious} disabled={currentIndex === 0}>
//               {actionsText.back}
//             </Button>
//             <Button
//               variant="secondary"
//               onClick={handleNext}
//               disabled={currentIndex === products.length - 1}
//             >
//               {actionsText.next || "Next"}
//             </Button>
//             <Button variant="danger" onClick={handleClose}>
//               {actionsText.close || "Close"}
//             </Button>
//           </Modal.Footer>
//         </motion.div>
//       </Modal>
//     </div>
//   );
// }

// export default Home;











//Trail UI 02-06-2025



import React, { useEffect, useState, useRef } from "react";
import { Button, Modal, Carousel } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaWhatsapp,
  FaEnvelope,
  FaFilePdf,
  FaStar,
  FaEye,
  FaArrowRight,
  FaGlobe,
  FaLeaf,
  FaShieldAlt
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import "./Home.css";
import axios from "axios";
import About from "../pages/About";
import MissionVision from "../pages/MissionVision";
import OurValues from "../pages/OurValues";
import Contact from "../pages/Contact";
import languageText from "../utils/languageText";
import Navbar from "../components/Navbar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  const navigate = useNavigate();

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
    if (!selectedProduct) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Add logo
    const logoUrl = "/logo.png";
    const logoImg = new Image();
    logoImg.src = logoUrl;

    logoImg.onload = async () => {
      pdf.addImage(logoImg, "PNG", 15, 15, 30, 30);

      // Company Info
      pdf.setFontSize(22);
      pdf.setTextColor(0, 102, 102);
      pdf.text("Crosscrate International Exim", 55, 25);
      pdf.setFontSize(12);
      pdf.setTextColor(50, 50, 50);
      pdf.text("Email: contact@crosscrate.com", 55, 33);
      pdf.text("Phone: +91 98765 43210", 55, 39);
      pdf.text("Website: www.crosscrate.com", 55, 45);
      pdf.text("Address: Al Ameen, Parimanam, Muttom-Allepey, Kerala, India- 690511", 55, 51);
      pdf.setDrawColor(180);
      pdf.line(10, 55, pageWidth - 10, 55);

      // Product Title
      pdf.setFontSize(14);
      pdf.setTextColor(60, 60, 60);
      pdf.text(`Product Details: ${selectedProduct?.name || ""}`, 15, 65);

      // Product Image
      let imgY = 75;
      let imgHeight = 60;
      let imgWidth = 80;
      let textX = 15 + imgWidth + 10;
      let textY = imgY;

      // Download product image as base64
      const getBase64ImageFromUrl = async (imageUrl) => {
        const res = await fetch(imageUrl);
        const blob = await res.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      };

      let imageUrl = selectedProduct.images?.[0] || selectedProduct.imageUrl;
      if (imageUrl) {
        const imgData = await getBase64ImageFromUrl(imageUrl);
        pdf.addImage(imgData, "JPEG", 15, imgY, imgWidth, imgHeight);
      }

      // Description
      pdf.setFontSize(12);
      pdf.setTextColor(0, 128, 64);
      pdf.text("Description", textX, textY + 5);
      pdf.setTextColor(60, 60, 60);
      pdf.setFontSize(10);
      const descriptionLines = pdf.splitTextToSize(selectedProduct?.description || "", pageWidth - textX - 10);
      pdf.text(
        descriptionLines,
        textX,
        textY + 12
      );

      // Price (green, bold, left-aligned, just below description)
      const lineHeight = 4; // tighter line height
      const descriptionHeight = descriptionLines.length * lineHeight;
      const priceY = textY + 12 + descriptionHeight + 5; // minimal padding
      pdf.setFontSize(12);
      pdf.setTextColor(0, 180, 0);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Price: ${selectedProduct?.price}`, textX, priceY);
      pdf.setFont("helvetica", "normal");

      // Specifications Table 
      if (selectedProduct?.specs?.length > 0) {
        autoTable(pdf, {
          startY: priceY + 10, // Start after price
          head: [["#", "Specification", "Value"]],
          body: selectedProduct.specs.map((spec, idx) => [
            idx + 1,
            spec.label,
            spec.value,
          ]),
          theme: "grid",
          headStyles: { fillColor: [16, 185, 129] },
          styles: { fontSize: 10 },
        });
      }

      pdf.save(`${selectedProduct?.name || "product"}.pdf`);
    };
  };

  // Get translations
  const navbarText = languageText[language]?.navbar || {};
  const productText = languageText[language]?.products || {};
  const adminText = languageText[language]?.admin || {};
  const actionsText = languageText[language]?.actions || {};

  const themeClass = theme === "dark" ? "dark-theme" : "light-theme";

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={`home-container ${theme} ${themeClass}`}
      style={{
        background:
          theme === "light"
            ? "linear-gradient(135deg, #e3f9f7, #fddaed)"
            : "linear-gradient(135deg, #202423, #191c1b)",
        minHeight: "100vh",
        transition: "background 0.5s ease",
      }}
    >
      {showLogoutAlert && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="alert alert-success alert-dismissible fade show position-fixed end-0 m-3 slide-in-alert"
          role="alert"
          style={{ zIndex: 9999, top: "70px" }}
        >
          Logout Successful!
        </motion.div>
      )}

      <Navbar
        isAdmin={isAdmin}
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        toggleTheme={toggleTheme}
        setShowLogoutAlert={setShowLogoutAlert}
      />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        
        {/* Animated Background Elements */}
        <div className="particles-container">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 100 - 50, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="hero-content">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="hero-header"
          >
            <div className="premium-badge">
              <HiSparkles className="sparkle-icon" />
              <span>PREMIUM QUALITY</span>
              <HiSparkles className="sparkle-icon" />
            </div>

            <h1 className="company-name">
              <span className="gradient-text">Crosscrate</span>
              <br />
              <span className="white-text">International Exim</span>
            </h1>

            <p className="company-tagline">
              Your trusted partner for premium cocopeat products.
              <br />
              <span className="highlight-text">Sustainable • Natural • High Quality</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hero-buttons"
          >
            <button
              className="primary-button"
              onClick={() => scrollToSection("products")}
            >
              Explore Products
              <FaArrowRight className="button-icon" />
            </button>
            <button
              className="secondary-button"
              onClick={() => scrollToSection("about")}
            >
              About Us
            </button>
          </motion.div>

          {/* Feature Icons */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="feature-icons"
          >
            <div className="feature-item">
              <FaGlobe className="feature-icon global-icon" />
              <span>Global Export</span>
            </div>
            <div className="feature-item">
              <FaLeaf className="feature-icon natural-icon" />
              <span>100% Natural</span>
            </div>
            <div className="feature-item">
              <FaShieldAlt className="feature-icon quality-icon" />
              <span>Quality Assured</span>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="scroll-indicator"
        >
          <div className="scroll-mouse">
            <div className="scroll-wheel"></div>
          </div>
        </motion.div>
      </section>

      {/* Products Section */}
      <section className="products-section" id="products">
        <div className="container">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2 className={`section-title ${theme === "dark" ? "text-white" : ""}`}>
              Our Premium Products
            </h2>
            <p className={`section-subtitle ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Discover our range of high-quality cocopeat products, carefully crafted for your gardening and
              agricultural needs.
            </p>
          </motion.div>

          <div className="products-grid">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="product-card-wrapper"
                onClick={() => openModal(product)}
              >
                <div className={`enhanced-product-card ${theme === "dark" ? "dark" : ""}`}>
                  {/* Product Image */}
                  <div className="product-image-container">
                    <img
                      src={product.images?.[0] || product.imageUrl}
                      alt={product.name}
                      className="product-image"
                    />
                    <div className="image-overlay"></div>
                    <div className="product-price-tag">₹{product.price}</div>
                    <div className="view-details-overlay">
                      <button className="view-details-button">
                        <FaEye className="view-icon" />
                        View Details
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="product-info">
                    <h3 className={`product-title ${theme === "dark" ? "text-white" : ""}`}>
                      {product.name}
                    </h3>
                    <p className={`product-description ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                      {product.description}
                    </p>

                    {/* Tags */}
                    <div className="product-tags">
                      {product.tags?.map((tag, idx) => (
                        <span key={idx} className="product-tag">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Rating */}
                    <div className="product-rating">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="star-icon" />
                      ))}
                      <span className={`rating-count ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                        (4.8)
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Other Sections */}
      <div className="other-sections">
        <div className="container" id="about">
          <About language={language} />
        </div>
        <div className="container" id="mission">
          <MissionVision language={language} />
        </div>
        <div className="container" id="values">
          <OurValues language={language} />
        </div>
        <div className="container" id="contact">
          <Contact language={language} />
        </div>
      </div>

      {/* Product Details Modal */}
      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        size="xl"
        className="product-modal fade modal-fade"
        backdrop="static"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Modal.Header
            closeButton
            className="enhanced-modal-header"
          >
            <Modal.Title className="w-100 text-center fw-bold">
              {selectedProduct?.name || productText.productDetails || "Product Details"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="enhanced-modal-body">
            <div className="row" ref={productDetailsRef}>
              <div className="col-md-6">
                {selectedProduct?.images?.length > 0 ? (
                  <Carousel fade className="enhanced-carousel">
                    {selectedProduct.images.map((imgUrl, idx) => (
                      <Carousel.Item key={idx}>
                        <img
                          src={imgUrl || "/placeholder.svg"}
                          alt={`Slide ${idx}`}
                          className="carousel-image"
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                ) : (
                  selectedProduct?.imageUrl && (
                    <img
                      src={selectedProduct.imageUrl || "/placeholder.svg"}
                      alt={selectedProduct.name}
                      className="single-product-image"
                    />
                  )
                )}
              </div>

              <div className="col-md-6">
                <div className="product-details fancy-scrollbar">
                  <div className="product-description-section">
                    <h4 className="detail-section-title">Description</h4>
                    <p className="detail-text">{selectedProduct?.description}</p>
                  </div>

                  <div className="product-price-section">
                    <span className="product-price">₹{selectedProduct?.price}</span>
                  </div>

                  {selectedProduct?.specs && selectedProduct.specs.length > 0 && (
                    <div className="product-specs-section">
                      <h5 className="specs-title">Specifications</h5>
                      <div className="specs-list">
                        {selectedProduct.specs.map((spec, idx) => (
                          <div key={idx} className="spec-item">
                            <span className="spec-label">{spec.label}</span>
                            <span className="spec-value">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  
                  <div className="product-actions pdf-hide">
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `${productText.share || "Check out this product"}: ${selectedProduct?.name}\n${navbarText.welcome || "Welcome to Crosscrate International Exim"}!\n` +
                        `https://www.crosscrate.com/product/${selectedProduct?._id}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-button whatsapp-button"
                      title={productText.share || "Share Product"}
                    >
                      <FaWhatsapp className="action-icon" />
                      WhatsApp
                    </a>
                    <a
                      href={`mailto:?subject=${encodeURIComponent(productText.share || "Check out this product")}: ${selectedProduct?.name}&body=${selectedProduct?.description}`}
                      className="action-button email-button"
                      title={productText.byEmail || "Share by Email"}
                    >
                      <FaEnvelope className="action-icon" />
                      Email
                    </a>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDownloadPDF();
                      }}
                      className="action-button pdf-button"
                      title={productText.downloadPdf || "Download PDF"}
                    >
                      <FaFilePdf className="action-icon" />
                      PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>


          <Modal.Footer className="enhanced-modal-footer">
            <Button
              variant="outline-secondary"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="navigation-button prev-button"
            >
              ← {actionsText.back || "Previous"}
            </Button>
            <Button
              variant="outline-secondary"
              onClick={handleNext}
              disabled={currentIndex === products.length - 1}
              className="navigation-button next-button"
            >
              {actionsText.next || "Next"} →
            </Button>
            <Button 
              variant="danger" 
              onClick={handleClose}
              className="close-button"
            >
              {actionsText.close || "Close"}
            </Button>
          </Modal.Footer>
        </motion.div>
      </Modal>
    </div>
  );
}

export default Home;


