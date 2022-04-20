import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import {getAllEvents, getBusinesses, getUsers} from "./redux/actions";
import { Link } from "react-router-dom";
import Axios from 'axios';
import EventShow from "./components/EventShow";

import work from './img/nav/work.png';
import see from './img/nav/see.png';
import get from './img/nav/get.png';
import random from './img/nav/random.png';
import profiel from './img/nav/profile.png';
import agenda from './img/nav/agenda.png';
import netwerk from './img/nav/network.png';
import BusinessShow from "./components/BusinessShow";

export const Home = ({getAllEvents, getBusinesses, getUsers}) => {

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    getAllEvents();
    getBusinesses();
    getUsers();
  }, []);

  const [oneTime, setOneTime] = useState(1);
  const [event, setEvent] = useState(null);
  const [business, setBusiness] = useState(null);
  const [liked, setLiked] = useState(false);

  const events = useSelector(state => state.remoteAllEvents);
  const businesses = useSelector(state => state.remoteBusinesses);
  const users = useSelector(state => state.remoteUsers);

  const futureEvents = events.data ? events.data.filter(event => {
    return new Date(event.date) > new Date();
  }) : null;
  
  if(businesses.data && users.data && futureEvents && oneTime) {
    let rndInt = Math.floor(Math.random() * 2) + 1;

    if(rndInt === 1) {
      let rndIntEvent = Math.floor(Math.random() * futureEvents.length) + 1;
      setEvent(futureEvents.find((event, index) => index + 1 === rndIntEvent));
    } else {
      let rndIntBusiness = Math.floor(Math.random() * businesses.data.length) + 1;
      let business = businesses.data.find((business, index) => index + 1 === rndIntBusiness);
      setBusiness(business);
    } 
    setOneTime(0);
  }

  function newRandom() {
    let rndInt = Math.floor(Math.random() * 2) + 1;
    rndInt === 1 ? newEvent() : newBusiness();
  }

  function newEvent() {
    let eventsLength = futureEvents ? futureEvents.length : 0;
    let rndIntEvent = Math.floor(Math.random() * eventsLength) + 1;
    setEvent(futureEvents.find((event, index) => index + 1 === rndIntEvent));
    setBusiness(null);
    setLiked(false);
  }

  function newBusiness() {
    let businessLength = businesses.data.length;
    let rndIntBusiness = Math.floor(Math.random() * businessLength) + 1;

    let business = businesses.data.find((business, index) => index + 1 === rndIntBusiness);
    setBusiness(business);
    setEvent(null);
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
  
  return (
    <div className="height100">
      <div className='nav'>
        <div className="innernav">
            <div><Link to="/work"><img src={work} alt=""/></Link></div>
            <div><Link to="/see"><img src={see} alt=""/></Link></div>
            <div><Link to="/get"><img src={get} alt=""/></Link></div>
            <div onClick={e => newRandom()}><Link to="/home"><img src={random} alt=""/></Link></div>
            <div><Link to="/profiel"><img src={profiel} alt=""/></Link></div>
            <div><Link to="/agenda"><img src={agenda} alt=""/></Link></div>
            <div><Link to="/netwerk"><img src={netwerk} alt=""/></Link></div>
        </div>
      </div>
      {event ? <EventShow event={event} likeEvent={likeEvent} liked={liked}/> : null}
      {business && users.data ? <BusinessShow business={business} users={users.data}/> : null}
    </div>
  );
}

export default connect(
  null,
  { getAllEvents, getBusinesses, getUsers }
)(Home);