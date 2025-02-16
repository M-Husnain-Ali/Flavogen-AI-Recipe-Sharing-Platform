import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import APIServices from "./APIservices"; // Import the API service
import "./FeedbackForm.css";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    overall_rating: 3,
    ease_of_navigation: 3,
    visual_appeal: 3,
    recipe_search_experience: 3,
    recipe_content_quality: 3,
    ratings_comments_usefulness: 3,
    chatbot_helpfulness: 3,
    chatbot_response_speed: 3,
    favorite_feature: "",
    least_favorite_feature: "",
    suggestions_for_improvement: "",
    additional_comments: "",
    would_recommend: true,
    likelihood_to_use_again: 3,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await APIServices.submitFeedback(formData);
      navigate("/home");
    } catch (error) {
      setErrorMessage(error.detail || "Failed to submit feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="feedback-form-container">
      <h2>Feedback Form</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        {/* Overall Rating */}
        <div className="form-group">
          <label>Overall Rating (1-5):</label>
          <input
            type="number"
            name="overall_rating"
            min="1"
            max="5"
            value={formData.overall_rating}
            onChange={handleChange}
          />
        </div>

        {/* Ease of Navigation */}
        <div className="form-group">
          <label>Ease of Navigation (1-5):</label>
          <input
            type="number"
            name="ease_of_navigation"
            min="1"
            max="5"
            value={formData.ease_of_navigation}
            onChange={handleChange}
          />
        </div>

        {/* Visual Appeal */}
        <div className="form-group">
          <label>Visual Appeal (1-5):</label>
          <input
            type="number"
            name="visual_appeal"
            min="1"
            max="5"
            value={formData.visual_appeal}
            onChange={handleChange}
          />
        </div>

        {/* Recipe Search Experience */}
        <div className="form-group">
          <label>Recipe Search Experience (1-5):</label>
          <input
            type="number"
            name="recipe_search_experience"
            min="1"
            max="5"
            value={formData.recipe_search_experience}
            onChange={handleChange}
          />
        </div>

        {/* Recipe Content Quality */}
        <div className="form-group">
          <label>Recipe Content Quality (1-5):</label>
          <input
            type="number"
            name="recipe_content_quality"
            min="1"
            max="5"
            value={formData.recipe_content_quality}
            onChange={handleChange}
          />
        </div>

        {/* Ratings & Comments Usefulness */}
        <div className="form-group">
          <label>Ratings & Comments Usefulness (1-5):</label>
          <input
            type="number"
            name="ratings_comments_usefulness"
            min="1"
            max="5"
            value={formData.ratings_comments_usefulness}
            onChange={handleChange}
          />
        </div>

        {/* Chatbot Helpfulness */}
        <div className="form-group">
          <label>Chatbot Helpfulness (1-5):</label>
          <input
            type="number"
            name="chatbot_helpfulness"
            min="1"
            max="5"
            value={formData.chatbot_helpfulness}
            onChange={handleChange}
          />
        </div>

        {/* Chatbot Response Speed */}
        <div className="form-group">
          <label>Chatbot Response Speed (1-5):</label>
          <input
            type="number"
            name="chatbot_response_speed"
            min="1"
            max="5"
            value={formData.chatbot_response_speed}
            onChange={handleChange}
          />
        </div>

        {/* Favorite Feature */}
        <div className="form-group">
          <label>Favorite Feature:</label>
          <textarea
            name="favorite_feature"
            value={formData.favorite_feature}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Least Favorite Feature */}
        <div className="form-group">
          <label>Least Favorite Feature:</label>
          <textarea
            name="least_favorite_feature"
            value={formData.least_favorite_feature}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Suggestions for Improvement */}
        <div className="form-group">
          <label>Suggestions for Improvement:</label>
          <textarea
            name="suggestions_for_improvement"
            value={formData.suggestions_for_improvement}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Additional Comments */}
        <div className="form-group">
          <label>Additional Comments:</label>
          <textarea
            name="additional_comments"
            value={formData.additional_comments}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Would Recommend */}
        <div className="form-group">
          <label>Would you recommend this platform?</label>
          <select
            name="would_recommend"
            value={formData.would_recommend}
            onChange={handleChange}
          >
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </div>

        {/* Likelihood to use again */}
        <div className="form-group">
          <label>Likelihood to use again (1-5):</label>
          <input
            type="number"
            name="likelihood_to_use_again"
            min="1"
            max="5"
            value={formData.likelihood_to_use_again}
            onChange={handleChange}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
