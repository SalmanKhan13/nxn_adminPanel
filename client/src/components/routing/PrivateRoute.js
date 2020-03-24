import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PrivateRoute = (props) => {
  const {
    component: Component,
    auth: { isAuthenticated },
    ...rest
  } = props;
  console.log('private routes props: ', props);

  return <Route
    {...rest}
    render={props => !isAuthenticated ? (<Redirect to='/login' />) : (<Component {...props} />) }
  />
};

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
