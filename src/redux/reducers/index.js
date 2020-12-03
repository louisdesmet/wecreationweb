import {ADD_PROJECT} from "../constants/action-types";
const initialState = {
  projects: [],
  remoteProjects: [],
  businesses: [],
  remoteBusinesses: [],
  events: [],
  remoteEvents: [],
  activities: [],
  remoteActivities: [],
  users: [],
  remoteUsers: []
};
function rootReducer(state = initialState, action) {
  if (action.type === ADD_PROJECT) {
    
  }
  if (action.type === "PROJECTS_LOADED") {
    return Object.assign({}, state, {
      remoteProjects: action.payload
    });
  }
  if (action.type === "BUSINESSES_LOADED") {
    return Object.assign({}, state, {
      remoteBusinesses: action.payload
    });
  }
  if (action.type === "EVENTS_LOADED") {
    return Object.assign({}, state, {
      remoteEvents: action.payload
    });
  }
  if (action.type === "ACTIVITIES_LOADED") {
    return Object.assign({}, state, {
      remoteActivities: action.payload
    });
  }
  if (action.type === "USERS_LOADED") {
    return Object.assign({}, state, {
      remoteUsers: action.payload
    });
  }
  if (action.type === "API_ERRORED") {
    console.log('of hier');
    localStorage.setItem('token', null);
    localStorage.setItem('user', null);
    window.location.reload();
  }
  return state;
}
export default rootReducer;