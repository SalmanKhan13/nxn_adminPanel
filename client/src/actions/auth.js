import axios from "axios";
import { setAlert } from "./alert";
import Progress from "../components/dashboard/Progress";
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
  PASSWORD_NOT_SET
} from "./types";
import setAuthToken from "../utils/setAuthToken";

// Load User
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get("/api/auth");

    console.log("load user api called", res);

    dispatch({ type: USER_LOADED, payload: res.data });
  } catch (err) {
    dispatch({ type: AUTH_ERROR });
  }
};

// Register User
export const register = ({ name, email, password }) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post("/api/users", body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

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
    const res = await axios.post("/api/auth", body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
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
    const res = await axios.post("api/auth/import", body);//, {
    //   onUploadProgress: progressEvent => {
    //     dispatch( Progress( parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total)))
    //     );
    //    // Clear percentage
    //     setTimeout(() => Progress(0), 10000);
    //   }

    // });
    // console.log("onUploadProgress"+onUploadProgress+"progressEvent"+ progressEvent)

    dispatch({ type: UPLOAD_SUCCESSFUL });
    dispatch(setAlert(res.data.message, res.data.status, 10000));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({ type: UPLOAD_FAIL });
  }
};

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
