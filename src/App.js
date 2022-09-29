import React, { useEffect } from "react";
import {connect, useSelector} from "react-redux";
import {getAllEvents, getActivities, getBusinesses, getProjects, getUsers, getMessages, getGroups, getOrders, getTransfers, getSkills} from "./redux/actions";
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
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
import { Outlet } from "react-router";

const PrivateRoute = ({component: Component, ...rest}) => {
  return (
      <Route {...rest} render={props => (
        localStorage.getItem('token') !== 'null' &&
        localStorage.getItem('token') !== null &&
        typeof localStorage.getItem('token') !== 'undefined'
        ? <Component {...props} /> : <Navigate to="/login" />
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
      <Navigate to="/login" />
    )} />
  );
};

const AuthLayout = () => {
  return JSON.parse(localStorage.getItem("user")).roles.find(role => role.name === 'admin')
    ? <Outlet />
    : <Navigate to="/login" />
}

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
        
        <Routes>
          <Route exact path="/login" element={<Login />}></Route>
          <Route exact path="/forgot" element={ <Forgot />}></Route>
          <Route exact path="/password/reset/:token/:email" element={<ResetPassword />}></Route>
          <Route exact path="/register" element={<Register reloadUsers={e => getUsers()}/>}></Route>
  
          {
              events.data && activities.data && businesses.data && projects.data && users.data && messages.data && groups.data && orders.data && transfers.data ?
            <>
              <Route exact path="/see" element={<See events={events} activities={activities} businesses={businesses} reloadActivities={() => getActivities()}/>}>
                
              </Route>
              <Route exact path="/agenda/:id" element={<Agenda events={events} activities={activities} reloadEvents={e => getAllEvents()} reloadActivities={() => getActivities()}/>}>
                
              </Route>    
              <Route exact path="/agenda" element={<Agenda events={events} activities={activities} reloadEvents={e => getAllEvents()} reloadActivities={() => getActivities()}/>}>
               
              </Route>

              <Route exact path="/home" element={<Home 
                activities={activities} events={events} businesses={businesses} users={users} projects={projects} messages={messages}
                reloadEvents={e => getAllEvents()} reloadBusinesses={e => getBusinesses()} reloadActivities={e => getActivities()}
              />}></Route>
              <Route exact path="/work" element={<Work projects={projects} events={events} users={users}/>}></Route>
  
  
              <Route exact path="/get/handelaars/:id/products" element={<GetProducts businesses={businesses} users={users} reloadBusinesses={e => getBusinesses()}/>}>
              
              </Route>
              <Route exact path="/get/handelaars" element={<GetHandelaars businesses={businesses}/>}>
             
              </Route>
              <Route exact path="/get/diensten" element={<GetDiensten businesses={businesses}/>}>
              
              </Route>
              <Route exact path="/get/vergoedingen/aankopen" element={<GetVergoedingenAankopen />}>
              </Route>
              <Route exact path="/get/vergoedingen/verkopen" element={<GetVergoedingenVerkopen />}>
                
              </Route>
              <Route exact path="/get/vergoedingen" element={<GetVergoedingen />}>
               
              </Route>
  
  
              <Route exact path="/get/historiek" element={<GetHistoriek transfers={transfers} orders={orders} events={events}/>}>
                
              </Route>
              <Route exact path="/get" element={<Get />}>
                
              </Route>
  
  
              <Route exact path="/profiel/edit" element={<ProfielEdit users={users}/>}>
                
              </Route>
              <Route exact path="/profiel/:id" element={<Profiel users={users} projects={projects} events={events} reloadUsers={e => getUsers()}/>}>
                
              </Route>
              <Route exact path="/profiel" element={<Profiel users={users} projects={projects} events={events}/>}>
                
              </Route>
              <Route exact path="/my-events" element={<MyEvents events={events}/>}>
                
              </Route>
              <Route exact path="/my-activities" element={<MyActivities activities={activities}/>}>
                
              </Route>
              <Route exact path="/my-interests" element={<MyInterests users={users}/>}>
                
              </Route>
              <Route exact path="/event-leader-board/:id" element={<EventLeaderBoard events={events} users={users} reloadEvents={e => getAllEvents()}/>}>
               
              </Route>


              <Route exact path="/netwerk/dm/:dmId" element={<Netwerk 
                  groups={groups} messages={messages} events={events} users={users} 
                  reloadMessages={e => getMessages()} reloadGroups={e => getGroups()}
              />}>
             
              </Route>
              <Route exact path="/netwerk/:groupchatId" element={<Netwerk 
                  groups={groups} messages={messages} events={events} users={users} 
                  reloadMessages={e => getMessages()} reloadGroups={e => getGroups()}
                />}>
              
              </Route>
              <Route exact path="/netwerk" element={<Netwerk 
                  groups={groups} messages={messages} events={events} users={users} 
                  reloadMessages={e => getMessages()} reloadGroups={e => getGroups()}
                /> }>
              
              </Route>
  
  
              <Route exact path="/project/create/:id" element={<ProjectCreate />}>
                
              </Route>
              <Route exact path="/project/create" element={<ProjectCreate />}>
                
              </Route>
  
  
              <Route exact path="/event/create/:id/:eventId" element={<EventCreate projects={projects} skills={skills}/>}>
                
              </Route>
              <Route exact path="/event/create/:id" element={<EventCreate projects={projects} skills={skills}/>}>
                
              </Route>
              <Route exact path="/activity/update/:id" element={<ActivityUpdate activities={activities}/>}>
                
              </Route>
              <Route exact path="/handelaar/create/:id" element={<BusinessCreate businesses={businesses}/>}>
                
              </Route>
              <Route exact path="/handelaar/create" element={<BusinessCreate businesses={businesses}/>}>
                
              </Route>
              <Route exact path="/dienst/create/:id" element={<BusinessCreate businesses={businesses}/>}>
               
              </Route>
              <Route exact path="/dienst/create" element={<BusinessCreate businesses={businesses}/>}>
                
              </Route>
              <Route exact path="/handelaar-dashboard" element={<BusinessDashboard orders={orders} businesses={businesses} users={users}/>}>
               
              </Route>
  
  
              <Route exact path="/events/:id" element={<EventShow events={events} reloadEvents={e => getAllEvents()}/>}>
               
              </Route>
              <Route exact path="/projects/:id" element={<ProjectShow projects={projects}/>}>
              
              </Route>
              <Route exact path="/orders/:id" element={<OrderShow orders={orders} users={users}/>}>
                
              </Route>
              <Route exact path="/transfers/:id" element={<TransferShow users={users} transfers={transfers}/>}>
                
              </Route>
              <Route exact path="/activities/:id" element={<ActivityShow activities={activities} reloadActivities={e => getActivities()}/>}>
                
              </Route>
  

              <Route element={<AuthLayout />}>
                <Route exact path="/admin" element={AdminProjects}></Route>
                <Route exact path="/admin-projects/create" element={AdminProjectsCreate}>
                </Route>
                <Route exact path="/admin-projects/edit/:id" element={AdminProjectsEdit}>
                </Route>
                <Route exact path="/admin-projects" element={AdminProjects}>
                </Route>
                <Route exact path="/admin-projects-events/create" element={AdminProjectsEventsCreate}>
                </Route>
                <Route exact path="/admin-projects-events/edit/:id" element={AdminProjectsEventsEdit}>
                </Route>
                <Route exact path="/admin-projects-events" element={AdminProjectsEvents}>
                </Route>
                <Route exact path="/admin-projects-events-skills" element={AdminProjectsEventsSkills}>
                </Route>
                <Route exact path="/admin-businesses/create" element={AdminBusinessesCreate}>
                </Route>
                <Route exact path="/admin-businesses/edit/:id" element={AdminBusinessesEdit}>
                </Route>
                <Route exact path="/admin-businesses" element={AdminBusinesses}>
                </Route>
                <Route exact path="/admin-products/create" element={AdminProductsCreate}>
                </Route>
                <Route exact path="/admin-activities/edit/:id" element={AdminProductsEdit}>
                </Route>
                <Route exact path="/admin-products" element={AdminProducts}>
                </Route>
                <Route exact path="/admin-activities/create" element={AdminActivitiesCreate}>
                </Route>
                <Route exact path="/admin-activities/edit/:id" element={AdminActivitiesEdit}>
                </Route>
                <Route exact path="/admin-activities" element={AdminActivities}>
                </Route>
                <Route exact path="/admin-user-verification" element={AdminUserVerification}>
                </Route>
              </Route>
              

              <Route exact path="/event/:eventId/skill/:skillId" element={<EventSkillUser events={events}/>}>
                
              </Route>
              {
                isUserLoggedIn ?
                <Route exact path="/" element={<Home
                  activities={activities} events={events} businesses={businesses} users={users} projects={projects} messages={messages}
                  reloadEvents={e => getAllEvents()} reloadBusinesses={e => getBusinesses()} reloadActivities={e => getActivities()}
                />}>
                 
                </Route>
                : <Route exact path="/"  element={<See events={events} activities={activities} businesses={businesses} reloadActivities={() => getActivities()}/>}></Route>
              }
            </>
            : null
          }
           
        </Routes>
      </Router>
  );
}

export default connect(
  null,
  {getAllEvents, getActivities, getBusinesses, getProjects, getUsers, getMessages, getGroups, getOrders, getTransfers, getSkills}
)(App);
