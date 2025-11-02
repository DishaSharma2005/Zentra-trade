import React from "react";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom shadow-sm">
      <div className="container py-2">
        {/* Brand Logo */}
        <a className="navbar-brand d-flex align-items-center" href="#">
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
              <a className="nav-link fw-medium" href="#">
                Sign Up
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link fw-medium" href="#">
                About
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link fw-medium" href="#">
                Products
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link fw-medium" href="#">
                Pricing
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link fw-medium" href="#">
                Support
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
