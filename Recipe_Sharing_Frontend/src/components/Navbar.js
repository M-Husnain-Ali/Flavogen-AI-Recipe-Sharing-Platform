import React, {useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?search=${searchTerm.trim()}`); // Pass the query parameter
    }
  };

  return (
    <div className="navbarContainer">
      <ul className="onavbar">
        <li className="listItem">
        <Link to="/Home" className="link">
            Home
          </Link>
        </li>
        <li className="listItem">
          <Link to="/add-recipe" className="link">
            Add Recipe
          </Link>
        </li>
        <li className="listItem">
          <Link to="/bookmark-view" className="link">
            Bookmark View
          </Link>
        </li>
        <li className="listItem">
        <Link to="/chatbot" className="link">
            AI Assitance
          </Link>
        </li>
        <li className="listItem">
          <a href="#about" className="link">
            About
          </a>
        </li>
        <li className="listItem">
          <a href="#contact" className="link">
            Contact
          </a>
        </li>
        <li className="listItem">
        <Link to="/Feedback" className="link">
        Feedback
          </Link>
        </li>
        </ul>
      <li className="searchContainer">
        <input
          type="text"
          placeholder="Search..."
          className="searchInput"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
        />
        <button className="searchButton" onClick={handleSearch}>
          Search
        </button>
      </li>
    </div>
  );
};

export default Navbar;
