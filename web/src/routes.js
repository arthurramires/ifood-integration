import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Credentials from './pages/Credentials';

const Routes = () => (
    <Switch>
        <Route path="/" component={Credentials} exact />
        <Route path="/dashboard" component={Dashboard} />
    </Switch>
);

export default Routes;
