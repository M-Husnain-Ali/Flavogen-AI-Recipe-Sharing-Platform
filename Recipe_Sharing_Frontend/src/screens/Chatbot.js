import React, { useState } from "react";
import APIServices from "./APIservices";
import "./Chatbot.css";

export const Chatbot = () => {
  const [userQuery, setUserQuery] = useState("");
  const [chatbotResponse, setChatbotResponse] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setUserQuery(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    setLoading(true);
    setRecipes([]); // Clear previous recipes
    setChatbotResponse(""); // Clear previous chatbot message
    try {
      const response = await APIServices.chatbotQuery(userQuery);
      setChatbotResponse(response.message);

      if (response.recipes) {
        setRecipes(response.recipes);
      }
    } catch (error) {
      setChatbotResponse("Error: Unable to fetch response.");
    } finally {
      setLoading(false);
      setUserQuery(""); 
    }
  };
  if (recipes.length === 0 && !chatbotResponse) {
    return (
      <>
      <div className="chatbot-container">
      <div className="chatbot-header">
        <h1>Chatbot</h1>
      </div>
        <div className="chatbot-mess1">
          <div className="chatbot-placeholder">
            <h3>FlavoGen</h3>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="chatbot-form">
        <input
          type="text"
          value={userQuery}
          onChange={handleInputChange}
          placeholder="Ask me anything..."
          className="chatbot-input"
        />
        <button type="submit" className="chatbot-submit-btn" disabled={loading}>
          {loading ? "Loading..." : "Send"}
        </button>
      </form>
        </div>
      </>
    );
  }
  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h1>Chatbot</h1>
      </div>
      <div className="chatbot-messages">
        {chatbotResponse && (
          <p className="chatbot-message">{chatbotResponse}</p>
        )}
        {recipes.map((recipe, index) => (
          <div key={index} className="chatbot-recipe">
            <img
              src={`http://127.0.0.1:8000/${recipe.image}`}
              alt={recipe.title}
              className="chatbot-recipe-image"
            />
            <p>
              <strong>{recipe.title}</strong> is a wonderful and outstanding
              recipe. {recipe.description} Its average rating is{" "}
              {recipe.average_rating}.
            </p>
            <p>
              These ingredients are required to make this recipe:
              <ul>
                {recipe.ingredients.map((ingredient, i) => (
                  <li key={i}>
                    {ingredient.name} - {ingredient.quantity}
                  </li>
                ))}
              </ul>
            </p>
            <p>
              I hope this will help you out and you will make{" "}
              <strong>{recipe.title}</strong> easily. Happy Cooking!
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chatbot-form">
        <input
          type="text"
          value={userQuery}
          onChange={handleInputChange}
          placeholder="Ask me anything..."
          className="chatbot-input"
        />
        <button type="submit" className="chatbot-submit-btn" disabled={loading}>
          {loading ? "Loading..." : "Send"}
        </button>
      </form>
    </div>
  );
};
