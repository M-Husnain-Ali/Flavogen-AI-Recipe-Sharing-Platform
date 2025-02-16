export default class APIServices {

  static async addRating(recipeId, body) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://127.0.0.1:8000/ratings/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ recipe: recipeId, rating: body.rating }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
  static async registerUser(body) {
    try {
      const response = await fetch("http://127.0.0.1:8000/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
  static async loginUser(body) {
    try {
      const response = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
  static async searchRecipes(query) {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://127.0.0.1:8000/recipe-search/?search=${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
  
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
  static async updatePassword(body) {
    try {
      const token = localStorage.getItem("authToken"); // Get token from localStorage

      const response = await fetch("http://127.0.0.1:8000/change-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
  static async chatbotQuery(query) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch("http://127.0.0.1:8000/chatbot/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`, // Include the token for authorization
        },
        body: JSON.stringify({ query }), // Send the user query to the backend
      });

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  static async fetchRecipes() {
    try {
      const token = localStorage.getItem("authToken"); // Get token from localStorage

      const response = await fetch("http://127.0.0.1:8000/recipes/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
  static async bookmarkRecipe(recipeId) {
    try {
      const token = localStorage.getItem("authToken"); // Retrieve auth token
      const response = await fetch("http://127.0.0.1:8000/bookmarks/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ recipe: recipeId }), // Send 'recipe' field as per backend expectation
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
  
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
  
  static async addComment(recipeId, body) {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://127.0.0.1:8000/comments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ recipe: recipeId, ...body }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
  static async fetchSpecificRecipes({ id }) {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://127.0.0.1:8000/recipes/${id}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
  static async fetchBookmarkedRecipes() {
    try {
      const token = localStorage.getItem("authToken"); // Get token from localStorage
      const response = await fetch("http://127.0.0.1:8000/bookmarks/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,  // Use the token for authentication
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      return await response.json();  // Return the bookmarked recipes
    } catch (error) {
      throw error;
    }
  }
  static async addRecipe(body) {
    try {
      const token = localStorage.getItem("authToken");
  
      const response = await fetch("http://127.0.0.1:8000/recipes/", {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`, // Only set the Authorization header
        },
        body, // FormData is passed directly
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
  
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
  static async submitFeedback(body) {
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch("http://127.0.0.1:8000/feedback/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}
