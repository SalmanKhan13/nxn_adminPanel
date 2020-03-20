import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
//import {  Redirect } from 'react-router-dom';
//import { setAlert } from '../../actions/alert';
import {upload } from '../../actions/auth';
import PropTypes from 'prop-types';

const Dashboard = ({upload,isAuthenticated}) => {
  const [file,setFile]=useState({});
  const [formData, setFormData] = useState({
    user_email_doc: "",
    user_email: "",
    catalog: "",
   // file
  });

  const { user_email_doc, user_email, catalog } = formData;

  const onChange = e =>{
    
    setFile(e.target.files[0]);
   setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
     // formData.append('user_email_doc', user_email_doc);
    // formData.append('user_email', user_email);
    // formData.append('catalog', catalog);
     formData.append('csvFile', file);

    // setAlert('Passwords do not match', 'danger');
    console.log(formData);
    upload( formData);
    console.log("Success");
  };

  //   if (isAuthenticated) {
  //     return <Redirect to='/dashboard' />;
  //  }

  return (
    <Fragment>
      <h1 className="large text-primary">Product Upload Page</h1>
      <p className="lead">
        <i className="fas fa-user" /> Upload your files here!
      </p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <label htmlFor="user_email_doc">Email address (document)</label>
          <input
            type="email"
            placeholder="email "
            name="user_email_doc"
            id="user_email_doc"
            value={user_email_doc}
            onChange={e => onChange(e)}
          />
          {/* <select
            name="email"
            value={email}
            id="email"
            onChange={e => onChange(e)}
          >
            <option value="0">* select email</option>
            <option value="cleaning-supplies">cleaning-supplies</option>
            <option value="women-clothing">women-clothing</option>
            <option value="gaming-accessories">gaming-accessories</option>
            <option value="women-shoes">women-shoes</option>
            <option value="socks">Student or Learning</option>
            <option value="women-accessories">
              women-accessories or Teacher
            </option>
            <option value="candy">candy</option>
            <option value="mens-clothing">mens-clothing</option>
            <option value="test-product">test-product</option>
            <option value="demo-testing">demo-testing</option>
            <option value="smoke">smoke</option>
            <option value="new-catalog">new-catalog</option>
            <option value="test">test</option>
          </select> */}
          <small id="emailHelp1" className="form-text text-muted">
            This email is used to get an email if anything goes wrong.
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="user_email">Email address</label>
          <input
            type="email"
            placeholder="email catalog"
            name="user_email"
            id="user_email"
            value={user_email}
            onChange={e => onChange(e)}
          />

          {/* <select
            name="user_email"
            value={user_email}
            id="user_email"
            onChange={e => onChange(e)}
          >
            <option value="0">* select email</option>
            <option value="cleaning-supplies">cleaning-supplies</option>
            <option value="women-clothing">women-clothing</option>
            <option value="gaming-accessories">gaming-accessories</option>
            <option value="women-shoes">women-shoes</option>
            <option value="socks">Student or Learning</option>
            <option value="women-accessories">
              women-accessories or Teacher
            </option>
            <option value="candy">candy</option>
            <option value="mens-clothing">mens-clothing</option>
            <option value="test-product">test-product</option>
            <option value="demo-testing">demo-testing</option>
            <option value="smoke">smoke</option>
            <option value="new-catalog">new-catalog</option>
            <option value="test">test</option>
          </select> */}
          <small id="emailHelp1" className="form-text text-muted">
            This email is used to get an email if anything goes wrong.
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="catalog">Catalog</label>
          <select
            name="catalog"
            value={catalog}
            id="catalog"
            onChange={e => onChange(e)}
          >
            <option value="0">* select catalog</option>
            <option value="cleaning-supplies">cleaning-supplies</option>
            <option value="women-clothing">women-clothing</option>
            <option value="gaming-accessories">gaming-accessories</option>
            <option value="women-shoes">women-shoes</option>
            <option value="socks">Student or Learning</option>
            <option value="women-accessories">
              women-accessories or Teacher
            </option>
            <option value="candy">candy</option>
            <option value="mens-clothing">mens-clothing</option>
            <option value="test-product">test-product</option>
            <option value="demo-testing">demo-testing</option>
            <option value="smoke">smoke</option>
            <option value="new-catalog">new-catalog</option>
            <option value="test">test</option>
          </select>
          <label htmlFor="file">File</label>
        </div>
        <div className="form-group">
          <input
            type="file"
            placeholder="Choose File"
            name="csvFile"
            id="csvfile"
            onChange={e => onChange(e)}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Upload" />
      </form>
    </Fragment>
  );
};

Dashboard.propTypes = {
  //setAlert: PropTypes.func.isRequired,
 upload: PropTypes.func.isRequired,
//  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
   isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { upload }
)(Dashboard);
