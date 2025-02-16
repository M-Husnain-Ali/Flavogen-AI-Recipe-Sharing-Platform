import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import APIServices from "./APIservices";
import "./Bookmark.css";

export default function Bookmark() {
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("user"));
  const currentUserId = userData.id;

  useEffect(() => {
    const fetchBookmarkedRecipes = async () => {
      try {
        // Step 1: Fetch all the bookmarks (including other users' bookmarks)
        const bookmarksData = await APIServices.fetchBookmarkedRecipes();

        // Step 2: Filter the bookmarks to only include the current user's bookmarks
        const userBookmarks = bookmarksData.filter(
          (bookmark) => bookmark.user === currentUserId
        );

        // Step 3: Fetch the details for each bookmarked recipe
        const recipePromises = userBookmarks.map(async (bookmark) => {
          const recipeData = await APIServices.fetchSpecificRecipes({
            id: bookmark.recipe,
          });
          return recipeData;
        });

        // Wait for all the recipes to be fetched
        const recipes = await Promise.all(recipePromises);

        // Step 4: Update the state with the fetched recipes
        setBookmarkedRecipes(recipes);
        setLoading(false);
      } catch (error) {
        setError("Failed to load bookmarked recipes");
        setLoading(false);
      }
    };

    fetchBookmarkedRecipes();
  }, [currentUserId]); // Make sure to refetch when currentUserId changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  if (bookmarkedRecipes.length === 0) {
    return (
      <>
        <div className="bookmarkedRecipes">
        <h1>Bookmark View</h1>
        </div>

        <div className="Logincontainer">
          <h1>Currently you have no Bookmark</h1>
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
        <h1>Bookmark View</h1>
      </div>
      <div className="recipe-container">
        {bookmarkedRecipes.map((recipe) => (
          <div key={recipe.id} className="recipe-box">
            <Link to={`/recipe/${recipe.id}`} className="recipe-link">
              <img
                src={recipe.image || "/Recipe.png"} // Use recipe image or fallback
                alt={recipe.title || "Recipe"}
                className="recipe-image"
              />
              <h3 className="recipe-name">
                {recipe.title || "Untitled Recipe"}
              </h3>
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
