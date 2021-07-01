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
import work from './img/nav-work.png';
import get from './img/nav-get.png';
import dienst from './img/Dienst.png';
import netwerk from './img/up-event-purple.png';
let workIcon = L.icon({
  iconUrl: work,
  iconSize: [50, 50],
  popupAnchor: [0, -20],
});
let dienstIcon = L.icon({
  iconUrl: dienst,
  iconSize: [50, 50],
  popupAnchor: [0, -20],
});
let netwerkIcon = L.icon({
  iconUrl: netwerk,
  iconSize: [50, 50],
  popupAnchor: [0, -20],
});
let getIcon = L.icon({
  iconUrl: get,
  iconSize: [50, 50],
  popupAnchor: [0, -20],
});

export const See = ({getBusinesses, getActivities, getAllEvents}) => {

  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const [c, setC] = useState(false);
  const [d, setD] = useState(false);

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
        <h2><Link to={"/businesses/" + business.id}>{business.name}</Link></h2>
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

  const activityMarkers = activities.data ? (activities.data.map(activity =>
    <Marker key={activity.id} position={[activity.lat, activity.lng]} icon={netwerkIcon}>
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
    </Marker>
  )) : null;

  const eventMarkers = events.data ? (events.data.map(event =>
    <Marker key={event.id} position={[event.lat, event.lng]} icon={workIcon}>
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
    </Marker>
  )) : null;

  function all() {
    setA(true);
    setB(true);
    setC(true);
    setD(true);
  }

  function business() {
    setA(true);
    setB(false);
    setC(false);
    setD(false);
  }
  
  function service() {
    setA(false);
    setB(true);
    setC(false);
    setD(false);
  }

  function event() {
    setA(false);
    setB(false);
    setC(true);
    setD(false);
  }

  function work() {
    setA(false);
    setB(false);
    setC(false);
    setD(true);
  }

  return (
    <div className="map-container">
      <Nav/>
      <div className="container">
        <div className="filters">
          <div onClick={() => {all()}}><p className="black">Alles</p></div>
          <div onClick={() => {business()}}><p className="yellow">Handelaars</p></div>
          <div onClick={() => {service()}}><p className="blue">Diensten</p></div>
          <div onClick={() => {event()}}><p className="purple">Evenementen</p></div>
          <div onClick={() => {work()}}><p className="red">Werk</p></div>

        </div>
        <Map className="map" center={position} zoom={13}>
          <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          { a ? businessMarkers : null}
          { b ? serviceMarkers : null}
          { c ? activityMarkers : null}
          { d ? eventMarkers : null}
          
        </Map>
      </div>
    </div>
  );
}

export default connect(
  null,
  {getBusinesses, getActivities, getAllEvents}
)(See);