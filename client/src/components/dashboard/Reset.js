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
  });

  const onSubmit = async e => {
    e.preventDefault();
    console.log('resetcomponent ' + password1, password2, token);
    resetpassword(password1, token);
  };

  return (
    <Fragment>
      <h1 className='large text-primary'>Welcome Back!</h1>
      <p className='lead'>
        <i className='fas fa-user' />Update Your Password
      </p>
      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <label className='lead' htmlFor="password1">Password</label>
          <input type='password' placeholder='Enter Updated Password' name='password1' value={password1} onChange={e => onChange(e)} />
        </div>
        <div className='form-group'>
          <label className='lead' htmlFor="password2">Confirm Password</label>
          <input type='password' placeholder='Confirm Your Password' name='password2' value={password2} onChange={e => onChange(e)} />
        </div>
        <input type='submit' className='btn btn-primary' value='Update Password' />
      </form>
      <p className='my-1'>Login to your account <Link to='/login'>Login</Link></p>
    </Fragment>
  )
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.isAuthenticated
  }
};

export default connect(mapStateToProps, { resetpassword })(Reset);