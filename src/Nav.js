import React, { useEffect, useState } from "react";
import {getActivities, getBusinesses, getAllEvents, getProjects, getUsers, getMessages} from "./redux/actions";
import { connect, useSelector } from "react-redux";
import {Link} from "react-router-dom";
import './css/Nav.scss';

import handleiding from './img/nav/handleiding.pdf';
import work from './img/nav/work.png';
import see from './img/nav/see.png';
import get from './img/nav/get.png';
import random from './img/nav/random.png';
import profiel from './img/nav/profile.png';
import agenda from './img/nav/agenda.png';
import netwerk from './img/nav/network.png';
import mapFilter from './img/map/map-filter.png';
import close from './img/map/close.png';
import activity from './img/profile/badges.png';
import diensten from './img/map/diensten.png';

export const Nav = ({getBusinesses, getActivities, getAllEvents, getProjects, getUsers, getMessages}) => {

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const [searchActive, setSearchActive] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState("");

  const businesses = useSelector(state => state.remoteBusinesses);

  useEffect(() => {
    if(loggedUser) {
      if(!businesses.data || businesses.data.length === 0) {
        getBusinesses();
      }
      if(!activities.data || activities.data.length === 0) {
        getActivities();
      }
      if(!events.data || events.data.length === 0) {
        getAllEvents();
      }
      if(!projects.data || projects.data.length === 0) {
        getProjects();
      }
      if(!users.data || users.data.length === 0) {
        getUsers();
      }
    }
    getMessages();
  }, []);

  const activities = useSelector(state => state.remoteActivities);
  const events = useSelector(state => state.remoteAllEvents);
  const projects = useSelector(state => state.remoteProjects);
  const users = useSelector(state => state.remoteUsers);
  const messages = useSelector(state => state.remoteMessages);

  if(businesses.data && activities.data && events.data && projects.data && users.data) {
    activities.data.forEach(function (element) {
      element.type = "activity";
      element.urlText = "/activities/";
    });
    events.data.forEach(function (element) {
      element.type = "event";
      element.urlText = "/events/";
    });
    projects.data.forEach(function (element) {
      element.type = "project";
      element.urlText = "/projects/";
    });
    users.data.forEach(function (element) {
      element.type = "user";
      element.urlText = "/profiel/";
    });
    businesses.data.forEach(function (element) {
      element.urlText = "/get/handelaars/";
      element.urlText2 = "/products";
    });
  }

  function search() {
    searchActive && setQuery("");
    setSearchActive(!searchActive);
  }

  function getResults(value) {
    setQuery(value);
    setResults(businesses.data.filter(business => business.name.toLowerCase().includes(value.toLowerCase())).concat(projects.data.filter(project => project.name.toLowerCase().includes(value.toLowerCase())), events.data.filter(event => event.name.toLowerCase().includes(value.toLowerCase())), activities.data.filter(activity => activity.name.toLowerCase().includes(value.toLowerCase())), users.data.filter(user => user.name.toLowerCase().includes(value.toLowerCase()))));
  }

  const resultList = results ? results.map(result => <Link to={result.urlText + result.id + (result.urlText2 ? result.urlText2 : "")}>
    <img src={result.type === "business" ? get : result.type === "service" ? diensten : result.type === "user" ? profiel : result.type === "activity" ? activity : result.type === "event" ? agenda : result.type === "project" ? work : null }/>
    <p>{result.name}</p>
  </Link>) : null

  return (
    <div className='nav'>
        {
          searchActive ? <input onChange={e => getResults(e.target.value)} type="text" placeholder="Zoek naar events, activiteiten, gebruikers en handelaars"/> : <div className="innernav">
            <div><Link to="/work"><img src={work} alt=""/></Link></div>
            <div><Link to="/see"><img src={see} alt=""/></Link></div>
            <div><Link to="/get"><img src={get} alt=""/></Link></div>
            <div><Link to="/home"><img src={random} alt=""/></Link></div>
            <div><Link to="/profiel"><img src={profiel} alt=""/></Link></div>
            <div><Link to="/agenda"><img src={agenda} alt=""/></Link></div>
            <div>
              <Link to="/netwerk">
                <img src={netwerk} alt=""/>
                <span className="notifications">{messages.data ? messages.data.filter(message => message.notification && message.recipient.id === loggedUser.id && message.seen == 0).length : null}</span>
              </Link>
            </div>
          </div>
        }
        <a href={handleiding} className="manual" target="_blank">?</a>
        {
          loggedUser ? searchActive ? <img onClick={e => search()} className="filter close" src={close}/> : <img onClick={e => search()} className="filter" src={mapFilter}/> : null
        }
        {
          query ? <div className="results">
            {resultList.length ? resultList : <div>Geen resultaten</div>}
          </div> : null
        }
    </div>
  );
}

export default connect(
  null,
  {getBusinesses, getActivities, getAllEvents, getProjects, getUsers, getMessages}
)(Nav);
