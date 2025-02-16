import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
function Footer() {
  return (
    <div id="root">
      <div className="main-content"></div>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section1">
            <h3>FlavoGen</h3>
            <p>
              Your AI-powered recipe companion, bringing inspiration and
              convenience to your kitchen.
            </p>
          </div>

          <div id="about" className="footer-section2">
            <h3>About</h3>
            <p>
              FlavoGen is an intelligent platform that helps users discover,
              share, and create recipes effortlessly. Powered by AI, we aim to
              make cooking a delightful and stress-free experience.
            </p>
          </div>

          <div className="footer-section3">
            <h3>Privacy</h3>
            <p>
              We value your privacy. All your data is securely managed and used
              only to enhance your experience on our platform.
              <Link to="/PrivacyPolicy" className="link">
                Learn more
              </Link>
            </p>
          </div>

          <div  id="contact" className="footer-section4">
            <h3>Contact Us</h3>
            <p>Email: support@flavogen.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>

        </div>

        <div className="footer-bottom">
          <p>
            &copy; 2024 FlavoGen. All Rights Reserved. |
            <Link to="/PrivacyPolicy" className="link">
              Privacy Policy
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
