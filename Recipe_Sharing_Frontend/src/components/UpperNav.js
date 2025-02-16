import React from "react";
import "./UpperNav.css";
import { Link } from "react-router-dom";

const UpperNav = ({ userName, email}) => {
  return (
    <div>
      <ul className="navbar">
        {/* Logo Section */}
        <li className="logoItem">
          <Link to="/home" className="link">
            <img src="../Recipe.png" alt="Logo" className="logo" />
          </Link>
        </li>

        {/* Center Text */}
        <li className="centerTextItem">
          <span className="centerText">AI Recipe System "</span>
          <span className="centerText1">FlavoGen</span>
          <span className="centerText">"</span>
        </li>

        {/* User Profile */}
        {userName?
        <li className="userItem">
          <div className="userNameBox">
            <Link
              to={{
                pathname: "/Profile",
              }}
              state={{ userName, email}}
              className="link"
            >
              <span className="userName">{userName.charAt(0).toUpperCase()}</span>
            </Link>
          </div>
        </li>:<li className="userItem">
          <div className="userNameBox">
            <Link
              to={{
                pathname: "/",
              }}
              className="link"
            >
              <span className="userName">Login</span>
            </Link>
          </div>
        </li>}
      </ul>
    </div>
  );
};

export default UpperNav;
