import React from "react";
import { Link } from "react-router-dom";
import { date } from "../Global";
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';

import see from '../img/nav/see.png';
import agenda from '../img/nav/agenda.png';
import time from '../img/eventshow/time.png';
import evenementen from '../img/profile/badges.png';
import like from '../img/eventshow/like.png';

let evenementenIcon = L.icon({
  iconUrl: evenementen,
  iconSize: [30, 30],
  popupAnchor: [0, -20],
});

function ActivityShow(props) {

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  /*props.event.skills.forEach(skill => {
    skill.users.forEach(user => {
      if(user.id === loggedUser.id) {
        props.event.allowedInGroupchat = true;
      }
    })
  })*/

  let position = [props.activity.lat, props.activity.lng];
  
  return (
    <div>    
      <div className='event-panel activity-panel'>
        <div className="top-items">
          <div className="groupchat">
            {
              /*props.event.allowedInGroupchat || props.event.project.leader.id === loggedUser.id ? <p onClick={e => window.location.href = "/netwerk/" + props.event.id}>Groupchat</p> : null*/
            }
          </div>
          {/*<img className="event-logo"  src={(process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/' : 'http://wecreationapi.test/') + "events/" + props.activity.image}/>*/}
          <div className={props.activity.users && props.activity.users.find(user => user.id === loggedUser.id) || props.liked ? "like liked" : "like"} onClick={e => props.activity.users && props.activity.users.find(user => user.id === loggedUser.id) ? null : props.likeActivity(props.activity.id)}>
            <span>{props.liked ? props.activity.users.length + 1 : props.activity.users.length}</span>
            <img src={like}/>
            <p>Interesse!</p>
          </div>
        </div>
        <h2 className="event-title"><span>{props.activity.name}</span></h2>
        <p className="desc">{props.activity.description}</p>
        <div className="container">
          <div className="left">
            <div className="left-item">
              <img src={agenda}/>
              <p>{date(props.activity.date)}</p>
            </div>
            <div className="left-item">
              <img src={time}/>
              <p>{props.activity.time}</p>
            </div>
            <div className="left-item">
              <Link to={"/see"}>
                  <img src={see}/>
                  <p>{props.activity.location}</p>
              </Link>
            </div>
          </div>
        </div>
        <MapContainer className="map" center={position} zoom={15}>
          <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker key={props.activity.id} position={[props.activity.lat, props.activity.lng]} icon={evenementenIcon}></Marker>
        </MapContainer>
      </div>
    </div>
  );
}

export default ActivityShow;