import React from "react";
import { Route, Switch } from "react-router-dom";
import Register from "../auth/Register";
import Alert from "../layout/Alert";
import Landing from "../layout/Landing";
import Dashboard from "../dashboard/Dashboard";
import Tables from "../dashboard/Tables";
import UploadScript from "../dashboard/UploadScript";
import NotFound from "../layout/NotFound";
import PrivateRoute from "../routing/PrivateRoute";

const Routes = (props) => {
  console.log("routing props", props);
  return (
    <section>
      {" "}
      <Route exact path="/" component={Landing} />
      <section className="container">
        <Alert />
        <Switch>
          <PrivateRoute exact path="/register" component={Register} />
          <PrivateRoute exact path="/uploadscript" component={UploadScript} />
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
          <PrivateRoute exact path="/tables" component={Tables} />
          <Route component={NotFound} />
        </Switch>
      </section>
    </section>
  );
};

export default Routes;
