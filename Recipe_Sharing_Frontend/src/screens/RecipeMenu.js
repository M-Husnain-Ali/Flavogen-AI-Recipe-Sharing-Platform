import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import APIServices from './APIservices';
import './RecipeMenu.css';

export const RecipeMenu = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch recipes on component mount
  useEffect(() => {
    const getRecipes = async () => {
      try {
        const data = await APIServices.fetchRecipes();
        setRecipes(data); // Ensure API returns recipes in expected structure
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    getRecipes();
  }, []);

  if (loading) {
    return <p>Loading recipes...</p>;
  }

  if (error) {
    return <p>Error: {error.message || "Failed to load recipes."}</p>;
  }

  return (
    <div className="recipe-container">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="recipe-box">
          <Link to={`/recipe/${recipe.id}`} className="recipe-link">
            <img
              src={recipe.image || '../Recipe.png'} 
              alt={recipe.title}
              className="recipe-image"
            />
            <h3 className="recipe-name">{recipe.title}</h3>
          </Link>
        </div>
      ))}
    </div>
  );
};
