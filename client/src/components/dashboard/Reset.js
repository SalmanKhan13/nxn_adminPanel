import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { resetpassword } from '../../actions/auth';

const Reset = ({ match, resetpassword }) => {
  const [formData, setFormData] = useState({ password1: '', password2: '', token: '' });

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const { password1, password2, token } = formData;

  useEffect(() => {
    let token = match.params.token
    if (token) {
      setFormData({ ...formData, token })
    }
  },[setFormData]);

  const onSubmit = async e => {
    e.preventDefault();
    console.log('resetcomponent ' + password1, password2, token);
    resetpassword(password1, token);
  };

  return (
<Fragment>
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header card-header-primary">
                  <h3 className="card-title">Welcome Back!</h3>
                  <p className="card-category">Update Your Password</p>
                </div>
                <div className="card-body">
                  <form className="form" onSubmit={(e) => onSubmit(e)}>
                    <div className="row">
                      <div className="col-md">
                        <div className="form-group">
                          <label className="bmd-label-floating">
                          Enter Updated Password
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            htmlFor="password1"
                            name="password1"
                            value={password1}
                            onChange={(e) => onChange(e)}
                          />
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-md">
                        <div className="form-group">
                          <label className="bmd-label-floating">Confirm Password</label>
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
                    <input
                      type="submit"
                      className='btn btn-primary  pull-right"'
                      value="Update Password"
                    />
                    <span ></span>
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
                  <Link to="javascript:;">
                    <img className="img" src="../assets/img/faces/avatar.jpg" />
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
                  <Link to="javascript:;" className="btn btn-primary btn-round">
                    Follow
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>

   
  )
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.isAuthenticated
  }
};

export default connect(mapStateToProps, { resetpassword })(Reset);
