/* eslint-disable react/prop-types */
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ role, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/" className="logo-link">
          Logo
        </Link>
      </div>

      <div className="menu">
        {role == null && (
          <>
            <Link to="/products" className="menu-item">
              Products
            </Link>
            <Link to="/register" className="menu-item">
              Register
            </Link>
            <Link to="/login" className="menu-item">
              Login
            </Link>
          </>
        )}

        {/* Conditional rendering based on the role */}
        {role === "admin" && (
          <>
            <Link to="/management" className="menu-item">
              Management
            </Link>
          </>
        )}

        {role === "customer" && (
          <>
            <Link to="/my-orders" className="menu-item">
              My Orders
            </Link>
            <Link to="/cart" className="menu-item">
              Cart
            </Link>
            <Link to="/wishlist" className="menu-item">
              Wishlist
            </Link>
          </>
        )}

        {role && (
          <>
            <Link to="/products" className="menu-item">
              Products
            </Link>
            <Link to="/profile" className="menu-item">
              Profile
            </Link>
            <button className="menu-item" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
