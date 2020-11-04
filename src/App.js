import React, { useState, useEffect } from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import './App.scss';

import Agenda from "./Agenda";
import Work from "./Work";
import See from "./See";
import Get from "./Get";
import Profiel from "./Profiel";
import Netwerk from "./Netwerk";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";


const PrivateRoute = ({component: Component, ...rest}) => {
  return (

      // Show the component only when the user is logged in
      // Otherwise, redirect the user to /signin page
      <Route {...rest} render={props => (
          localStorage.getItem('token') ?
              <Component {...props} />
          : <Redirect to="/login" />
      )} />
  );
};



function App() {
  return (
      <Router>                                  
          <Switch>
              <Route path="/login" component={Login}/>  
              <Route path="/register" component={Register}/>                   
              <PrivateRoute path="/home" component={Home}/>
              <PrivateRoute path="/work" component={Home}/>
              <PrivateRoute path="/see" component={See}/>
              <PrivateRoute path="/get" component={Get}/>
              <PrivateRoute path="/profiel" component={Profiel}/>
              <PrivateRoute path="/agenda" component={Agenda}/>
              <PrivateRoute path="/netwerk" component={Netwerk}/>
              <PrivateRoute path="/" component={Home}/>
          </Switch>
      </Router> 
  );
}

export default App;
