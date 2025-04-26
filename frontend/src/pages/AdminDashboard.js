import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "", weight: "", expansion: "", dimension: "", compositions: "" });
  const [photo, setPhoto] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", description: "", price: "", weight: "", expansion: "", dimension: "", compositions: "" });
  const [heroPhoto, setHeroPhoto] = useState(null);
  const [heroPreview, setHeroPreview] = useState(null);

  const fetchProducts = async () => {
    const res = await axios.get("/api/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    formData.append("item", newProduct.item);
    formData.append("weight", newProduct.weight);
    formData.append("expansion", newProduct.expansion);
    formData.append("dimension", newProduct.dimension);
    formData.append("compositions", newProduct.compositions);
    if (photo) formData.append("photo", photo);

    try {
      await axios.post("/api/products/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      alert("Product uploaded!");
      setNewProduct({ name: "", description: "", price: "", item: "", weight: "", expansion: "", dimension: "", compositions: "" });
      setPhoto(null);
      fetchProducts();
    } catch (err) {
      console.error("Product upload failed:", err);
      alert("Product upload failed");
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

  const deleteProduct = async (id) => {
    await axios.delete(`/api/products/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    fetchProducts();
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setEditData({ name: product.name, description: product.description, price: product.price, item: product.item, weight: product.weight, expansion: product.expansion, dimension: product.dimension, compositions: product.compositions });
  };

  const saveEdit = async (id) => {
    await axios.put(`/api/products/${id}`, editData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    setEditingId(null);
    fetchProducts();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>

      <form onSubmit={addProduct} className="mb-4">
        <input type="text" placeholder="Product Name" className="form-control mb-2"
          value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} required />
        <textarea className="form-control mb-2" rows={6} value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} />
        <input type="number" placeholder="Price" className="form-control mb-2"
          value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} required />
          <input type="text" placeholder="Item" className="form-control mb-2"
          value={newProduct.item} onChange={(e) => setNewProduct({ ...newProduct, item: e.target.value })} required />
        <input type="text" placeholder="Weight" className="form-control mb-2"
          value={newProduct.weight} onChange={(e) => setNewProduct({ ...newProduct, weight: e.target.value })} required />
        <input type="text" placeholder="Expansion" className="form-control mb-2"
          value={newProduct.expansion} onChange={(e) => setNewProduct({ ...newProduct, expansion: e.target.value })} required />
        <input type="text" placeholder="Dimension" className="form-control mb-2"
          value={newProduct.dimension} onChange={(e) => setNewProduct({ ...newProduct, dimension: e.target.value })} required />
        <input type="text" placeholder="Compositions" className="form-control mb-2"
          value={newProduct.compositions} onChange={(e) => setNewProduct({ ...newProduct, compositions: e.target.value })} required />
        <input type="file" className="form-control mb-2" onChange={(e) => setPhoto(e.target.files[0])} />
        <button type="submit" className="btn btn-success">Add Product</button>
      </form>

      <div className="mb-5">
        <h4>Update Hero Image</h4>
        <form onSubmit={uploadHeroImage}>
          <input type="file" className="form-control mb-2" onChange={(e) => {
            setHeroPhoto(e.target.files[0]);
            setHeroPreview(URL.createObjectURL(e.target.files[0]));
          }} />
          {heroPreview && <img src={heroPreview} alt="Hero Preview" className="img-fluid mb-2" style={{ maxHeight: '200px' }} />}
          <button type="submit" className="btn btn-primary">Upload Hero Image</button>
        </form>
      </div>

      <h4>Current Products</h4>
      <div className="row">
        {products.map((product) => (
          <div key={product._id} className="col-md-4 mb-3">
            <div className="card">
              {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="card-img-top" style={{ height: "200px", objectFit: "cover" }} />}
              <div className="card-body">
                {editingId === product._id ? (
                  <>
                    <input type="text" className="form-control mb-2" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                    <textarea className="form-control mb-2" rows={6} value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} />
                    <input type="number" placeholder="Price" className="form-control mb-2" value={editData.price} onChange={(e) => setEditData({ ...editData, price: e.target.value })} />
                    <input type="text" placeholder="Item" className="form-control mb-2" value={editData.item} onChange={(e) => setEditData({ ...editData, item: e.target.value })} />
                    <input type="text" placeholder="Weight" className="form-control mb-2" value={editData.weight} onChange={(e) => setEditData({ ...editData, weight: e.target.value })} />
                    <input type="text" placeholder="Expansion" className="form-control mb-2" value={editData.expansion} onChange={(e) => setEditData({ ...editData, expansion: e.target.value })} />
                    <input type="text" placeholder="Dimension" className="form-control mb-2" value={editData.dimension} onChange={(e) => setEditData({ ...editData, dimension: e.target.value })} />
                    <input type="text" placeholder="Composition" className="form-control mb-2" value={editData.compositions} onChange={(e) => setEditData({ ...editData, compositions: e.target.value })} />
                    <button className="btn btn-primary btn-sm me-2" onClick={() => saveEdit(product._id)}>Save</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">{product.description}</p>
                    <p className="card-text text-success">₹{product.price}</p>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => startEdit(product)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(product._id)}>Delete</button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
