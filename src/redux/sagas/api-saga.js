import { takeEvery, call, put } from "redux-saga/effects";

export default function* watcherSaga() {
  yield takeEvery("PROJECTS_REQUESTED", projectsWorkerSaga);
  yield takeEvery("BUSINESSES_REQUESTED", businessesWorkerSaga);
  yield takeEvery("EVENTS_REQUESTED", eventsWorkerSaga);
  yield takeEvery("ACTIVITIES_REQUESTED", activitiesWorkerSaga);
}

function* projectsWorkerSaga() {
  try {
    const payload = yield call(getProjects);
    yield put({ type: "PROJECTS_LOADED", payload });
  } catch (e) {
    yield put({ type: "API_ERRORED", payload: e });
  }
}

function* businessesWorkerSaga() {
  try {
    const payload = yield call(getBusinesses);
    yield put({ type: "BUSINESSES_LOADED", payload });
  } catch (e) {
    yield put({ type: "API_ERRORED", payload: e });
  }
}

function* eventsWorkerSaga() {
  try {
    const payload = yield call(getEvents);
    yield put({ type: "EVENTS_LOADED", payload });
  } catch (e) {
    yield put({ type: "API_ERRORED", payload: e });
  }
}

function* activitiesWorkerSaga() {
  try {
    const payload = yield call(getActivities);
    yield put({ type: "ACTIVITIES_LOADED", payload });
  } catch (e) {
    yield put({ type: "API_ERRORED", payload: e });
  }
}

function getProjects() {
  return fetch('http://142.93.239.42/api/projects', {
    headers: new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem("token"),
      'Accept': 'application/json'
    })
  }).then(function(response) {
    return response.json();
  });
}

function getBusinesses() {
  return fetch('http://142.93.239.42/api/businesses', {
    headers: new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem("token"),
      'Accept': 'application/json'
    })
  }).then(function(response) {
    return response.json();
  });
}

function getEvents() {
  return fetch('http://142.93.239.42/api/users/' + JSON.parse(localStorage.getItem("user")).id + '/events', {
    headers: new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem("token"),
      'Accept': 'application/json'
    })
  }).then(function(response) {
    return response.json();
  });
}

function getActivities() {
  return fetch('http://142.93.239.42/api/activities', {
    headers: new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem("token"),
      'Accept': 'application/json'
    })
  }).then(function(response) {
    return response.json();
  });
}