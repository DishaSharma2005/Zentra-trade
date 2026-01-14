import React from "react";
import {Link,useNavigate} from "react-router-dom";
//import Signup from "../auth/signup";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

function Navbar() {

   const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
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
              <Link className="nav-link fw-medium" to="/signup">
                Sign Up
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-medium" to="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link  className="nav-link fw-medium" to="/product">
                Products
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-medium" to="/pricing">
                Pricing
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-medium" to="/support">
                Support
              </Link>
            </li>{/* AUTH BASED LINKS */}
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-medium" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary px-3" to="/signup">
                    Sign Up
                  </Link>
                </li>
              </>
            ) : (<>
                <li className="nav-item">
                  <Link className="nav-link fw-medium" to="/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-danger px-3"
                    onClick={handleLogout}
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
