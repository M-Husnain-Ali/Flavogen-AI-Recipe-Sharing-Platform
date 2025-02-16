import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import APIServices from "../screens/APIservices";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userName, email } = location.state || {};
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSavePassword = async () => {
    if (!oldPassword || !newPassword) {
      setError("Please fill out both fields.");
      return;
    }

    try {
      const response = await APIServices.updatePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });

      if (response.message === "Password updated successfully.") {
        setSuccessMessage(response.message);
        setOldPassword("");
        setNewPassword("");
        setError("");
        setShowPasswordFields(false); // Hide fields after successful update

        // Hide success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 500);
      } else {
        setError(response.error || "Password update failed.");
        setSuccessMessage("");
      }
    } catch (err) {
      setError("Invalid Details.");
      setSuccessMessage("");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const token = localStorage.getItem("authToken");

  if (!token) {
    return (
      <div className="Logincontainer">
        <h1>Please Login First</h1>
        <h4>You are Logged out</h4>
        <div className="Spacecontainer">
          <div className="return-button">
            <button
              className="return"
              type="button"
              onClick={() => navigate("/")}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Welcome to your Profile</h1>
      </div>
      <div className="profile-details">
        <p>
          <strong>Username:</strong> {userName}
        </p>
        <p>
          <strong>Email:</strong> {email}
        </p>
      </div>

      <div className="update-password">
        {!showPasswordFields ? (
          <button
            onClick={() => setShowPasswordFields(true)}
            className="update-button"
          >
            Update Password
          </button>
        ) : (
          <>
            <h2>Update Password</h2>
            <input
              type="password"
              placeholder="Enter old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="password-input"
            />
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="password-input"
            />
            <div>
              <button onClick={handleSavePassword} className="update-button">
                Save Password
              </button>
              <button
                onClick={() => {
                  setShowPasswordFields(false);
                  setOldPassword("");
                  setNewPassword("");
                  setError("");
                  setSuccessMessage("");
                }}
                className="logout-button"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <div className="logout-section">
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
