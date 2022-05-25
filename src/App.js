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
import ProfielEdit from "./ProfielEdit";
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
import AdminProducts from "./AdminProducts";
import AdminProductsCreate from "./AdminProductsCreate";
import AdminProductsEdit from "./AdminProductsEdit";
import AdminActivities from "./AdminActivities";
import AdminActivitiesCreate from "./AdminActivitiesCreate";
import AdminActivitiesEdit from "./AdminActivitiesEdit";
import AdminUserVerification from "./AdminUserVerification";
import EventShow from "./EventShow";
import ProjectShow from "./ProjectShow";
import OrderShow from "./OrderShow";
import BusinessCreate from "./BusinessCreate";
import BusinessDashboard from "./BusinessDashboard";
import AdminProjectsEventsSkills from "./AdminProjectsEventsSkills";
import GetHandelaars from "./GetHandelaars";
import GetDiensten from "./GetDiensten";
import GetVergoedingen from "./GetVergoedingen";
import GetHistoriek from "./GetHistoriek";
import GetProducts from "./GetProducts";
import MyEvents from "./MyEvents";
import EventLeaderBoard from "./EventLeaderBoard";
import EventCreate from "./EventCreate";
import ActivityShow from "./ActivityShow";
import MyInterests from "./MyInterests";
import ProjectCreate from "./ProjectCreate";
import Forgot from "./Forgot";

const PrivateRoute = ({component: Component, ...rest}) => {
  return (
      <Route {...rest} render={props => (
        localStorage.getItem('token') !== 'null' &&
        localStorage.getItem('token') !== null &&
        typeof localStorage.getItem('token') !== 'undefined'
        ? <Component {...props} /> : <Redirect to="/login" />
      )} />
  );
};

const AdminRoute = ({component: Component, ...rest}) => {
  return (
    <Route {...rest} render={props => (
      localStorage.getItem('token') !== 'null' &&
      localStorage.getItem('token') !== null &&
      typeof localStorage.getItem('token') !== 'undefined' &&
      JSON.parse(localStorage.getItem("user")).roles.find(role => role.name === 'admin')
      ? <Component {...props} /> : <Redirect to="/login" />
    )} />
  );
};

const BusinessRoute = ({component: Component, ...rest}) => {
  return (
    <Route {...rest} render={props => (
      localStorage.getItem('token') !== 'null' &&
      localStorage.getItem('token') !== null &&
      typeof localStorage.getItem('token') !== 'undefined' &&
      JSON.parse(localStorage.getItem("user")).roles.find(role => role.name === 'business') ?
      <Component {...props} /> :
      <Redirect to="/login" />
    )} />
  );
};


function App() {
  return (
      <Router>
          <Switch>
              <Route path="/login" component={Login}/>
              <Route path="/forgot" component={Forgot}/>
              <Route path="/register" component={Register}/>
              <PrivateRoute path="/home" component={Home}/>
              <PrivateRoute path="/work" component={Work}/>
              <Route path="/see" component={See}/>

              <PrivateRoute path="/get/handelaars/:id/products" component={GetProducts}/>
              <PrivateRoute path="/get/handelaars" component={GetHandelaars}/>
              <PrivateRoute path="/get/diensten" component={GetDiensten}/>
              <PrivateRoute path="/get/vergoedingen" component={GetVergoedingen}/>
              <PrivateRoute path="/get/historiek" component={GetHistoriek}/>
              <PrivateRoute path="/get" component={Get}/>
        
              <PrivateRoute path="/profiel/edit" component={ProfielEdit}/>
              <PrivateRoute path="/profiel/:id" component={Profiel}/>
              <PrivateRoute path="/profiel" component={Profiel}/>
              <PrivateRoute path="/my-events" component={MyEvents}/>
              <PrivateRoute path="/my-interests" component={MyInterests}/>
              <PrivateRoute path="/event-leader-board/:id" component={EventLeaderBoard}/>
              
              <Route path="/agenda/:id" component={Agenda}/>
              <Route path="/agenda" component={Agenda}/>

              <PrivateRoute path="/netwerk/dm/:dmId" component={Netwerk}/>
              <PrivateRoute path="/netwerk/:groupchatId" component={Netwerk}/>
              <PrivateRoute path="/netwerk" component={Netwerk}/>

              <PrivateRoute path="/project/create/:id" component={ProjectCreate}/>
              <PrivateRoute path="/project/create" component={ProjectCreate}/>

              <PrivateRoute path="/event/create/:id/:eventId" component={EventCreate}/>
              <PrivateRoute path="/event/create/:id" component={EventCreate}/>
              <PrivateRoute path="/handelaar/create/:id" component={BusinessCreate}/>
              <PrivateRoute path="/handelaar/create" component={BusinessCreate}/>
              <BusinessRoute path="/handelaar-dashboard" component={BusinessDashboard}/>

              <PrivateRoute path="/events/:id" component={EventShow}/>
              <PrivateRoute path="/projects/:id" component={ProjectShow}/>
              <PrivateRoute path="/orders/:id" component={OrderShow}/>
              <PrivateRoute path="/activities/:id" component={ActivityShow}/>

              <AdminRoute path="/admin" component={AdminProjects}/>
              <AdminRoute path="/admin-projects/create" component={AdminProjectsCreate}/>
              <AdminRoute path="/admin-projects/edit/:id" component={AdminProjectsEdit}/>
              <AdminRoute path="/admin-projects" component={AdminProjects}/>
              <AdminRoute path="/admin-projects-events/create" component={AdminProjectsEventsCreate}/>
              <AdminRoute path="/admin-projects-events/edit/:id" component={AdminProjectsEventsEdit}/>
              <AdminRoute path="/admin-projects-events" component={AdminProjectsEvents}/>
              <AdminRoute path="/admin-projects-events-skills" component={AdminProjectsEventsSkills}/>
              <AdminRoute path="/admin-businesses/create" component={AdminBusinessesCreate}/>
              <AdminRoute path="/admin-businesses/edit/:id" component={AdminBusinessesEdit}/>
              <AdminRoute path="/admin-businesses" component={AdminBusinesses}/>
              <AdminRoute path="/admin-products/create" component={AdminProductsCreate}/>
              <AdminRoute path="/admin-products/edit/:business_id/:product_id" component={AdminProductsEdit}/>
              <AdminRoute path="/admin-products" component={AdminProducts}/>
              <AdminRoute path="/admin-activities/create" component={AdminActivitiesCreate}/>
              <AdminRoute path="/admin-activities/edit/:id" component={AdminActivitiesEdit}/>
              <AdminRoute path="/admin-activities" component={AdminActivities}/>
              <AdminRoute path="/admin-user-verification" component={AdminUserVerification}/>
              {
                localStorage.getItem('token') !== 'null' &&
                localStorage.getItem('token') !== null &&
                typeof localStorage.getItem('token') !== 'undefined' &&
                JSON.parse(localStorage.getItem("user")).email_verified_at !== null
                ? <PrivateRoute path="/" component={Home}/>
                : <Route path="/" component={See}/>
              }
              
          </Switch>
      </Router>
  );
}

export default App;
