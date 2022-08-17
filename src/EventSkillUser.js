import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Nav from './Nav';
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';

import './css/EventShow.scss';
import work from './img/nav/work.png';
import see from './img/nav/see.png';
import agenda from './img/nav/agenda.png';
import time from './img/eventshow/time.png';
import leader from './img/profile/leader.png';
import desc from './img/profile/desc.png';
import geelPuzzel from './img/eventshow/geel-puzzel.png';
import { date } from './Global';

let workIcon = L.icon({
    iconUrl: work,
    iconSize: [30, 30],
    popupAnchor: [0, -20],
});


function EventSkillUser(props) {

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const { eventId, skillId } = useParams();
  const event = props.events.data.find(event => event.id === parseInt(eventId));
  const skill = event.skills.find(skill => parseInt(skillId));

  const [showDesc, setShowDesc] = useState(false);

  let position = [event.lat, event.lng];

  return (
    <div className="height100">
        <Nav/>  
        <div className='event-panel'>
            <div className="top-items">
                <img className="event-logo contract"  src={(process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/' : 'http://wecreationapi.test/') + "events/" + event.image}/>
            </div>
            <h2 className="event-title"><span>{event.name}</span></h2>
            
            <div className="container">
                <div className="right">
                    <h2><img src={geelPuzzel} alt=""/>Eventbeschrijving</h2>
                    <p className="desc">{event.description}</p>
                    <h2 onClick={e => setShowDesc(!showDesc)}><img src={desc} alt=""/>{event.project.name}</h2>
                    {
                    showDesc ? <p className="desc">{event.project.description}</p> : null
                    }
                    
                    <h2 className='contract-text'>Je hebt {skill.credits}cc verdiend met {skill.skill.name}</h2>
                    {
                    <MapContainer className="map map-desktop" center={position} zoom={15}>
                        <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OSM</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker key={event.id} position={[event.lat, event.lng]} icon={workIcon}></Marker>
                    </MapContainer>
                    }   
                </div>
                <div className="left">
                    <div className="left-item">
                        <Link to={"/agenda/" + event.id}>
                            <img src={agenda}/>
                            <p>{date(event.date)}</p>
                        </Link>
                    </div>
                    <div className="left-item">
                        <img src={time}/>
                        <p>{event.time}</p>
                    </div>
                    <div className="left-item">
                        <img src={leader}/>
                        <h2>Projectleider</h2>
                        <Link to={"/profiel/" + event.project.leader.id}>{event.project.leader.name}</Link>
                    </div>
                    <div className="left-item">
                        <Link to={"/see"}>
                            <img src={see}/>
                            <p>{event.location}</p>
                        </Link>
                    </div>
                </div>
                <MapContainer className="map map-mobile" center={position} zoom={15}>
                    <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OSM</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker key={event.id} position={[event.lat, event.lng]} icon={workIcon}></Marker>
                </MapContainer>
            </div>
        </div>
    </div>
  );
}

export default EventSkillUser;