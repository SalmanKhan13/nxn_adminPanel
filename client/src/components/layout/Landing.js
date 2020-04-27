import React, { Fragment } from "react";
import { Link } from "react-router-dom";
export const Landing = () => {
  return (
    <Fragment>
      <section className="showcases">
     
        <div className="video-container">
          <video src="https://traversymedia.com/downloads/video.mov"  autoPlay muted loop type="video/mov" />
        </div> 
         {/* ./assets/images/video.mov" */}
        <div className="content">
          <h1>SeeBiz AdminPanel</h1>
          <h3>AdminPanel for First Social Network for B2B, share posts and get
           help from other</h3>
           <Link to="login" className='btn12'>
              Login
            </Link>
        </div>
      </section>

      <section id="about">
        <h1>About</h1>
        <p>
          This is a admin-panel used by different teams of SeeBiz inc.The admin panel is where the content is created and the website is managed.
          This is the key to how a content management system (CMS) works.Feel free
          to use this panel for your productivity.
        </p>

        <h2>Follow Me On Social Media</h2>

        <div className="social">
          <Link to="https://twitter.com/Salman83590699" target="_blank">
            <i className="fab fa-twitter fa-3x"></i>
          </Link>
          <Link to="https://facebook.com/salman919241" target="_blank">
            <i className="fab fa-facebook fa-3x"></i>
          </Link>
          <Link to="https://github.com/SalmanKhan13" target="_blank">
            <i className="fab fa-github fa-3x"></i>
          </Link>
          <Link to="https://www.linkedin.com/in/salman-khan-a5b44011a" rel="noopener noreferrer" target="_blank">
            <i className="fab fa-linkedin fa-3x"></i>
          </Link>
        </div>
      </section>
    </Fragment>
    
  );
};
export default Landing;
