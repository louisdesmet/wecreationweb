import React, { useEffect } from "react";
import {connect, useSelector} from "react-redux";
import {getAllEvents, getActivities, getBusinesses, getProjects, getUsers, getMessages, getGroups, getOrders, getTransfers, getSkills} from "./redux/actions";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";

import './App.scss';
import Agenda from "./Agenda";
import Work from "./Work";
import See from "./See/See";
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
import TransferShow from "./TransferShow";
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
import ResetPassword from "./ResetPassword";
import GetVergoedingenAankopen from "./GetVergoedingenAankopen";
import GetVergoedingenVerkopen from "./GetVergoedingenVerkopen";
import ActivityUpdate from "./ActivityUpdate";
import MyActivities from "./MyActivities";
import EventSkillUser from "./EventSkillUser";

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

export const App = ({getBusinesses, getActivities, getAllEvents, getProjects, getUsers, getMessages, getGroups, getOrders, getTransfers, getSkills}) => {

  const isUserLoggedIn = 
    localStorage.getItem('token') !== 'null' &&
    localStorage.getItem('token') !== null &&
    typeof localStorage.getItem('token') !== 'undefined';

  useEffect(() => {
    getProjects();
    getAllEvents();
    getActivities();
    getBusinesses();
    getUsers();
    getMessages();
    getGroups();
    getOrders();
    getTransfers();
    getSkills();
  }, []);

  const events = useSelector(state => state.remoteAllEvents);
  const activities = useSelector(state => state.remoteActivities);
  const businesses = useSelector(state => state.remoteBusinesses);
  const projects = useSelector(state => state.remoteProjects);
  const users = useSelector(state => state.remoteUsers);
  const messages = useSelector(state => state.remoteMessages);
  const groups = useSelector(state => state.remoteGroups);
  const orders = useSelector(state => state.remoteOrders);
  const transfers = useSelector(state => state.remoteTransfers);
  const skills = useSelector(state => state.remoteSkills);

  return (
      <Router>
        
        <Switch>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/forgot">
            <Forgot />
          </Route>
          <Route exact path="/password/reset/:token/:email">
            <ResetPassword />
          </Route>
          <Route exact path="/register">
            <Register reloadUsers={e => getUsers()}/>
          </Route>
  
          {
              events.data && activities.data && businesses.data && projects.data && users.data && messages.data && groups.data && orders.data && transfers.data ?
            <>
              <Route exact path="/see">
                <See events={events} activities={activities} businesses={businesses} reloadActivities={() => getActivities()}/>
              </Route>
              <Route exact path="/agenda/:id">
                <Agenda events={events} activities={activities} reloadEvents={e => getAllEvents()} reloadActivities={() => getActivities()}/>
              </Route>    
              <Route exact path="/agenda">
                <Agenda events={events} activities={activities} reloadEvents={e => getAllEvents()} reloadActivities={() => getActivities()}/>
              </Route>

              <Route exact path="/home">
                <Home 
                  activities={activities} events={events} businesses={businesses} users={users} projects={projects} messages={messages}
                  reloadEvents={e => getAllEvents()} reloadBusinesses={e => getBusinesses()} reloadActivities={e => getActivities()}
                />
              </Route>
              <Route exact path="/work">
                <Work projects={projects} events={events} users={users}/>
              </Route>
  
  
              <Route exact path="/get/handelaars/:id/products">
                <GetProducts businesses={businesses} users={users} reloadBusinesses={e => getBusinesses()}/>
              </Route>
              <Route exact path="/get/handelaars">
                <GetHandelaars businesses={businesses}/>
              </Route>
              <Route exact path="/get/diensten">
                <GetDiensten businesses={businesses}/>
              </Route>
              <Route exact path="/get/vergoedingen/aankopen">
                <GetVergoedingenAankopen />
              </Route>
              <Route exact path="/get/vergoedingen/verkopen">
                <GetVergoedingenVerkopen />
              </Route>
              <Route exact path="/get/vergoedingen">
                <GetVergoedingen />
              </Route>
  
  
              <Route exact path="/get/historiek">
                <GetHistoriek transfers={transfers} orders={orders} events={events}/>
              </Route>
              <Route exact path="/get">
                <Get />
              </Route>
  
  
              <Route exact path="/profiel/edit">
                <ProfielEdit users={users}/>
              </Route>
              <Route exact path="/profiel/:id">
                <Profiel users={users} projects={projects} events={events} reloadUsers={e => getUsers()}/>
              </Route>
              <Route exact path="/profiel">
                <Profiel users={users} projects={projects} events={events}/>
              </Route>
              <Route exact path="/my-events">
                <MyEvents events={events}/>
              </Route>
              <Route exact path="/my-activities">
                <MyActivities activities={activities}/>
              </Route>
              <Route exact path="/my-interests">
                <MyInterests users={users}/>
              </Route>
              <Route exact path="/event-leader-board/:id">
                <EventLeaderBoard events={events} users={users} reloadEvents={e => getAllEvents()}/>
              </Route>


              <Route exact path="/netwerk/dm/:dmId">
                <Netwerk 
                  groups={groups} messages={messages} events={events} users={users} 
                  reloadMessages={e => getMessages()} reloadGroups={e => getGroups()}
                />
              </Route>
              <Route exact path="/netwerk/:groupchatId">
                <Netwerk 
                  groups={groups} messages={messages} events={events} users={users} 
                  reloadMessages={e => getMessages()} reloadGroups={e => getGroups()}
                />
              </Route>
              <Route exact path="/netwerk">
                <Netwerk 
                  groups={groups} messages={messages} events={events} users={users} 
                  reloadMessages={e => getMessages()} reloadGroups={e => getGroups()}
                /> 
              </Route>
  
  
              <Route exact path="/project/create/:id">
                <ProjectCreate />
              </Route>
              <Route exact path="/project/create">
                <ProjectCreate />
              </Route>
  
  
              <Route exact path="/event/create/:id/:eventId">
                <EventCreate projects={projects} skills={skills}/>
              </Route>
              <Route exact path="/event/create/:id">
                <EventCreate projects={projects} skills={skills}/>
              </Route>
              <Route exact path="/activity/update/:id">
                <ActivityUpdate activities={activities}/>
              </Route>
              <Route exact path="/handelaar/create/:id">
                <BusinessCreate businesses={businesses}/>
              </Route>
              <Route exact path="/handelaar/create">
                <BusinessCreate businesses={businesses}/>
              </Route>
              <Route exact path="/dienst/create/:id">
                <BusinessCreate businesses={businesses}/>
              </Route>
              <Route exact path="/dienst/create">
                <BusinessCreate businesses={businesses}/>
              </Route>
              <BusinessRoute exact path="/handelaar-dashboard">
                <BusinessDashboard orders={orders} businesses={businesses} users={users}/>
              </BusinessRoute>
  
  
              <Route exact path="/events/:id">
                <EventShow events={events} reloadEvents={e => getAllEvents()}/>
              </Route>
              <Route exact path="/projects/:id">
                <ProjectShow projects={projects}/>
              </Route>
              <Route exact path="/orders/:id">
                <OrderShow orders={orders} users={users}/>
              </Route>
              <Route exact path="/transfers/:id">
                <TransferShow users={users} transfers={transfers}/>
              </Route>
              <Route exact path="/activities/:id">
                <ActivityShow activities={activities} reloadActivities={e => getActivities()}/>
              </Route>
  
  
              <AdminRoute exact path="/admin">
                <AdminProjects />
              </AdminRoute>
              <AdminRoute exact path="/admin-projects/create">
                <AdminProjectsCreate />
              </AdminRoute>
              <AdminRoute exact path="/admin-projects/edit/:id">
                <AdminProjectsEdit />
              </AdminRoute>
              <AdminRoute exact path="/admin-projects">
                <AdminProjects />
              </AdminRoute>
              <AdminRoute exact path="/admin-projects-events/create">
                <AdminProjectsEventsCreate />
              </AdminRoute>
              <AdminRoute exact path="/admin-projects-events/edit/:id">
                <AdminProjectsEventsEdit />
              </AdminRoute>
              <AdminRoute exact path="/admin-projects-events">
                <AdminProjectsEvents />
              </AdminRoute>
              <AdminRoute exact path="/admin-projects-events-skills">
                <AdminProjectsEventsSkills />
              </AdminRoute>
              <AdminRoute exact path="/admin-businesses/create">
                <AdminBusinessesCreate />
              </AdminRoute>
              <AdminRoute exact path="/admin-businesses/edit/:id">
                <AdminBusinessesEdit />
              </AdminRoute>
              <AdminRoute exact path="/admin-businesses">
                <AdminBusinesses />
              </AdminRoute>
              <AdminRoute exact path="/admin-products/create">
                <AdminProductsCreate />
              </AdminRoute>
              <AdminRoute exact path="/admin-activities/edit/:id">
                <AdminProductsEdit />
              </AdminRoute>
              <AdminRoute exact path="/admin-products">
                <AdminProducts />
              </AdminRoute>
              <AdminRoute exact path="/admin-activities/create">
                <AdminActivitiesCreate />
              </AdminRoute>
              <AdminRoute exact path="/admin-activities/edit/:id">
                <AdminActivitiesEdit />
              </AdminRoute>
              <AdminRoute exact path="/admin-activities">
                <AdminActivities />
              </AdminRoute>
              <AdminRoute exact path="/admin-user-verification">
                <AdminUserVerification />
              </AdminRoute>

              <Route exact path="/event/:eventId/skill/:skillId">
                <EventSkillUser events={events}/>
              </Route>
              {
                isUserLoggedIn ?
                <Route exact path="/">
                  <Home
                    activities={activities} events={events} businesses={businesses} users={users} projects={projects} messages={messages}
                    reloadEvents={e => getAllEvents()} reloadBusinesses={e => getBusinesses()} reloadActivities={e => getActivities()}
                  />
                </Route>
                : <Route exact path="/"><See events={events} activities={activities} businesses={businesses} reloadActivities={() => getActivities()}/></Route>
              }
            </>
            : null
          }
           
        </Switch>
      </Router>
  );
}

export default connect(
  null,
  {getAllEvents, getActivities, getBusinesses, getProjects, getUsers, getMessages, getGroups, getOrders, getTransfers, getSkills}
)(App);
