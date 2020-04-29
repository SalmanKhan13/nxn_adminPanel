import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { setAlert } from "../../actions/alert";
import { register } from "../../actions/auth";
import PropTypes from "prop-types";

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
    role: "",
  });

  const { name, email, password, password2, role } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert("Passwords do not match", "danger");
    } else {
      register({ name, email, password, role });
      //console.log("Success");
    }
  };

  // if (isAuthenticated) {
  //   return <Redirect to='/dashboard' />;
  // }

  return (
    <Fragment>
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header card-header-primary">
                  <h4 className="card-title"> Create User Account</h4>
                  <p className="card-category">Only Admin can create</p>
                </div>
                <div className="card-body">
                  <form className="form" onSubmit={(e) => onSubmit(e)}>
                    <div className="row">
                      <div className="col-md">
                        <div className="form-group">
                          <label className="bmd-label-floating">
                            Enter Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={name}
                            onChange={(e) => onChange(e)}
                          />
                        </div>
                      </div>
                    </div>
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

                    <div className="row">
                      <div className="col-md">
                        <div className="form-group">
                          <label className="bmd-label-floating">
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            name="password2"
                            value={password2}
                            onChange={(e) => onChange(e)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md">
                        <div className="form-group">
                          <label className="bmd-label-floating">
                            * Select User Role
                          </label>
                          <select
                            className="form-control"
                            name="role"
                            value={role}
                            onChange={(e) => onChange(e)}
                          >
                            <option value="0">* Select User Role</option>
                            <option value="basic_user">Basic User</option>
                            <option value="teamlead">TeamLead</option>
                            <option value="admin">Admin</option>
                          </select>
                          <small className="form-text">
                            Give you an idea of what a user can perform
                          </small>
                        </div>
                      </div>
                    </div>
                    <input
                      type="submit"
                      className="btn btn-primary"
                      value="Create User"
                    />
                    <hr />
                    <div className="clearfix"></div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card card-profile">
                <div className="card-avatar">
                  {/* /<Link to="javascript:;"> */}
                  <Link to="/dashboard">
                    <img className="img" alt="card-profile" src="../assets/img/faces/mubashare.jpg" />
                  </Link>
                </div>
                <div className="card-body">
                  <h6 className="card-category text-gray">CEO / Co-Founder</h6>
                  <h4 className="card-title">Mubashar Ehsan</h4>
                  <p className="card-description">
                    Don't be scared of the truth because we need to restart the
                    human foundation in truth And I love you like Kanye loves
                    Kanye I love Rick Owens’ bed design but the back is...
                  </p>
                  <Link to="/dashboard" className="btn btn-primary btn-round">
                    Follow
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
  };
};

export default connect(mapStateToProps, { setAlert, register })(Register);
