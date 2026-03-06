import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../supabaseClient";

const Menu = ({ onAddFunds }) => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const { user, logout } = useAuth(); // assuming logout exists
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const ref = useRef(null);
  const mobileMenuRef = useRef(null);

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
    setIsMobileMenuOpen(false); // Close menu on click
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const displayName = user?.email?.split("@")[0] || "User";
  const initials = displayName.substring(0, 2).toUpperCase();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        // Option to close mobile menu if clicked outside
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="menu-container">
      <img src="/media/images/logo.svg" className="logo" alt="logo" />

      {/* Mobile Hamburger Icon */}
      <div 
        className="hamburger-icon" 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <i className={isMobileMenuOpen ? "fa fa-times" : "fa fa-bars"}></i>
      </div>

      <div className={`menus ${isMobileMenuOpen ? "mobile-open" : ""}`} ref={mobileMenuRef}>
        <ul>
          <li>
            <Link to="/" style={{ textDecoration: "none" }}>
              <p
                className={selectedMenu === -1 ? activeMenuClass : menuClass}
                onClick={() => handleMenuClick(-1)}
              >
                Home
              </p>
            </Link>
          </li>
          <li>
            <Link to="/dashboard" style={{ textDecoration: "none" }}>
              <p
                className={selectedMenu === 0 ? activeMenuClass : menuClass}
                onClick={() => handleMenuClick(0)}
              >
                Dashboard
              </p>
            </Link>
          </li>
          <li>
            <Link to="/dashboard/orders" style={{ textDecoration: "none" }}>
              <p
                className={selectedMenu === 1 ? activeMenuClass : menuClass}
                onClick={() => handleMenuClick(1)}
              >
                Orders
              </p>
            </Link>
          </li>
          <li>
            <Link to="/dashboard/holdings" style={{ textDecoration: "none" }}>
              <p
                className={selectedMenu === 2 ? activeMenuClass : menuClass}
                onClick={() => handleMenuClick(2)}
              >
                Holdings
              </p>
            </Link>
          </li>
          <li>
            <Link to="/dashboard/transactions" style={{ textDecoration: "none" }}>
              <p
                className={selectedMenu === 3 ? activeMenuClass : menuClass}
                onClick={() => handleMenuClick(3)}
              >
                Transactions
              </p>
            </Link>
          </li>
        </ul>

        <div className="right-actions">
          {onAddFunds && (
            <div className="add-funds-wrapper">
               <p
                  className="menu add-funds-menu"
                  onClick={() => {
                    onAddFunds();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Add Funds
                </p>
            </div>
          )}

          <div className="profile-wrapper" ref={ref}>
            {/* Trigger */}
            <div className="profile-trigger" onClick={() => setOpen(!open)}>
              <div className="profile-avatar">{initials}</div>
              <span className="profile-name desktop-only">{displayName}</span>
            </div>

            {/* Dropdown */}
            {open && (
              <div className="profile-dropdown-card">
                <div className="profile-card-header">
                  <div className="profile-avatar large">{initials}</div>
                  <div>
                    <strong>{displayName}</strong>
                    <p>{user?.email}</p>
                  </div>
                </div>

                <hr />

                <div
                  className="logout-item"
                  onClick={handleLogout}
                >
                  Log out
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
