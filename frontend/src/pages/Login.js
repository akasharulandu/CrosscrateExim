import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login({ setIsAdmin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", { username, password });
      localStorage.setItem("token", res.data.token);
      setIsAdmin(true);
      navigate("/dashboard");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input type="text" className="form-control mb-3" placeholder="Username"
          value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" className="form-control mb-3" placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="btn btn-primary">Login</button>
        <Link to="/" className="btn btn-link ms-2">Back to Homepage</Link>
      </form>
    </div>
  );
}

export default Login;
