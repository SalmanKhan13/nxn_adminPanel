import React, { Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Landing from "./components/layout/Landing";
import MainPanel from "./components/routing/MainPanel";
import { Provider } from "react-redux";
import store from "./store";
import "./App.css";

const App = () => {
  return (
    <Provider store={store}>
      <Fragment className="wrapper">
        <Router>
         
          <Sidebar />
         
          <MainPanel />
         
        </Router>
      </Fragment>
    </Provider>
  );
};

export default App;
