import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import APIServices from "./APIservices";
import "./Search.css";

export default function Search() {
  const [searchRecipes, setSearchRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract query parameter from the URL
  const query = new URLSearchParams(location.search).get("search");

  useEffect(() => {
    const fetchSearchRecipes = async () => {
      try {
        if (!query) {
          setSearchRecipes([]); // No query, no results
          setLoading(false);
          return;
        }
        const data = await APIServices.searchRecipes(query); // Call the API with the query
        setSearchRecipes(data);
      } catch (err) {
        setError("Failed to fetch search results.");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchRecipes();
  }, [query]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  if (searchRecipes.length === 0) {
    return (
        <>
      <div className="bookmarkedRecipes">
        <h1>Search Result</h1>
        </div>

        <div className="Logincontainer">
          <h1>No result Found</h1>
          <div className="Spacecontainer">
        <div className="return-button">
          <button
            className="return"
            type="button"
            onClick={() => navigate("/home")}
          >
            Return
          </button>
        </div>
        </div>
        </div>
        </>
    );
  }

  return (
    <div>
      <div className="bookmarkedRecipes">
        <h1>Search Result</h1>
      </div>

      <div className="recipe-container">
        {searchRecipes.map((recipe) => (
          <div key={recipe.id} className="recipe-box">
            <Link to={`/recipe/${recipe.id}`} className="recipe-link">
              <img
                src={
                  `http://127.0.0.1:8000/${recipe.image}` || "../Recipe.png"
                }
                alt={recipe.title}
                className="recipe-image"
              />
              <h3 className="recipe-name">{recipe.title}</h3>
            </Link>
          </div>
        ))}
      </div>

      <div className="return-button">
        <button
          className="return"
          type="button"
          onClick={() => navigate("/home")}
        >
          Return
        </button>
      </div>
    </div>
  );
}
