import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Home from "./screens/Home";
import AddRecipe from "./screens/AddRecipe";
import Feedback from "./screens/FeedbackForm";
import PrivacyPolicy from "./screens/PrivacyPolicy";
import Profile from "./components/Profile";
import {MainRecipe} from "./screens/MainRecipe";
import Bookmark from "./screens/Bookmark";
import Search from "./screens/Search";
import { Chatbot } from "./screens/Chatbot";
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      localStorage.clear();
    }

  }, [location]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/add-recipe" element={<AddRecipe />} />{" "}
        <Route path="/bookmark-view" element={<Bookmark />} />{" "}
        <Route path="/Feedback" element={<Feedback />} />{" "}
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />{" "}
        <Route path="/Profile" element={<Profile />} />{" "}
        <Route path="/recipe/:id" element={<MainRecipe />} />
        <Route path="/search" element={<Search />} />
        <Route path="/chatbot" element={<Chatbot/>}/>
      </Routes>
    </div>
  );
}

export default App;
