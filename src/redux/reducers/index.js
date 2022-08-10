import {ADD_PROJECT} from "../constants/action-types";
const initialState = {
  projects: [],
  remoteProjects: [],
  businesses: [],
  remoteBusinesses: [],
  events: [],
  remoteEvents: [],
  allEvents: [],
  remoteAllEvents: [],
  activities: [],
  remoteActivities: [],
  users: [],
  remoteUsers: [],
  skills: [],
  remoteSkills: [],
  messages: [],
  remoteMessages: [],
  orders: [],
  remoteOrders: [],
  transfers: [],
  remoteTransfers: [],
  groups: [],
  remoteGroups: []
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
  if (action.type === "ALL_EVENTS_LOADED") {
    return Object.assign({}, state, {
      remoteAllEvents: action.payload
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
  if (action.type === "SKILLS_LOADED") {
    return Object.assign({}, state, {
      remoteSkills: action.payload
    });
  }
  if (action.type === "MESSAGES_LOADED") {
    return Object.assign({}, state, {
      remoteMessages: action.payload
    });
  }
  if (action.type === "ORDERS_LOADED") {
    return Object.assign({}, state, {
      remoteOrders: action.payload
    });
  }
  if (action.type === "TRANSFERS_LOADED") {
    return Object.assign({}, state, {
      remoteTransfers: action.payload
    });
  }
  if (action.type === "GROUPS_LOADED") {
    return Object.assign({}, state, {
      remoteGroups: action.payload
    });
  }
  if (action.type === "API_ERRORED") {
    localStorage.setItem('token', null);
    localStorage.setItem('user', null);
    window.location.reload();
  }
  return state;
}
export default rootReducer;