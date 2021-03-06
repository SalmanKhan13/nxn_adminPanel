import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGOUT,
  LOGIN_SUCCESS,
  UPLOAD_SUCCESSFUL,
  UPLOAD_FAIL,
  VERIFICATION_LINK_SEND,
  VERIFICATION_LINK_NOT_SEND,
  PASSWORD_UPDATED,
  PASSWORD_NOT_SET,
  LOAD_ALLUSERS,
  LOAD_ALLUSERS_ERROR

} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: localStorage.getItem("token") ? true : false,
  user: JSON.parse(localStorage.getItem("user")),
  users: JSON.parse(localStorage.getItem("users"))
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      localStorage.setItem("user", JSON.stringify(payload));
      return { ...state, isAuthenticated: true, user: payload };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS: 
      localStorage.setItem("token", payload.token);
      return { ...state, ...payload, isAuthenticated: true, user : payload};
    case UPLOAD_SUCCESSFUL:
      return state; // should be a local state...
    case LOAD_ALLUSERS:
      localStorage.setItem("users", JSON.stringify(payload));
      return {...state, isAuthenticated: true, users: payload};
    case AUTH_ERROR:
    case LOGOUT:
    case LOGIN_FAIL:
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return { ...state, token: null, isAuthenticated: false, user: null };
    case UPLOAD_FAIL:
    case VERIFICATION_LINK_NOT_SEND:
    case VERIFICATION_LINK_SEND:
    case PASSWORD_UPDATED:
    case PASSWORD_NOT_SET:
    case REGISTER_FAIL:
    case LOAD_ALLUSERS_ERROR:
      return state; // should be a local state...
    default:
      return state;
  }
}


