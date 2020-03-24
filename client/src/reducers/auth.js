import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGOUT,
  LOGIN_SUCCESS,
  UPLOAD_SUCCESSFUL,
  UPLOAD_FAIL
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: localStorage.getItem("token") ? true : false,
  user: JSON.parse(localStorage.getItem("user"))
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      localStorage.setItem("user", JSON.stringify(payload));  
    return { ...state, isAuthenticated: true, user: payload };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {...state, ...payload, isAuthenticated: true };
    case UPLOAD_SUCCESSFUL:
      return state; // should be a local state...
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGOUT:
    case LOGIN_FAIL:
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return { ...state, token: null, isAuthenticated: false, user: null };
    case UPLOAD_FAIL:
      return state; // should be a local state...
    default:
      return state;
  }
}
