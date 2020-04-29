import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../../actions/auth";

const Login = (props) => {
  console.log(" login props: ", props);

  const { login, isAuthenticated } = props;

  const [formData, setFormData] = useState({ email: "", password: "" });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    login(email, password);
  };

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header card-header-primary">
                  <h4 className="card-title">Sign In</h4>
                  <p className="card-category">Log into your profile</p>
                </div>
                <div className="card-body">
                  <form className="form" onSubmit={(e) => onSubmit(e)}>
                    <div className="row">
                      <div className="col-md">
                        <div className="form-group">
                          <label className="bmd-label-floating">
                            Email address
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={email}
                            onChange={(e) => onChange(e)}
                          />
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-md">
                        <div className="form-group">
                          <label className="bmd-label-floating">Password</label>
                          <input
                            type="password"
                            className="form-control"
                            name="password"
                            value={password}
                            onChange={(e) => onChange(e)}
                          />
                        </div>
                      </div>
                    </div>
                    <input
                      type="submit"
                      className='btn btn-primary  pull-right"'
                      value="Login"
                    />
                    <span></span>
                    <Link to="/resetpassword" className="pull-right">
                      <i className="fas fa-user " />{" "}
                      <span className="hide-sm ">Forgot Password</span>
                    </Link>
                    <div className="clearfix"></div>
                  </form>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
  };
};

export default connect(mapStateToProps, { login })(Login);
