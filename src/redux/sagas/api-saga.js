import { takeEvery, call, put } from "redux-saga/effects";

const url = (process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/api' : 'http://api.test/api');

export default function* watcherSaga() {
  yield takeEvery("PROJECTS_REQUESTED", projectsWorkerSaga);
  yield takeEvery("BUSINESSES_REQUESTED", businessesWorkerSaga);
  yield takeEvery("EVENTS_REQUESTED", eventsWorkerSaga);
  yield takeEvery("ALL_EVENTS_REQUESTED", allEventsWorkerSaga);
  yield takeEvery("ACTIVITIES_REQUESTED", activitiesWorkerSaga);
  yield takeEvery("USERS_REQUESTED", usersWorkerSaga);
  yield takeEvery("SKILLS_REQUESTED", skillsWorkerSaga);
  yield takeEvery("MESSAGES_REQUESTED", messagesWorkerSaga);
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

function getProjects() {
  return fetch(url + '/projects', {
    headers: new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem("token"),
      'Accept': 'application/json'
    })
  }).then(function(response) {
    return response.json();
  });
}

function getBusinesses() {
  return fetch(url + '/businesses', {
    headers: new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem("token"),
      'Accept': 'application/json'
    })
  }).then(function(response) {
    return response.json();
  });
}

function getEvents() {
  return fetch(url + '/users/' + JSON.parse(localStorage.getItem("user")).id + '/events', {
    headers: new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem("token"),
      'Accept': 'application/json'
    })
  }).then(function(response) {
    return response.json();
  });
}

function getAllEvents() {
  return fetch(url + '/events', {
    headers: new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem("token"),
      'Accept': 'application/json'
    })
  }).then(function(response) {
    return response.json();
  });
}

function getActivities() {
  return fetch(url + '/activities', {
    headers: new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem("token"),
      'Accept': 'application/json'
    })
  }).then(function(response) {
    return response.json();
  });
}

function getUsers() {
  return fetch(url + '/users', {
    headers: new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem("token"),
      'Accept': 'application/json'
    })
  }).then(function(response) {
    return response.json();
  });
}

function getSkills() {
  return fetch(url + '/skills', {
    headers: new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem("token"),
      'Accept': 'application/json'
    })
  }).then(function(response) {
    return response.json();
  });
}

function getMessages() {
  return fetch(url + '/messages', {
    headers: new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem("token"),
      'Accept': 'application/json'
    })
  }).then(function(response) {
    return response.json();
  });
}

