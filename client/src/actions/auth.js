import axios from "axios";
import { setAlert } from "./alert";

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  UPLOAD_FAIL,
  UPLOAD_SUCCESSFUL,
  VERIFICATION_LINK_SEND,
  VERIFICATION_LINK_NOT_SEND,
  PASSWORD_UPDATED,
  PASSWORD_NOT_SET,
  LOAD_ALLUSERS,
  LOAD_ALLUSERS_ERROR
} from "./types";
import setAuthToken from "../utils/setAuthToken";

// Load User
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get("/api/users/auth");
    dispatch({ type: USER_LOADED, payload: res.data });
  } catch (err) {
    dispatch({ type: AUTH_ERROR });
  }
};
// Fetch AllUsers
export const fetchAllUser=() => async dispatch =>{

  try{
    const res= await axios.get("api/users/allusers");
    dispatch({
      type: LOAD_ALLUSERS,
      payload: res.data })               
  }
  catch (err) {
    dispatch({ type: LOAD_ALLUSERS_ERROR });
  }
}


// Register User
export const register = ({ name, email, password,role }) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ name, email, password,role });

  try {
    const res = await axios.post("/api/users", body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
    dispatch(setAlert("You have Successfully created a User ", 'success', 10000));
   // dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    const error = err.response.data.error;
    if (error) {
     
      dispatch(setAlert(error, "danger"));
    }


    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};

// Login User
export const login = (email, password) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post("/api/users/auth", body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
    dispatch(fetchAllUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: LOGIN_FAIL
    });
  }
};

// Logout
export const logout = () => dispatch => {
  dispatch({ type: LOGOUT });
};

// Upload File
export const upload = body => async dispatch => {
  console.log("final body ready to send to server", body);

  try {
    const res = await axios.post("api/product/upload", body);

    dispatch({ type: UPLOAD_SUCCESSFUL });
    dispatch(setAlert(res.data.message, res.data.status, 10000));
  } catch (err) {
    const errors = err.response.data.errors;
    const error = err.response.data.error;
    if (error) {
     
      dispatch(setAlert(error, "danger"));
    }

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({ type: UPLOAD_FAIL });
  }
};
// search user
export const searchUsers = (search, callback) => async dispatch => {
  try {
    const res = await axios.get("api/users/search?search=" + search);

    dispatch({ type: UPLOAD_SUCCESSFUL });

    callback(res.data);
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({ type: UPLOAD_FAIL });
  }
};

// search catalog
export const searchCatalogs = (userId, callback) => async dispatch => {
  try {
    const res = await axios.get("api/catalogs/search/" + userId);

    dispatch({ type: UPLOAD_SUCCESSFUL });

    callback(res.data.catalogs);
  } catch (err) {
    const errors = err.response.data.errors;
   

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({ type: UPLOAD_FAIL });
  }
};

// forgot password
export const forgotpassword = (email) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ email });
  try {
    const res = await axios.put("api/users/forgotpassword", body, config);

    dispatch({ type: VERIFICATION_LINK_SEND, payload: res.data });

    dispatch(setAlert(res.data.message, "success", 10000));

  } catch (err) {
    const errors = err.response.data.error;
    console.log(err.response.data.error);
    if (errors) {
      // errors.forEach(error => dispatch(setAlert(error.message, "danger")));
      dispatch(setAlert(errors, "danger"));
    }

    dispatch({ type: VERIFICATION_LINK_NOT_SEND });
  }
}

// reset password
export const resetpassword = (password1, token) => async dispatch => {
  console.log("action hit")
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
    const res = await axios.put("/api/users/resetpassword", { newPassword: password1, resetPasswordLink: token }, config);

    dispatch({ type: PASSWORD_UPDATED, payload: res.data });

    dispatch(setAlert(res.data.message, "success", 10000));
    //dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.error;
    console.log(err.response.data.error);
    if (errors) {
      // errors.forEach(error => dispatch(setAlert(error.message, "danger")));
      dispatch(setAlert(errors, "danger"));
    }

    dispatch({ type: PASSWORD_NOT_SET });
  }
}
