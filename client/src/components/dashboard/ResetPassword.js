import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { forgotpassword } from "../../actions/auth";

const ResetPassword = ({ forgotpassword }) => {
  const [formData, setFormData] = useState({ email: "" });

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const { email } = formData;

  const onSubmit = async (e) => {
    e.preventDefault();
    forgotpassword(email);
  };

  return (
    <Fragment>
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header card-header-primary">
                  <h4 className="card-title">Forgot it? Reset Your Account</h4>
                  <p className="card-category">Enter Your Email</p>
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

                    <input
                      type="submit"
                      className='btn btn-primary  pull-right"'
                      value="Send Verification Link"
                    />
                    <span></span>
                    <Link to="/login" className="pull-right">
                      <i className="fas fa-user " />{" "}
                      <span className="hide-sm ">Sign In</span>
                    </Link>

                    <div className="clearfix"></div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card card-profile">
                <div className="card-avatar">
                  <Link to="/resetpassword">
                    <img
                      className="img" alt="resetpassword"
                      src="../assets/img/faces/card-profile1-square.jpg"
                    />
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
                  <Link to="/resetpassword" className="btn btn-primary btn-round">
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

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
  };
};

export default connect(mapStateToProps, { forgotpassword })(ResetPassword);
