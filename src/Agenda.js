import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getAllEvents} from "./redux/actions";

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from '@fullcalendar/interaction';

import nlLocale from '@fullcalendar/core/locales/nl';
import {useSelector} from "react-redux";
import Nav from './Nav';
import { Link, useParams } from 'react-router-dom';
import datum from './img/nav/agenda.png';
import location from './img/nav/see.png';

import regie from './img/icons/regie.png';
import montage from './img/icons/montage.png';
import mode from './img/icons/mode.png';
import dans from './img/icons/dans.png';
import camera from './img/icons/camera.png';
import administratie from './img/icons/administratie.png';
import organisatie from './img/icons/organisatie.png';
import werkkracht from './img/icons/werkkracht.png';
import decor from './img/icons/decor.png';
import kostuum from './img/icons/kostuum.png';
import muzikant from './img/icons/muzikant.png';
import agendaplanning from './img/icons/agendaplanning.png';
import dj from './img/icons/dj.png';
import animatie from './img/icons/animatie.png';
import tolk from './img/icons/tolk.png';
import presentatie from './img/icons/presentatie.png';
import socialmedia from './img/icons/socialmedia.png';
import acrobatie from './img/icons/acrobatie.png';
import acteur from './img/icons/acteur.png';
import vakman from './img/icons/vakman.png';
import geluidstechnieker from './img/icons/geluidstechnieker.png';
import conceptbedenker from './img/icons/conceptbedenker.png';
import yoga from './img/icons/yoga.png';
import projectleider from './img/icons/projectleider.png';
import horeca from './img/icons/horeca.png';
import schilderkunst from './img/icons/schilderkunst.png';

import './css/Agenda.scss';

export const Agenda = ({getAllEvents}) => {

  const { id } = useParams();

  const [enabled, setEnabled] = useState(0);
  const [event, setEvent] = useState(null);

  const [enabledEvents, setEnabledEvents] = useState(0);
  const [dateClicked, setDateClicked] = useState(null);
  const [dateEvents, setDateEvents] = useState([]);

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    getAllEvents();
  }, []);

  const events = useSelector(state => state.remoteAllEvents);
  const fcEvents = events.data ? events.data.map((event, index) => {
    return {id: event.id, title: event.name, date: event.date}
  }) : null

  if(id && events.data && !event) {
    setEnabled(1);
    let tempEvent = events.data.find(event => event.id === parseInt(id));
    tempEvent.startStr = tempEvent.date
    tempEvent.title = tempEvent.name
    setEvent(tempEvent);
  }

  function findSkillIcon(name) {
    switch(name) {
      case "regie": return regie;
      break;
      case "montage": return montage;
      break;
      case "mode": return mode;
      break;
      case "dans": return dans;
      break;
      case "camera": return camera;
      break;
      case "administratie": return administratie;
      break;
      case "organisatie": return organisatie;
      break;
      case "werkkracht": return werkkracht;
      break;
      case "decor": return decor;
      break;
      case "kostuum": return kostuum;
      break;
      case "muzikant": return muzikant;
      break;
      case "agendaplanning": return agendaplanning;
      break;
      case "dj": return dj;
      break;
      case "animatie": return animatie;
      break;
      case "tolk": return tolk;
      break;
      case "presentatie": return presentatie;
      break;
      case "socialmedia": return socialmedia;
      break;
      case "schilderkunst": return schilderkunst;
      break;
      case "acrobatie": return acrobatie;
      break;
      case "acteur": return acteur;
      break;
      case "vakman": return vakman;
      break;
      case "geluidstechnieker": return geluidstechnieker;
      break;
      case "conceptbedenker": return conceptbedenker;
      break;
      case "yoga": return yoga;
      break;
      case "projectleider": return projectleider;
      break;
      case "horeca": return horeca;
      break;
    }
  }

  function date(date) {
    const jsDate = new Date(date);
    return jsDate.getDate()+'-'+(jsDate.getMonth()+1)+'-'+jsDate.getFullYear();
  }

  function Popup(props) {

    function findEvent(eventId) {
      return events.data.find(event => event.id === parseInt(eventId));
    }

    function attendance(id) {
      let display = [];

      findEvent(id).skills.forEach(skill => {
        skill.users.forEach(user => {
            if(loggedUser && user.id === loggedUser.id) {
              display.push(<p className='attendance' key={skill.skill.name + "zin1"}>Je hebt je ingeschreven voor <img src={findSkillIcon(skill.skill.icon)}/> {skill.skill.name} voor {skill.hours} uur.</p>);    
              if(user.accepted === 1) {
                display.push(<p className='attendance' key={skill.skill.name + "zin2"}>Je bent goedgekeurd voor <img src={findSkillIcon(skill.skill.icon)}/> {skill.skill.name} door de project leider.</p>);
              }
            }
            
        })
      })
      return display;
    }

    return (
      <div className="agenda-popup">
        {event ?
          <div>
            <div className='top-agenda-popup'>
              <div>
                <img src={ require('./img/project/' + findEvent(event.id).project.picture) }/>
                <Link to={"/events/" + event.id}>{findEvent(event.id).project.name} - {event.title}</Link>
              </div>
              <span className="close" onClick={e => setEnabled(0)}>x</span>
            </div>
            
            <div className="flex-popup">
              <img src={datum}/>
              <p>{date(event.startStr)}</p>
            </div>
            <div className="flex-popup">
              <img src={location}/>
              <p>{findEvent(event.id).location}</p>
            </div>
            {
              attendance(event.id)
            }
          </div>
        : null}
      </div>
    );
  }

  function EventsPopup(props) {
    return (
      <div className="agenda-popup">
        <div className='top-agenda-popup'>
          <p>{date(dateClicked)}</p>
          <span className="close" onClick={e => setEnabledEvents(0)}>x</span>
        </div>
        
        {dateEvents.map(event =>
          <div className='events-list' key={event.id}>
            <div>
              <img src={ require('./img/project/' + event.project.picture) }/>
              <p>{event.project.name} - {event.name}</p>
            </div>

            <Link to={"/events/" + event.id}><span>Naar event</span></Link>
          </div>
        )}
      </div>
    );
  }

  const handleEventClick = ({ event, el }) => {
    setEnabled(1);
    setEvent(event);
  };
  
  const handleDateClick = (args) => {
    let filteredEvents = events.data.filter(event => date(event.date) === date(args.dateStr));
    if(filteredEvents.length > 0) {
      setDateEvents(filteredEvents);
      setDateClicked(args.dateStr);
      setEnabledEvents(1);
    }
    
  };

  return (
    <div className="agenda">
      <Nav/>
      <div className="agenda-container">
        <FullCalendar
          plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
          initialView="dayGridMonth"
          events={fcEvents}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          height="parent"
          initialDate={events.data && id ? events.data.find(event => event.id === parseInt(id)).date : null}
          locale={nlLocale}
          headerToolbar={{
            left: 'prev title next',
            center: '',
            right: 'today dayGridMonth,timeGridWeek,timeGridDay'
          }}
        />
      </div>
      {enabled ? <Popup event={event}/> : null}
      {enabledEvents ? <EventsPopup event={dateEvents}/> : null}
    </div>
  );
}

export default connect(
  null,
  {getAllEvents}
)(Agenda);

