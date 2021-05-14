import {ADD_PROJECT} from "../constants/action-types";


export function addProject(payload) {
  return { type: ADD_PROJECT, payload };
}

export function getProjects() {
  return { type: "PROJECTS_REQUESTED" };
}

export function getBusinesses() {
  return { type: "BUSINESSES_REQUESTED" };
}

export function getEvents() {
  return { type: "EVENTS_REQUESTED" };
}

export function getAllEvents() {
  return { type: "ALL_EVENTS_REQUESTED" };
}

export function getActivities() {
  return { type: "ACTIVITIES_REQUESTED" };
}

export function getUsers() {
  return { type: "USERS_REQUESTED" };
}

export function getSkills() {
  return { type: "SKILLS_REQUESTED" };
}

export function getMessages() {
  return { type: "MESSAGES_REQUESTED" };
}