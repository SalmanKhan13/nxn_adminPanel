import React, { Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import ResetPassword from "./components/dashboard/ResetPassword";
import Reset from "./components/dashboard/Reset";
import MainPanel from "./components/routing/MainPanel";
import { Provider } from "react-redux";
import store from "./store";
import "./App.css";

const App = () => {
  return (
    <Provider store={store}>
      <Fragment >
        <Router>
          <Navbar />
          <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/resetpassword" component={ResetPassword} />
          <Route exact path="/reset/:token" component={Reset} />
         
          <MainPanel />
       
          </Switch>
        </Router>
      </Fragment>
    </Provider>
  );
};

export default App;
