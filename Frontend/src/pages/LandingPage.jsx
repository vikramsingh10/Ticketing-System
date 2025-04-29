import React from "react";
import { Link } from "react-router-dom";
import "../styles/LandingPage.css";
import ChatBotPopup from "../components/ChatBotPopup";

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <img src="./assets/logo.png" alt="Hubly Logo" />
        <div className="home-header-sub">
          <Link to="/signin" className="login-btn">
            Login
          </Link>
          <Link to="/signup" className="signup-btn">
            Sign up
          </Link>
        </div>
      </header>
      <div className="container-1">
        <div className="container1-a">
          <h1>
            Grow your Business faster <br />
            with Hubly CRM
          </h1>
          <p>
            Manage leads, automate workflows, and close deals effortlessly- all
            in one powerful platform.
          </p>
          <div className="container1-b">
            <Link to="/signup" className="get-started-btn">
              Get started →
            </Link>
            <img src="./assets/watchVideo.png" alt="watch-video-icon" />
          </div>
        </div>
        <div>
          <img className="con1-imga" src="./assets/Group3473704.png" />
          <img className="con1-imgb" src="./assets/Frame2147223822.png" />
          <img className="con1-imgc" src="./assets/Card1.png" />
        </div>
      </div>
      <div className="container-2">
        <img src="./assets/brands.png" alt="brands" />
      </div>
      <div className="container-3">
        <h1>At its core, Hubly is a robust CRM solution.</h1>
        <p>
          Hubly helps businesses streamline customer interactions, track leads,
          and automate tasks—saving you time and maximizing revenue. Whether
          you’re a startup or an enterprise, Hubly adapts to your needs, giving
          you the tools to scale efficiently.
        </p>
      </div>
      <div>
        <img
          className="container-4"
          src="./assets/MultiPlatform.png"
          alt="Multi Platform"
        />
      </div>
      <div className="container-5">
        <div className="container-3">
          <h1>We have plans for everyone!</h1>
          <p>
            We started with a strong foundation, then simply built all of the
            sales and marketing tools ALL businesses need under one platform.
          </p>
        </div>
        <img
          className="container-4"
          src="./assets/plans.png"
          alt="Subscription Plans"
        />
      </div>
      <footer className="footer">
        <img className="footer1" src="./assets/logo.png" alt="Hubly Logo" />
        <img className="footer2" src="./assets/div.flex.png" alt="footer" />
      </footer>
      <ChatBotPopup />
    </div>
  );
};

export default Home;
