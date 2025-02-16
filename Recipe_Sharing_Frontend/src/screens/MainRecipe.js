import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaShareAlt, FaBookmark, FaStar } from "react-icons/fa";
import APIServices from "./APIservices";
import "./MainRecipe.css";

export const MainRecipe = () => {
  const { id } = useParams(); // Use the `id` from the URL
  const [rating, setRating] = useState(0); // Rating state
  const [hover, setHover] = useState(0); // Hover state
  const [showCommentInput, setShowCommentInput] = useState(false); // Comment input visibility
  const [comment, setComment] = useState(""); // Comment input value
  const [commentsList, setCommentsList] = useState([]); // Comments list
  const [message, setMessage] = useState(""); // Success/Error message
  const [showSharePopup, setShowSharePopup] = useState(false); // Share popup visibility
  const [showRatePopup, setShowRatePopup] = useState(false); // Share popup visibility
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const handleBookmark = async () => {
    try {
      const response = await APIServices.bookmarkRecipe(recipe.id);
      setMessage(response.message || "Recipe bookmarked successfully!");
      setTimeout(() => setMessage(""), 1000); // Clear message
    } catch (error) {
      setMessage(error.message || "Failed to bookmark the recipe.");
      setTimeout(() => setMessage(""), 1000);
    }
  };

  const handleShareClick = () => setShowSharePopup(true); // Show share popup
  const handleRateClick = () => setShowRatePopup(true); // Show rate popup

  const handleCopyURL = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setMessage("URL copied to clipboard!");
      setTimeout(() => setMessage(""), 1000); // Clear message
    });
  };

  const handleShareClosePopup = () => setShowSharePopup(false); // Close share popup
  const handleRateClosePopup = () => setShowRatePopup(false);

  const handleAddComment = async () => {
    if (comment.trim()) {
      try {
        const newComment = await APIServices.addComment(recipe.id, {
          content: comment,
        });
        setCommentsList([...commentsList, newComment]);
        setComment("");
        setShowCommentInput(false);
      } catch (error) {
        alert(`Failed to add comment: ${error.message}`);
      }
    } else {
      alert("Comment cannot be empty!");
    }
  };

  const handleCancelComment = () => {
    setComment("");
    setShowCommentInput(false);
  };

  useEffect(() => {
    const getRecipe = async () => {
      try {
        const data = await APIServices.fetchSpecificRecipes({ id });
        setRecipe(data);
        setCommentsList(data.comments || []);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    if (id) {
      getRecipe();
    } else {
      setError(new Error("No recipe ID provided."));
      setLoading(false);
    }
  }, [id]);


  const handleRate = async () => {
    if (rating === 0) {
      setMessage("Please select a rating!");
      setTimeout(() => setMessage(""), 1000);
      return;
    }

    try {
      const response = await APIServices.addRating(id, { rating });
      setRecipe((prev) => ({
        ...prev,
        average_rating: response.average_rating, // Update the recipe's average rating
      }));
      setMessage("Thank you for your rating!");
      setTimeout(() => setMessage(""), 2000); // Clear message after 2 seconds
      setShowRatePopup(false); // Close rating popup
    } catch (error) {
      setMessage("You have already submit your rating for this recipe.");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  if (loading) return <p>Loading recipe...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="main-recipe-container">
      <img
        src={recipe.image || "../Recipe.png"}
        alt={recipe.title}
        className="recipe-image"
      />
      <h1 className="recipe-name">{recipe.title}</h1>
      {(!showRatePopup) && (!showSharePopup) && (
        <div className="message-container">
          {message && <p className="message">{message}</p>}
        </div>
      )}


      <div className="star-rating">
        <h3>Average Rating</h3>
        <div className="starkey">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${
                star <= recipe.average_rating ? "filled" : ""
              }`}
            >
              ★
            </span>
          ))}
        </div>
      </div>
      <div className="share-bookmark-rate-container">
        <div className="icon-section" onClick={handleShareClick}>
          <FaShareAlt title="Share this recipe" className="icon" />
          <p className="icon-label">Share</p>
        </div>
        <div className="icon-section" onClick={handleBookmark}>
          <FaBookmark title="Bookmark this recipe" className="icon" />
          <p className="icon-label">Bookmark</p>
        </div>
        <div className="icon-section" onClick={handleRateClick}>
          <FaStar title="Rate this recipe" className="icon" />
          <p className="icon-label">Rate</p>
        </div>
      </div>

      <div className="description-section">
        <h2 className="description-heading">Description</h2>
        <p className="description-text">{recipe.description}</p>
      </div>

      <div className="ingredients-section">
        <h2 className="ingredients-heading">Ingredients</h2>
        <div className="ingredients-list">
          {recipe.ingredients && recipe.ingredients.length > 0 ? (
            recipe.ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-item">
                {ingredient.name} - {ingredient.quantity}
              </div>
            ))
          ) : (
            <p>No Ingredients</p>
          )}
        </div>
      </div>

      <div className="comment-section">
        <h2 className="comment-heading">Comments</h2>
        <div className="comment-list">
          {commentsList.length > 0 ? (
            commentsList.map((comment, idx) => (
              <div key={idx} className="comment-item">
                <p className="y">
                  <strong>
                    {comment.username.charAt(0).toUpperCase() +
                      comment.username.slice(1)}
                  </strong>
                </p>
                {comment.content}
              </div>
            ))
          ) : (
            <p>No comments so far.</p>
          )}
        </div>
      </div>

      <div className="add-comment-section">
        {showCommentInput ? (
          <>
            <input
              type="text"
              className="comment-input"
              placeholder="Write your comment here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="confirm-comment-button"
              onClick={handleAddComment}
            >
              Add
            </button>
            <button
              className="cancel-comment-button"
              onClick={handleCancelComment}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            className="add-comment-button"
            onClick={() => setShowCommentInput(true)}
          >
            Add a Comment
          </button>
        )}
      </div>

      {showSharePopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Share This Recipe</h3>
            <input
              type="text"
              value={window.location.href}
              readOnly
              className="popup-input"
            />
            <button onClick={handleCopyURL} className="copy-button">
              Copy
            </button>
            <button onClick={handleShareClosePopup} className="close-button">
              Close
            </button>
            <div className="message-container">
              {message && <p className="message">{message}</p>}
            </div>
          </div>
        </div>
      )}

      {showRatePopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Rate This Recipe</h3>
            <div className="star-rating-container">
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= hover ? "hovered" : ""} ${
                      star <= rating ? "selected" : ""
                    }`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <button onClick={handleRate} className="rate-button">Rate</button>
            <button onClick={handleRateClosePopup} className="close-button">
              Close
            </button>
            <div className="message-container">
              {message && <p className="message">{message}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
