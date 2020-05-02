import React from "react";
import { Route, Switch } from "react-router-dom";
import CreateUser from "../auth/CreateUser";
import Alert from "../layout/Alert";
import Landing from "../layout/Landing";
import Dashboard from "../dashboard/Dashboard";
import Users from "../dashboard/Users";
import UploadScript from "../dashboard/UploadScript";
import UserProfile from "../dashboard/UserProfile";
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
          <PrivateRoute exact path="/createuser" component={CreateUser} />
          <PrivateRoute exact path="/uploadproduct" component={UploadScript} />
          <PrivateRoute exact path="/userprofile" component={UserProfile} />
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
          <PrivateRoute exact path="/users" component={Users} />
          <Route component={NotFound} />
        </Switch>
      </section>
    </section>
  );
};

export default Routes;
