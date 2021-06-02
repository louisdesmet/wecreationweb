import { takeEvery, call, put } from "redux-saga/effects";
import locprod from '../../Global';

export default function* watcherSaga() {
  yield takeEvery("PROJECTS_REQUESTED", projectsWorkerSaga);
  yield takeEvery("BUSINESSES_REQUESTED", businessesWorkerSaga);
  yield takeEvery("EVENTS_REQUESTED", eventsWorkerSaga);
  yield takeEvery("ALL_EVENTS_REQUESTED", allEventsWorkerSaga);
  yield takeEvery("ACTIVITIES_REQUESTED", activitiesWorkerSaga);
  yield takeEvery("USERS_REQUESTED", usersWorkerSaga);
  yield takeEvery("SKILLS_REQUESTED", skillsWorkerSaga);
  yield takeEvery("MESSAGES_REQUESTED", messagesWorkerSaga);
  yield takeEvery("ORDERS_REQUESTED", ordersWorkerSaga);
  
}

function* projectsWorkerSaga() {
  try {
    const payload = yield call(getProjects);
    if(payload.message !== "Unauthenticated.") {
      yield put({ type: "PROJECTS_LOADED", payload });
    } else {
      yield put({ type: "API_ERRORED", payload });
    } 
  } catch (e) {
    yield put({ type: "API_ERRORED", payload: e });
  }
}

function* businessesWorkerSaga() {
  try {
    const payload = yield call(getBusinesses);
    if(payload.message !== "Unauthenticated.") {
      yield put({ type: "BUSINESSES_LOADED", payload });
    } else {
      yield put({ type: "API_ERRORED", payload });
    } 
  } catch (e) {
    yield put({ type: "API_ERRORED", payload: e });
  }
}

function* eventsWorkerSaga() {
  try {
    const payload = yield call(getEvents);
    if(payload.message !== "Unauthenticated.") {
      yield put({ type: "EVENTS_LOADED", payload });
    } else {
      yield put({ type: "API_ERRORED", payload });
    } 
  } catch (e) {
    yield put({ type: "API_ERRORED", payload: e });
  }
}

function* allEventsWorkerSaga() {
  try {
    const payload = yield call(getAllEvents);
    if(payload.message !== "Unauthenticated.") {
      yield put({ type: "ALL_EVENTS_LOADED", payload });
    } else {
      yield put({ type: "API_ERRORED", payload });
    } 
  } catch (e) {
    yield put({ type: "API_ERRORED", payload: e });
  }
}

function* activitiesWorkerSaga() {
  try {
    const payload = yield call(getActivities);
    if(payload.message !== "Unauthenticated.") {
      yield put({ type: "ACTIVITIES_LOADED", payload });
    } else {
      yield put({ type: "API_ERRORED", payload });
    }  
  } catch (e) {
    yield put({ type: "API_ERRORED", payload: e });
  }
}

function* usersWorkerSaga() {
  try {
    const payload = yield call(getUsers);
    if(payload.message !== "Unauthenticated.") {
      yield put({ type: "USERS_LOADED", payload });
    } else {
      yield put({ type: "API_ERRORED", payload });
    } 
  } catch (e) {
    yield put({ type: "API_ERRORED", payload: e });
  }
}

function* skillsWorkerSaga() {
  try {
    const payload = yield call(getSkills);
    if(payload.message !== "Unauthenticated.") {
      yield put({ type: "SKILLS_LOADED", payload });
    } else {
      yield put({ type: "API_ERRORED", payload });
    } 
  } catch (e) {
    yield put({ type: "API_ERRORED", payload: e });
  }
}

function* messagesWorkerSaga() {
  try {
    const payload = yield call(getMessages);
    if(payload.message !== "Unauthenticated.") {
      yield put({ type: "MESSAGES_LOADED", payload });
    } else {
      yield put({ type: "API_ERRORED", payload });
    } 
  } catch (e) {
    yield put({ type: "API_ERRORED", payload: e });
  }
}

function* ordersWorkerSaga() {
  try {
    const payload = yield call(getOrders);
    if(payload.message !== "Unauthenticated.") {
      yield put({ type: "ORDERS_LOADED", payload });
    } else {
      yield put({ type: "API_ERRORED", payload });
    } 
  } catch (e) {
    yield put({ type: "API_ERRORED", payload: e });
  }
}

function getProjects() {
  return fetch(locprod + '/projects', {
    headers: new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem("token"),
      'Accept': 'application/json'
    })
  }).then(function(response) {
    return response.json();
  });
}

function getBusinesses() {
  return fetch(locprod + '/businesses', {
    headers: new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem("token"),
      'Accept': 'application/json'
    })
  }).then(function(response) {
    return response.json();
  });
}

function getEvents() {
  return fetch(locprod + '/users/' + JSON.parse(localStorage.getItem("user")).id + '/events', {
    headers: new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem("token"),
      'Accept': 'application/json'
    })
  }).then(function(response) {
    return response.json();
  });
}

function getAllEvents() {
  return fetch(locprod + '/events', {
    headers: new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem("token"),
      'Accept': 'application/json'
    })
  }).then(function(response) {
    return response.json();
  });
}

function getActivities() {
  return fetch(locprod + '/activities', {
    headers: new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem("token"),
      'Accept': 'application/json'
    })
  }).then(function(response) {
    return response.json();
  });
}

function getUsers() {
  return fetch(locprod + '/users', {
    headers: new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem("token"),
      'Accept': 'application/json'
    })
  }).then(function(response) {
    return response.json();
  });
}

function getSkills() {
  return fetch(locprod + '/skills', {
    headers: new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem("token"),
      'Accept': 'application/json'
    })
  }).then(function(response) {
    return response.json();
  });
}

function getMessages() {
  return fetch(locprod + '/messages', {
    headers: new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem("token"),
      'Accept': 'application/json'
    })
  }).then(function(response) {
    return response.json();
  });
}

function getOrders() {
  return fetch(locprod + '/orders', {
    headers: new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem("token"),
      'Accept': 'application/json'
    })
  }).then(function(response) {
    return response.json();
  });
}

