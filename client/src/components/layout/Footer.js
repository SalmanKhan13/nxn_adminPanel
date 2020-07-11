import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container-fluid">
        {/* <nav className="float-left">
          <ul>
            <li>
              <Link to="https://www.creative-tim.com">SeeBiz Tim</Link>
            </li>
            <li>
              <Link to="https://creative-tim.com/presentation">About Us</Link>
            </li>
            <li>
              <Link to="http://blog.creative-tim.com">Blog</Link>
            </li>
            <li>
              <Link to="https://www.creative-tim.com/license">Licenses</Link>
            </li>
          </ul>
        </nav> */}
        <div className="copyright float-right">
          &copy;
           made in{" "}
          {new Date().getFullYear()}
          <i className="material-icons">favorite</i> by
          <Link to="/dashboard" target="_blank">
            {" "}
            NxN Team
          </Link>{" "}

        </div>
      </div>
    </footer>
  );
};

export default Footer;
