import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {getActivities, getBusinesses, getAllEvents} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link } from 'react-router-dom';
import Geocode from "react-geocode";
import axios from "axios";
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import Nav from "./Nav";

import './css/See.scss';
import see from './img/nav/see.png';
import datum from './img/nav/agenda.png';
import evenementen from './img/profile/badges.png';
import get from './img/nav/get.png';
import diensten from './img/map/diensten.png';
import work from './img/nav/work.png';
import free from './img/profile/free.png';
import credit from './img/profile/credit.png';
import active from './img/map/filter-active.png';
import nonactive from './img/map/filter-nonactive.png';
import mapFilter from './img/map/map-filter.png';
import close from './img/map/close.png';
import add from './img/eventshow/add.png';
import decline from './img/eventshow/decline.png';

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

  // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
  Geocode.setApiKey("AIzaSyB3hu-a1Gnzog5zG63fnQ8ZaMLghPGUPwI");

  // set response language. Defaults to english.
  Geocode.setLanguage("en");

  // set response region. Its optional.
  // A Geocoding request with region=es (Spain) will return the Spanish city.
  Geocode.setRegion("es");

  const [a, setA] = useState(true);
  const [b, setB] = useState(true);
  const [c, setC] = useState(true);
  const [d, setD] = useState(true);
  const [e, setE] = useState(true);

  const [displayMap, setDisplayMap] = useState(true);
  const [displayAddActivity, setDisplayAddActivity] = useState(false);

  const [activityLocation, setActivityLocation] = useState("");
  const [name, setName] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const [today, setToday] = useState(false);
  const [week, setWeek] = useState(false);
  const [date, setDate] = useState(new Date());

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
          <img src={see}/>
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
          <img src={see}/>
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
        <img src={see}/>
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
          <img src={see}/>
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
          <img src={see}/>
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

  function showFilters() {
    document.querySelector(".filters").style.display = "block";
    document.querySelector(".map-filter").style.display = "none";
    document.querySelector(".map").style.display = "none";
  }

  function showMap() {
    document.querySelector(".filters").style.display = "none";
    document.querySelector(".map-filter").style.display = "block";
    document.querySelector(".map").style.display = "block";
  }

  function switchToActivity() {
    setDisplayMap(false);
    setDisplayAddActivity(true);
  }

  function switchToMap() {
    setDisplayMap(true);
    setDisplayAddActivity(false);
  }

  function searchAddress(address) {
    Geocode.fromAddress(address).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setLat(lat);
        setLng(lng);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  function sendActivity() {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("token")
    }
    axios.post('/activities', {
        date: date,
        name: name,
        location: activityLocation,
        lat: lat,
        lng: lng
    }, { headers: headers }).then((response) => {
      getActivities();
      setDisplayMap(true);
      setDisplayAddActivity(false);
    }).catch((error) => {})
  }

  return (
    <div className="map-container">
      <Nav/>
      <div className="container">
        <div className="add-activity" onClick={e => displayMap ? switchToActivity() : switchToMap()}>{displayMap ? "Activiteit toevoegen" : "Annuleren" }<img src={displayMap ? add : decline}/></div>
        <img onClick={() => {showFilters()}} className="map-filter" src={mapFilter}/>
        {
          displayMap ? <div className="filters">
            <img onClick={() => {showMap()}} className="close" src={close}/>
            <div className="time">
              <div className={today ? "on" : ""} onClick={() => clickDay()}>Vandaag</div>
              <div className={week ? "on" : ""} onClick={() => clickWeek()}>Deze week</div>
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
          </div> : null
        }
        {
          displayMap ? <Map className="map" center={position} zoom={13}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            { a ? businessMarkers : null}
            { b ? serviceMarkers : null}
            { c ? activityMarkers : null}
            { d ? eventMarkersFree : null}
            { e ? eventMarkersPaid : null}
          </Map> : null
        }
        {
          displayAddActivity ? <div className="add-activity-panel">
            <div>
              <label>Locatie:</label>
              <input onChange={e => setActivityLocation(e.target.value)} placeholder='Locatie'/>
              <button onClick={e => searchAddress(activityLocation)}>Zoeken</button>
              <Map className="map-activity" center={[lat, lng]} zoom={18}>
                <TileLayer
                  attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </Map>
              <label>Naam:</label>
              <input onChange={e => setName(e.target.value)} placeholder='Naam'/>
              <label>Datum:</label>
              <input className="date" type="date" onChange={e => setDate(e.target.value)}/>
              <div className="submit" onClick={e => sendActivity()}>Activiteit toevoegen<img src={add}/></div>
            </div>
          </div> : null
        }
        
        
      </div>
    </div>
  );
}

export default connect(
  null,
  {getBusinesses, getActivities, getAllEvents}
)(See);