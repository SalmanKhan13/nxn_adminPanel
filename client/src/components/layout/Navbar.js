import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";

const Navbar = ({ auth: { isAuthenticated, user }, logout }) => {
  const authLinks = (
    <ul>
      <li>
      {isAuthenticated ? user.name : null}
     
      </li>
    
      {/* <li>
        <Link to="/dashboard">
          <i className="fas fa-user" />{" "}
          <span className="hide-sm">Dashboard</span>
        </Link>
      </li> */}
      <li>
        <a onClick={logout} href="#!">
          <i className="fas fa-sign-out-alt" />{" "}
          <span className="hide-sm">Logout</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    // <ul>
     
<div></div>
    //   <li>
    //     <Link to="/login">Login</Link>
    //   </li>
    // </ul>
  );

  return (
    <nav className="navbar1 bg-dark">
      <h1>
        <Link to="/">
          <i className="logo">
            {" "}
            <img
              src="./assets/images/logo.svg"
              id="company-logo"
              alt="logo"
            />{" "}
          </i>
        </Link>
      </h1>
      <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
