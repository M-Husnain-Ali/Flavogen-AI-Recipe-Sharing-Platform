
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  const navigate = useNavigate(); // Initialize the navigate function
  return (
    <div className="privacy-policy">
      <h1>Privacy Policy</h1>
      <p>
        Welcome to FlavoGen, your AI-powered recipe companion. Your privacy is
        our priority, and this Privacy Policy outlines how we handle and protect
        your data.
      </p>
      <section>
        <h2>Data Collection</h2>
        <p>
          We collect only the necessary information to enhance your experience,
          such as your name, email address, and preferences. Additionally, we
          may collect data about your interactions with our platform for
          analytics purposes.
        </p>
      </section>
      <section>
        <h2>Data Usage</h2>
        <p>
          The information we collect is used to:
          <ul>
            <li>Personalize your experience on FlavoGen</li>
            <li>Recommend recipes tailored to your preferences</li>
            <li>Improve our platform through user feedback</li>
          </ul>
        </p>
      </section>
      <section>
        <h2>Data Security</h2>
        <p>
          FlavoGen employs advanced security measures to ensure your data is
          protected from unauthorized access, alteration, or disclosure. Your
          information is securely managed and used solely for the purposes
          stated in this policy.
        </p>
      </section>
      <section>
        <h2>Your Rights</h2>
        <p>
          As a user, you have the right to:
          <ul>
            <li>Access, update, or delete your personal data</li>
            <li>Request clarification on how your data is being used</li>
            <li>Opt out of data collection or processing activities</li>
          </ul>
        </p>
      </section>
      <section>
        <h2>Changes to the Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will
          be communicated to you via email or a notification on the platform.
        </p>
      </section>
      <section>
        <h2>Contact Us</h2>
        <p>
          For any questions or concerns regarding this policy, please contact us
          at:
          <br />
          Email: support@flavogen.com
          <br />
          Phone: (123) 456-7890
        </p>
      </section>
      <div className="return-button">
        <button
          className="return"
          type="button"
          onClick={() => navigate("/home")}
        >
          Return
        </button>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
