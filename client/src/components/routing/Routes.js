import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Register from '../auth/Register';
import Login from '../auth/Login';
import ResetPassword from '../dashboard/ResetPassword';
import Reset from '../dashboard/Reset';
import Alert from '../layout/Alert';
import Dashboard from '../dashboard/Dashboard';
import NotFound from '../layout/NotFound';
import PrivateRoute from '../routing/PrivateRoute';

const Routes = (props) => {
  console.log('routing props', props)
  return (
    <section className='container'>
      <Alert />
      <Switch>
        <Route exact path='/register' component={Register} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/resetpassword' component={ResetPassword} />
        <Route exact path='/reset' component={ResetPassword} />
        <Route exact path='/reset/:token' component={Reset} />
        <PrivateRoute exact path='/dashboard' component={Dashboard} />
      
        <Route component={NotFound} />
      </Switch>
    </section>
  );
};

export default Routes;
