import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import APIServices from "./APIservices";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }
  
    const loginData = {
      email: email.trim(),
      password: password,
    };
  
    try {
      const response = await APIServices.loginUser(loginData);
      setError("");
  
      if (response.message === "Login successful") 
        {
          
        localStorage.setItem("authToken", response.token);
        const user = {
          id: response.id,
          name: response.name,
          email: response.email,
        };
        localStorage.setItem("user", JSON.stringify(user)); 
  
        navigate("/home", { replace: true });
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      setError(err.error || "Invalid email or password.");
    }
  };

  return (
    <div className="login-container">
      <h2>FlavoGen</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="login-button">
          Login
        </button>

        <p>
          Don't have an account?{" "}
          <Link to="/signup" className="signup-link">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
