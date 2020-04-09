import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import  { forgotpassword}  from '../../actions/auth';

 const ResetPassword = ({forgotpassword}) => {
    const [formData, setFormData] = useState({email: ''});

    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });
    
        const { email } = formData;
    
        const onSubmit = async e => {
            e.preventDefault();
            forgotpassword(email);
          };
       
    return (
        <Fragment>
        <h1 className='large text-primary'>Enter Your Email</h1>
        <p className='lead'>
          <i className='fas fa-user' />Reset Your Account
        </p>
        <form className='form' onSubmit={e => onSubmit(e)}>
          <div className='form-group'>
            <input
              type='email'
              placeholder='Email Address'
              name='email'
              value={email}
              onChange={e => onChange(e)}
             
            />
          </div>
         
          <input type='submit' className='btn btn-primary' value='Send Verification Link' />
          
        </form>
        <p className='my-1'>
          Don't have an account? <Link to='/register'>Sign Up</Link>
        </p>
      </Fragment>
    )
}

const mapStateToProps = state => {
  
    return {
      isAuthenticated: state.auth.isAuthenticated
    }
  };
  
  export default connect(mapStateToProps, { forgotpassword })(ResetPassword);