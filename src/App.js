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
import AdminProjects from "./AdminProjects";
import AdminProjectsCreate from "./AdminProjectsCreate";
import AdminProjectsEdit from "./AdminProjectsEdit";
import AdminProjectsEvents from "./AdminProjectsEvents";
import AdminProjectsEventsCreate from "./AdminProjectsEventsCreate";
import AdminProjectsEventsEdit from "./AdminProjectsEventsEdit";
import AdminBusinesses from "./AdminBusinesses";
import AdminBusinessesCreate from "./AdminBusinessesCreate";
import AdminBusinessesEdit from "./AdminBusinessesEdit";
import AdminActivities from "./AdminActivities";
import AdminActivitiesCreate from "./AdminActivitiesCreate";
import AdminActivitiesEdit from "./AdminActivitiesEdit";
import AdminUserVerification from "./AdminUserVerification";
import WorkLeaderBoard from "./WorkLeaderBoard";
import EventShow from "./EventShow";
import ProjectShow from "./ProjectShow";
import BusinessShow from "./BusinessShow";

const PrivateRoute = ({component: Component, ...rest}) => {
  
  let user = null;
  if(JSON.parse(localStorage.getItem("user"))) {
    user = JSON.parse(localStorage.getItem("user")).email_verified_at;
  }
  return (
      <Route {...rest} render={props => (
        localStorage.getItem('token') !== 'null' && localStorage.getItem('token') !== null && typeof localStorage.getItem('token') !== 'undefined' && user !== null ? <Component {...props} /> : <Redirect to="/login" />
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
              <PrivateRoute path="/work" component={Work}/>
              <PrivateRoute path="/work-project-leader/:id" component={WorkLeaderBoard}/>
              <PrivateRoute path="/see" component={See}/>
              <PrivateRoute path="/get" component={Get}/>
              <PrivateRoute path="/profiel" component={Profiel}/>
              <PrivateRoute path="/agenda" component={Agenda}/>
              <PrivateRoute path="/netwerk" component={Netwerk}/>

              <PrivateRoute path="/events/:id" component={EventShow}/>
              <PrivateRoute path="/projects/:id" component={ProjectShow}/>
              <PrivateRoute path="/businesses/:id" component={BusinessShow}/>

              <PrivateRoute path="/admin" component={AdminProjects}/>
              <PrivateRoute path="/admin-projects/create" component={AdminProjectsCreate}/>
              <PrivateRoute path="/admin-projects/edit/:id" component={AdminProjectsEdit}/>
              <PrivateRoute path="/admin-projects" component={AdminProjects}/>
              <PrivateRoute path="/admin-projects-events/create" component={AdminProjectsEventsCreate}/>
              <PrivateRoute path="/admin-projects-events/edit/:id" component={AdminProjectsEventsEdit}/>
              <PrivateRoute path="/admin-projects-events" component={AdminProjectsEvents}/>
              <PrivateRoute path="/admin-businesses/create" component={AdminBusinessesCreate}/>
              <PrivateRoute path="/admin-businesses/edit/:id" component={AdminBusinessesEdit}/>
              <PrivateRoute path="/admin-businesses" component={AdminBusinesses}/>
              <PrivateRoute path="/admin-activities/create" component={AdminActivitiesCreate}/>
              <PrivateRoute path="/admin-activities/edit/:id" component={AdminActivitiesEdit}/>
              <PrivateRoute path="/admin-activities" component={AdminActivities}/>
              <PrivateRoute path="/admin-user-verification" component={AdminUserVerification}/>

              <PrivateRoute path="/" component={Home}/>
          </Switch>
      </Router>
  );
}

export default App;
