import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import {getActivities, getAllEvents, getBusinesses, getUsers, getProjects, getMessages} from "./redux/actions";
import { Link } from "react-router-dom";
import Axios from 'axios';
import EventShow from "./components/EventShow";
import BusinessShow from "./components/BusinessShow";
import ActivityShow from "./components/ActivityShow";

import handleiding from './img/nav/handleiding.pdf';
import work from './img/nav/work.png';
import see from './img/nav/see.png';
import get from './img/nav/get.png';
import random from './img/nav/random.png';
import profiel from './img/nav/profile.png';
import agenda from './img/nav/agenda.png';
import netwerk from './img/nav/network.png';
import diensten from './img/map/diensten.png';
import close from './img/map/close.png';
import mapFilter from './img/map/map-filter.png';

export const Home = ({getAllEvents, getBusinesses, getUsers, getActivities, getProjects, getMessages}) => {

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    getAllEvents();
    getBusinesses();
    getActivities()
    getUsers();
    getProjects();
    getMessages();
  }, []);

  const [oneTime, setOneTime] = useState(1);
  const [event, setEvent] = useState(null);
  const [business, setBusiness] = useState(null);
  const [activity, setActivity] = useState(null);

  const [liked, setLiked] = useState(false);
  const [likedActivity, setLikedActivity] = useState(false);
  const [likedBusiness, setLikedBusiness] = useState(false);


  const events = useSelector(state => state.remoteAllEvents);
  const businesses = useSelector(state => state.remoteBusinesses);
  const activities = useSelector(state => state.remoteActivities);
  const users = useSelector(state => state.remoteUsers);
  const messages = useSelector(state => state.remoteMessages);
  const projects = useSelector(state => state.remoteProjects);
  //nav

  const [searchActive, setSearchActive] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState("");

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

  const futureEvents = events.data ? events.data.filter(event => {
    return new Date(event.date) > new Date();
  }) : null;
  
  if(activities.data && businesses.data && users.data && futureEvents && oneTime) {
    let rndInt = Math.floor(Math.random() * 5) + 1;

    if(rndInt === 1 || rndInt === 2) {
      let rndIntEvent = Math.floor(Math.random() * futureEvents.length) + 1;
      setEvent(futureEvents.find((event, index) => index + 1 === rndIntEvent));
    } else if(rndInt === 3 || rndInt === 4) {
      let rndIntBusiness = Math.floor(Math.random() * businesses.data.length) + 1;
      setBusiness(businesses.data.find((business, index) => index + 1 === rndIntBusiness));
    }  else {
      let rndIntActivity = Math.floor(Math.random() * activities.data.length) + 1;
      setActivity(activities.data.find((activity, index) => index + 1 === rndIntActivity));
    }
    setOneTime(0);
  }

  function newRandom() {
    console.log('yo');
    let rndInt = Math.floor(Math.random() * 5) + 1;

    if(rndInt === 1 || rndInt === 2) {
      newEvent();
    } else if(rndInt === 3) {
      newBusiness();
    }  else {
      newActivity();
    }
    setLiked(false);
    setLikedActivity(false);
    setLikedBusiness(false);
  }

  function newEvent() {
    let eventsLength = futureEvents ? futureEvents.length : 0;
    let rndIntEvent = Math.floor(Math.random() * eventsLength) + 1;
    setEvent(futureEvents.find((event, index) => index + 1 === rndIntEvent));
    setBusiness(null);
    setActivity(null);
  }

  function newBusiness() {
    let businessLength = businesses.data.length;
    let rndIntBusiness = Math.floor(Math.random() * businessLength) + 1;
    setBusiness(businesses.data.find((business, index) => index + 1 === rndIntBusiness));
    setEvent(null);
    setActivity(null);
  }

  function newActivity() {
    let activityLength = activities.data.length;
    let rndIntActivity = Math.floor(Math.random() * activityLength) + 1;
    setActivity(activities.data.find((activity, index) => index + 1 === rndIntActivity));
    setEvent(null);
    setBusiness(null);
  }

  const likeEvent = (eventId) => {
    Axios.post('/like-event', {
      'event': eventId,
      'user': JSON.parse(localStorage.getItem("user")).id
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      }
    })
    .then((response) => {
      getAllEvents();
      setLiked(true);
    })
    .catch((error) => {
  
    })
  }

  const likeActivity = (activityId) => {
    Axios.post('/like-activity', {
      'activity': activityId,
      'user': JSON.parse(localStorage.getItem("user")).id
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      }
    })
    .then((response) => {
        getActivities();
        setLikedActivity(true);
    })
    .catch((error) => {
  
    })
  }

  const likeBusiness = (businessId) => {
    Axios.post('/like-business', {
      'business': businessId,
      'user': JSON.parse(localStorage.getItem("user")).id
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      }
    })
    .then((response) => {
        getBusinesses();
        setLikedBusiness(true);
    })
    .catch((error) => {
  
    })
  }

  function search() {
    searchActive && setQuery("");
    setSearchActive(!searchActive);
  }

  function getResults(value) {
    setQuery(value);
    setResults(businesses.data.filter(business => business.name.toLowerCase().includes(value.toLowerCase())).concat(projects.data.filter(project => project.name.toLowerCase().includes(value.toLowerCase())), events.data.filter(event => event.name.toLowerCase().includes(value.toLowerCase())), activities.data.filter(activity => activity.name.toLowerCase().includes(value.toLowerCase())), users.data.filter(user => user.name.toLowerCase().includes(value.toLowerCase()))));
  }
  console.log(results ? results : null);
  const resultList = results ? results.map(result => <Link to={result.urlText + result.id + (result.urlText2 ? result.urlText2 : "")}>
    <img src={result.type === "business" ? get : result.type === "service" ? diensten : result.type === "user" ? profiel : result.type === "activity" ? activity : result.type === "event" ? agenda : result.type === "project" ? work : null }/>
    <p>{result.name}</p>
  </Link>) : null
  
  return (
    <div className="height100">
      <div className='nav'>
        {
          searchActive ? <input onChange={e => getResults(e.target.value)} type="text" placeholder="Zoek naar events, activiteiten, gebruikers en handelaars"/> : <div className="innernav">
            <div><Link to="/work"><img src={work} alt=""/></Link></div>
            <div><Link to="/see"><img src={see} alt=""/></Link></div>
            <div><Link to="/get"><img src={get} alt=""/></Link></div>
            <div onClick={e => newRandom()}><Link to="/home"><img src={random} alt=""/></Link></div>
            <div><Link to="/profiel"><img src={profiel} alt=""/></Link></div>
            <div><Link to="/agenda"><img src={agenda} alt=""/></Link></div>
            <div>
              <Link to="/netwerk">
                <img src={netwerk} alt=""/>
                {
                  loggedUser ? <span className="notifications">{messages.data ? messages.data.filter(message => message.notification && message.recipient.id === loggedUser.id && message.seen == 0).length : null}</span> : null
                }
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
      {event ? <EventShow event={event} likeEvent={likeEvent} liked={liked}/> : null}
      {business && users.data ? <BusinessShow business={business} users={users.data} likeBusiness={likeBusiness} liked={likedBusiness}/> : null}
      {activity ? <ActivityShow activity={activity} likeActivity={likeActivity} liked={likedActivity}/> : null}
    </div>
  );
}

export default connect(
  null,
  { getAllEvents, getBusinesses, getUsers, getActivities, getProjects, getMessages }
)(Home);