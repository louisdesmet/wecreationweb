import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {getActivities, getBusinesses, getAllEvents} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link } from 'react-router-dom';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import './css/See.scss';
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import Nav from "./Nav";
import location from './img/nav-see.png';
import datum from './img/nav-agenda.png';


import see from './img/nav/see.png';
import evenementen from './img/profile/badges.png';
import get from './img/nav/get.png';
import diensten from './img/map/diensten.png';
import work from './img/nav/work.png';
import free from './img/profile/free.png';
import credit from './img/profile/credit.png';

import active from './img/map/filter-active.png';
import nonactive from './img/map/filter-nonactive.png';

let workIcon = L.icon({
  iconUrl: work,
  iconSize: [30, 30],
  popupAnchor: [0, -20],
});
let dienstIcon = L.icon({
  iconUrl: diensten,
  iconSize: [30, 30],
  popupAnchor: [0, -20],
});
let evenementenIcon = L.icon({
  iconUrl: evenementen,
  iconSize: [30, 30],
  popupAnchor: [0, -20],
});
let getIcon = L.icon({
  iconUrl: get,
  iconSize: [30, 30],
  popupAnchor: [0, -20],
});

export const See = ({getBusinesses, getActivities, getAllEvents}) => {

  const [a, setA] = useState(true);
  const [b, setB] = useState(true);
  const [c, setC] = useState(true);
  const [d, setD] = useState(true);
  const [e, setE] = useState(true);

  const [today, setToday] = useState(false);
  const [week, setWeek] = useState(false);

  useEffect(() => {
    getBusinesses();
    getActivities();
    getAllEvents();
  }, []);

  const position = [51.05, 3.71667];

  const businesses = useSelector(state => state.remoteBusinesses);
  const activities = useSelector(state => state.remoteActivities);
  const events = useSelector(state => state.remoteAllEvents)

  const businessMarkers = businesses.data ? businesses.data.filter((business) => {
      return business.type === 'business';
  }).map(business => {
    return <Marker key={business.id} position={[business.lat, business.lng]} icon={getIcon}>
      <Popup className="popup">
        <h2><Link to={"/get/handelaars/" + business.id + "/products"}>{business.name}</Link></h2>
        <p>{business.description}</p>
        <div className="data-container">
          <img src={location}/>
          <p>{business.location}</p>
        </div>
      </Popup>
    </Marker>
  }) : null;

  const serviceMarkers = businesses.data ? businesses.data.filter((business) => {
      return business.type === 'service';
  }).map(business => {
    return <Marker key={business.id} position={[business.lat, business.lng]} icon={dienstIcon}>
      <Popup className="popup">
        <h2><Link to={"/businesses/" + business.id}>{business.name}</Link></h2>
        <p>{business.description}</p>
        <div className="data-container">
          <img src={location}/>
          <p>{business.location}</p>
        </div>
      </Popup>
    </Marker>
  }) : null;

  const isToday = (someDate) => {
    const today = new Date()
    return someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()
  }

  const WEEK_LENGTH = 604800000;

  function onCurrentWeek(date) {

      var lastMonday = new Date(); // Creating new date object for today
      lastMonday.setDate(lastMonday.getDate() - (lastMonday.getDay()-1)); // Setting date to last monday
      lastMonday.setHours(0,0,0,0); // Setting Hour to 00:00:00:00
      
      const res = lastMonday.getTime() <= date.getTime() && date.getTime() < ( lastMonday.getTime() + WEEK_LENGTH);
      return res; // true / false
  }

  const activityMarker = (activity) => <Marker key={activity.id} position={[activity.lat, activity.lng]} icon={evenementenIcon}>
    <Popup className="popup">
      <h2>{activity.name}</h2>
      <div className="data-container">
        <img src={datum}/>
        <p>{activity.date}</p>
      </div>
      <div className="data-container">
        <img src={location}/>
        <p>{activity.location}</p>
      </div>
    </Popup>
  </Marker>;



  const activityMarkers = activities.data ? (activities.data.map(activity =>
    today || week ? 
      today ? isToday(new Date(activity.date)) ? activityMarker(activity) : null : onCurrentWeek(new Date(activity.date)) ? activityMarker(activity) : null
    : activityMarker(activity)
  )) : null;

  if(events.data) {
    events.data.forEach(event => {
      event.skills.forEach(skill => {
        if(skill.paid) {
          event.hasPaid = 1
        }
      })
    })
  }
  



  const eventMarkersFree = events.data ? (events.data.map(event =>
    !event.hasPaid ? <Marker key={event.id} position={[event.lat, event.lng]} icon={workIcon}>
      <Popup className="popup" minWidth="280">
        <h2><Link to={"/events/" + event.id}>{event.name}</Link></h2>
        <div className="data-container">
          <img src={datum}/>
          <p>{event.date}</p>
        </div>
        <div className="data-container">
          <img src={location}/>
          <p>{event.location}</p>
        </div>
    
      </Popup>
    </Marker> : null
  )) : null;

  const eventMarkersPaid = events.data ? (events.data.map(event =>
    event.hasPaid ? <Marker key={event.id} position={[event.lat, event.lng]} icon={workIcon}>
      <Popup className="popup" minWidth="280">
        <h2><Link to={"/events/" + event.id}>{event.name}</Link></h2>
        <div className="data-container">
          <img src={datum}/>
          <p>{event.date}</p>
        </div>
        <div className="data-container">
          <img src={location}/>
          <p>{event.location}</p>
        </div>
    
      </Popup>
    </Marker> : null
  )) : null;



  function all() {
    setA(true);
    setB(true);
    setC(true);
    setD(true);
  }

  function business() {
    setA(a ? false : true);
  }
  
  function service() {
    setB(b ? false : true);
  }

  function event() {
    setC(c ? false : true);
  }

  function work() {
    setD(d ? false : true);
  }

  function workPaid() {
    setE(e ? false : true);
  }

  function clickDay() {
    setWeek(false);
    setToday(today ? false : true);
  } 

  function clickWeek() {
    setToday(false);
    setWeek(week ? false : true);
  }

  return (
    <div className="map-container">
      <Nav/>
      <div className="container">
        <div className="filters">
          <div className="time">
            <div className={today && "on"} onClick={() => clickDay()}>Vandaag</div>
            <div className={week && "on"} onClick={() => clickWeek()}>Deze week</div>
          </div>
          
          <h2>Filters</h2>
          <div className="categories">
            <div>
              <img src={evenementen}/>
              <p>Evenementen</p>
            </div>
            <img onClick={() => {event()}} className="switch" src={c ? active : nonactive}/>
          </div>
          <div className="categories">
            <div>
              <img src={get}/>
              <p>Handelaars</p>
            </div>
            <img onClick={() => {business()}} className="switch" src={a ? active: nonactive}/>
          </div>
          <div className="categories">
            <div>
              <img src={diensten}/>
              <p>Diensten</p>
            </div>
            <img onClick={() => {service()}} className="switch" src={b ? active : nonactive}/>
          </div>
          <div className="categories">
            <div>
              <img src={free}/>
              <p>Vrijwillig werk</p>
            </div>
            <img onClick={() => {work()}} className="switch" src={d ? active : nonactive}/>
          </div>
          <div className="categories">
            <div>
              <img src={credit}/>
              <p>Credit werk</p>
            </div>
            <img onClick={() => {workPaid()}} className="switch" src={e ? active : nonactive}/>
          </div>
        

        </div>
        <Map className="map" center={position} zoom={13}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          { a ? businessMarkers : null}
          { b ? serviceMarkers : null}
          { c ? activityMarkers : null}
          { d ? eventMarkersFree : null}
          { e ? eventMarkersPaid : null}
        </Map>
      </div>
    </div>
  );
}

export default connect(
  null,
  {getBusinesses, getActivities, getAllEvents}
)(See);