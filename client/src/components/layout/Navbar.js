import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const Navbar = ({ auth: { isAuthenticated }, logout }) => {
  const authLinks = (
    <ul>
      <li>
        <Link to='/'>AdminPanel</Link>
      </li>

      <li>
        <Link to='/dashboard'>
          <i className='fas fa-user' />{' '}
          <span className='hide-sm'>Dashboard</span>
        </Link>
      </li>
      <li>
        <a onClick={logout} href='#!'>
          <i className='fas fa-sign-out-alt' />{' '}
          <span className='hide-sm'>Logout</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to="/">AdminPanel</Link>
      </li>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  );

  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to="/"><i className="logo"> <img src="./assets/images/logo.svg" id="company-logo" alt="logo" /> </i></Link>
      </h1>
      <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logout }
)(Navbar);


// {/* <div>
// <nav className="navbar bg-dark">
// <h1>
// <Link to="/"><i className="logo"> <img src="./assets/images/logo.svg" id="company-logo" alt="logo"/> </i></Link>
// {/* <Link to="/"><i className="fas fa-code"></i></Link> */}
// </h1>

// <ul>
// <li><Link to="admin.html">AdminPanel</Link></li>
// <li><Link to="/register">Register</Link></li>
// <li><Link to="/login">Login</Link></li>
// </ul>
// </nav>
// </div>
// ) */}