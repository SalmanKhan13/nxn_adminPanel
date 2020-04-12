import React from "react";
import { Link } from 'react-router-dom';
export const Landing = () => {
  return (
    <div>
      <section className="landing">
        <div className="dark-overlay">
          <div className="landing-inner">
            <h1 className="x-large">SeeBiz AdminPanel</h1>
            <p className="lead">
              AdminPanel for First Social Network for B2B, share posts and get help
              from other
            </p>
            <div className="buttons">
              <Link to="register" className="btn btn-primary">
                Sign Up
              </Link>
              <Link to="login" className="btn btn-light">
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Landing;