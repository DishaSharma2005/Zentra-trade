import {Link,useNavigate} from "react-router-dom";
//import Signup from "../auth/signup";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

function Navbar({ onAddFunds }) {

   const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };
  const handleNavClick = () => {
  const navbar = document.querySelector(".navbar-collapse");
  if (navbar) {
    navbar.classList.remove("show");
  }
};
  
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom shadow-sm">
      <div className="container py-2">
        {/* Brand Logo */}
        <a className="navbar-brand d-flex align-items-center" href="/">
          <img
            src="media/images/logo.svg"
            alt="Zerodha Logo"
            className="img-fluid"
            style={{ width: "130px" }}
          />
        </a>

        {/* Toggle Button (for mobile) */}
        <button 
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav gap-3">
            <li className="nav-item">
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-medium" to="/about" onClick={handleNavClick}>
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link  className="nav-link fw-medium" to="/product" onClick={handleNavClick}>
                Products
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-medium" to="/pricing" onClick={handleNavClick}>
                Pricing
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-medium" to="/support" onClick={handleNavClick}>
                Support
              </Link>
            </li>{/* AUTH BASED LINKS */}
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-medium" to="/login"  onClick={handleNavClick}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                <Link className="nav-link fw-medium" to="/signup" onClick={handleNavClick}>
                Sign Up
              </Link>
                </li>
              </>
            ) : (<>
                <li className="nav-item">
                  <Link className="nav-link fw-medium" to="/dashboard" onClick={handleNavClick}>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-danger px-2.5 py-1"
                    onClick={() => {
                    handleNavClick();
                    handleLogout();
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
