import axios from "axios";


const setAuthToken = (token) => {
axios.defaults.baseURL = 'http://localhost:5000/';

  if (token) {
    axios.defaults.headers.common["x-auth-token"] = token;
  } else {
    delete axios.defaults.headers.common["x-auth-token"];
  }
};

export default setAuthToken;
