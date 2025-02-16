import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import APIServices from './APIservices'; // Import the API service
import './AddRecipe.css';

const AddRecipe = () => {
  const [recipeName, setRecipeName] = useState('');
  const [recipeImage, setRecipeImage] = useState(null);
  const [recipeDescription, setRecipeDescription] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '' }]);
  };

  const handleIngredientChange = (index, event) => {
    const newIngredients = [...ingredients];
    newIngredients[index][event.target.name] = event.target.value;
    setIngredients(newIngredients);
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleImageChange = (event) => {
    setRecipeImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title', recipeName);
    formData.append('description', recipeDescription);
    formData.append('image', recipeImage);
    formData.append('ingredients', JSON.stringify(ingredients));
    try {
      await APIServices.addRecipe(formData);
      navigate('/home');
    } catch (error) {
      setErrorMessage(error.message || 'Failed to add recipe.');
    }
  };

  return (
    <form className="add-recipe-container" onSubmit={handleSubmit}>
      <h2>Add a New Recipe</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="form-group">
        <label>Recipe Name:</label>
        <input 
          type="text" 
          value={recipeName} 
          onChange={(e) => setRecipeName(e.target.value)} 
          required 
        />
      </div>

      <div className="form-group">
        <label>Recipe Image:</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange} 
          required 
        />
      </div>

      <div className="form-group">
        <label>Recipe Description:</label>
        <textarea 
          value={recipeDescription} 
          onChange={(e) => setRecipeDescription(e.target.value)} 
          required 
        />
      </div>

      <div className="form-group">
        <label>Ingredients:</label>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="ingredient">
            <input 
              type="text" 
              name="name" 
              placeholder="Ingredient Name" 
              value={ingredient.name} 
              onChange={(e) => handleIngredientChange(index, e)} 
              required 
            />
            <input 
              type="text" 
              name="quantity" 
              placeholder="Quantity" 
              value={ingredient.quantity} 
              onChange={(e) => handleIngredientChange(index, e)} 
              required 
            />
            <button type="button" onClick={() => handleRemoveIngredient(index)} className="remove-button">
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddIngredient} className="add-button">Add Ingredient</button>
      </div>

      <button type="submit">Submit Recipe</button>
    </form>
  );
};

export default AddRecipe;
