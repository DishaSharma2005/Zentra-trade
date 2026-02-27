import React, { useState } from "react";
import { Link } from "react-router-dom";

const Menu = ({ onAddFunds }) => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropDownOpen, setIsProfileDropDownOpen] = useState(false);

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
  };

  const handleProfileClick = () => {
    setIsProfileDropDownOpen(!isProfileDropDownOpen);
  };

  return (
    <div className="menu-container">

      <img src="/media/images/logo.svg" className="logo" alt="logo" />

      <div className="menus">
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
          {onAddFunds && (
            <li>
              <p
                className="menu add-funds-menu"
                onClick={() => {
                  onAddFunds();
                }}
              >
                Add Funds
              </p>
            </li>
          )}
        </ul>

        <hr />

        <div className="profile" onClick={handleProfileClick}>
          <div className="avatar">ZU</div>
          <p className="username">USERID</p>
        </div>

        {isProfileDropDownOpen && (
          <div className="profile-dropdown">
            <p>My Profile</p>
            <p>Logout</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
