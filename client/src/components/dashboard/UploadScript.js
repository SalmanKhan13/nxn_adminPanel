import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { upload, searchUsers, searchCatalogs } from "../../actions/auth";

const UploadScript = (props) => {
  const { upload, searchUsers, searchCatalogs } = props;

  const [uploadFormData, setUploadFormData] = useState({
    user_email_doc: "",
    user_email: "",
    catalog: "",
    csvFile: null,
  });
  const [catalogsList, setCatalogsList] = useState([]);

  // console.log('catalogs, setCatalogs: ', catalogsList, setCatalogsList);

  let usersList = [];

  // search users - loading emails...
  const loadOptions = (inputValue, callback) => {
    if (!inputValue) {
      callback(usersList);
    } else {
      searchUsers(inputValue, (users) => {
        usersList = users.map((user) => ({
          label: user.email,
          value: user._id,
        }));
        callback(usersList);
      });
    }
  };

  const onSearchChange = (selectedItem, event) => {
    if (selectedItem === null && event.action === "clear") {
      // clear event is fired, reset the selected item...
      usersList = [];
    } else {
      // item is selected, set state here...
      if (event.name === "user_email") {
        searchCatalogs(selectedItem.value, (catalogs) => {
          setCatalogsList(
            catalogs.map((catalog) => ({
              label: catalog.slug,
              value: catalog._id,
            }))
          );
        });
      }
      // update file state...
      setUploadFormData({
        ...uploadFormData,
        [event.name]: selectedItem.value,
      });
    }
  };

  const onCatalogChange = (selectedCatalog, event) => {
    console.log("onCatalogChange: ", selectedCatalog);
    setUploadFormData({
      ...uploadFormData,
      [event.name]: selectedCatalog.value,
    });
  };

  const onFileChange = (e) => {
    setUploadFormData({
      ...uploadFormData,
      [e.target.name]: e.currentTarget.files[0],
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    console.log("finally submitting form: ", uploadFormData);
    formData.append("user_email_doc", uploadFormData.user_email_doc);
    formData.append("user_email", uploadFormData.user_email);
    formData.append("catalog", uploadFormData.catalog);
    formData.append("csvFile", uploadFormData.csvFile);

    upload(formData);
  };

  return (
    <Fragment>
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header card-header-primary">
                  <h4 className="card-title">Product Upload Page</h4>
                  <p className="card-category">Admin can upload it only</p>
                </div>
                <div className="card-body">
                  <form className="form" onSubmit={(e) => onSubmit(e)}>
                    <div className="form-group">
                      <label htmlFor="user_email_doc">
                        Email address (document)
                      </label>
                      <AsyncSelect
                        placeholder="Select email you receive"
                        loadingMessage={() => "Searching through users"}
                        name="user_email_doc"
                        id="user_email_doc"
                        onChange={onSearchChange}
                        isClearable
                        defaultOptions={false}
                        loadOptions={loadOptions}
                      />
                      <small
                        id="user_email_doc"
                        className="form-text text-muted"
                      >
                        This email is used to to send document.
                      </small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="user_email">Email address</label>
                      <AsyncSelect
                        placeholder="Select user email"
                        loadingMessage={() => "Searching through users"}
                        name="user_email"
                        id="user_email"
                        onChange={onSearchChange}
                        isClearable
                        defaultOptions
                        loadOptions={loadOptions}
                      />
                      <small id="user_email" className="form-text text-muted">
                        This email is used to get an email if anything goes
                        wrong.
                      </small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="catalog">Catalog*</label>
                      <Select
                        name="catalog"
                        options={catalogsList}
                        onChange={onCatalogChange}
                      />
                    </div>

                    <div className="form-group">
                     
                      <input
                        type="file"
                        placeholder="Choose File"
                        name="csvFile"
                        id="csvfile"
                        onChange={onFileChange}
                      />
                    </div>
                    <div>
                      <input
                        accept="image/*"
                        placeholder="Choose File"
                        name="csvFile"
                        id="csvfile"
                        
                        multiple
                        type="file"
                        onChange={onFileChange}
                      />
                    </div>

                    <input
                      type="submit"
                      className="btn btn-primary pull-right"
                      value="Upload"
                    />

                    {/* <div className="clearfix"></div> */}
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card card-profile">
                <div className="card-avatar">
                  <Link to="javascript:;">
                    <img className="img" src="../assets/img/faces/marc.jpg" />
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

    // <Fragment>
    //   <h1 className="large text-primary">Product Upload Page</h1>
    //   <p className="lead">
    //     <i className="fas fa-user" /> Upload your files here!
    //   </p>
    //   <form className="form" onSubmit={onSubmit}>
    //     <div className="form-group">
    //       <label htmlFor="user_email_doc">Email address (document)</label>
    //       <AsyncSelect
    //         placeholder="Select email you receive"
    //         loadingMessage={() => "Searching through users"}
    //         name="user_email_doc"
    //         id="user_email_doc"
    //         onChange={onSearchChange}
    //         isClearable
    //         defaultOptions={false}
    //         loadOptions={loadOptions}
    //       />
    //       <small id="user_email_doc" className="form-text text-muted">
    //         This email is used to to send document.
    //       </small>
    //     </div>

    //     <div className="form-group">
    //       <label htmlFor="user_email">Email address</label>
    //       <AsyncSelect
    //         placeholder="Select user email"
    //         loadingMessage={() => "Searching through users"}
    //         name="user_email"
    //         id="user_email"
    //         onChange={onSearchChange}
    //         isClearable
    //         defaultOptions
    //         loadOptions={loadOptions}
    //       />
    //       <small id="user_email" className="form-text text-muted">
    //         This email is used to get an email if anything goes wrong.
    //       </small>
    //     </div>

    //     <div className="form-group">
    //       <label htmlFor="catalog">Catalog*</label>
    //       <Select
    //         name="catalog"
    //         options={catalogsList}
    //         onChange={onCatalogChange}
    //       />
    //     </div>

    //     <div className="form-group">
    //       <input type="file" placeholder="Choose File" name="csvFile" id="csvfile" onChange={onFileChange} />
    //     </div>

    //     <input
    //       type="submit"
    //       className="btn btn-primary "
    //       value="Upload"
    //     />
    //   </form>
    // </Fragment>
  );
};

UploadScript.propTypes = {
  upload: PropTypes.func.isRequired,
  searchUsers: PropTypes.func.isRequired,
  searchCatalogs: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps, {
  upload,
  searchUsers,
  searchCatalogs,
})(UploadScript);
