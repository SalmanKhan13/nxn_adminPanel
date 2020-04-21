import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Register from '../auth/Register';
import Login from '../auth/Login';
import ResetPassword from '../dashboard/ResetPassword';
import Reset from '../dashboard/Reset';
import Alert from '../layout/Alert';
import Landing from '../layout/Landing';
import Dashboard from '../dashboard/Dashboard';
import Tables from '../dashboard/Tables';
import UploadScript from '../dashboard/UploadScript';
import NotFound from '../layout/NotFound';
import PrivateRoute from '../routing/PrivateRoute';

const Routes = (props) => {
  console.log('routing props', props)
  return (
  <section > <Route exact path='/' component={Landing} />
    <section className='container'>
      <Alert />
      <Switch>
        <PrivateRoute exact path='/register' component={Register} />
        <PrivateRoute exact path='/uploadscript' component={UploadScript} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/resetpassword' component={ResetPassword} />
        <Route exact path='/reset' component={ResetPassword} />
        <Route exact path='/reset/:token' component={Reset} />
        <PrivateRoute exact path='/dashboard' component={Dashboard} />
        <PrivateRoute exact path='/tables' component={Tables} />
       
        {/* <Route component={NotFound} /> */}
        
      </Switch>
      </section>
    </section>
  );
};

export default Routes;
