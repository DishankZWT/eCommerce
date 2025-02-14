import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Navbar from "./components/navbar";
import Login from "./components/login";
import Register from "./components/register";
import Products from "./components/products";
import Profile from "./components/profile";
import Management from "./components/management";
import Orders from "./components/userControl/Orders";
import Cart from "./components/userControl/Cart";
import Wishlist from "./components/userControl/Wishlist";
import Home from "./components/home";

function App() {
  const [role, setRole] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  const handleLoginSuccess = (token) => {
    const decoded = jwtDecode(token);
    setRole(decoded.role);
    setId(decoded.id);
    localStorage.setItem("authToken", token);
  };

  const handleLogout = () => {
    setRole(null);
    localStorage.removeItem("authToken");
  };

  return (
    <Router>
      <Navbar role={role} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={<Login onLoginSuccess={handleLoginSuccess} />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products role={role} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/management" element={<Management />} />
        <Route path="/my-orders" element={<Orders id={id} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
    </Router>
  );
}

export default App;
