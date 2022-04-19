import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getAllEvents} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link, useParams } from 'react-router-dom';
import { skillIcon } from './Global';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from '@fullcalendar/interaction';
import nlLocale from '@fullcalendar/core/locales/nl';

import Nav from './Nav';
import datum from './img/nav/agenda.png';
import location from './img/nav/see.png';

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


  if(events.data) {
    events.data.forEach(event => {
      event.skills.forEach(skill => {
        skill.users.forEach(user => {
          if(user.id === loggedUser.id) {
            event.worked = true
          }
        })
      })
    })
  }

  const fcEvents = events.data ? events.data.map((event, index) => {
    return {id: event.id, title: event.name, date: event.date, extendedProps: {
      worked: event.worked,
      time: event.time

    }}
  }) : null

  if(id && events.data && !event) {
    setEnabled(1);
    let tempEvent = events.data.find(event => event.id === parseInt(id));
    tempEvent.startStr = tempEvent.date
    tempEvent.title = tempEvent.name
    setEvent(tempEvent);
  }

  function date(date) {
    const jsDate = new Date(date);
    return '<span class="dategreen">'+jsDate.toLocaleString('nl-be', {  weekday: 'long' })+'</span>'+' '+jsDate.toLocaleString('nl-be', { month: 'short' })+' '+jsDate.getDate()+', '+jsDate.getFullYear();
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
              display.push(<p className='attendance' key={skill.skill.name + "zin1"}>Je hebt je ingeschreven voor <img src={skillIcon(skill.skill.icon)}/> {skill.skill.name} voor {skill.hours} uur.</p>);    
              if(user.accepted === 1) {
                display.push(<p className='attendance' key={skill.skill.name + "zin2"}>Je bent goedgekeurd voor <img src={skillIcon(skill.skill.icon)}/> {skill.skill.name} door de project leider.</p>);
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
              <p dangerouslySetInnerHTML={{__html: date(event.startStr)}}></p>
            </div>
            <div className="flex-popup">
              <img src={location}/>
              <p>{findEvent(event.id).location}</p>
            </div>
            {
              attendance(event.id)
            }
            <Link to={"/events/" + event.id}><span>Naar event</span></Link>
          </div>
        : null}
      </div>
    );
  }

  function EventsPopup(props) {
    return (
      <div className="agenda-popup">
        <div className='top-agenda-popup'>
          <p dangerouslySetInnerHTML={{__html: date(dateClicked)}}></p>
          <span className="close" onClick={e => setEnabledEvents(0)}>x</span>
        </div>
        
        {dateEvents.map(event =>
          <div className='events-list' key={event.id}>
            <div className='events-list-flex'>
              <img src={ require('./img/project/' + event.project.picture) }/>
              <div>
                <p className={event.worked ? "title worked" : "title"}>{event.project.name + " - " + event.name}</p>
                <p>{event.time}</p>
              </div>
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

  function renderEventContent(eventInfo) {

    return (
      <>
        <span className={eventInfo.event.extendedProps.worked ? "worked" : ""}></span>
        <b>{eventInfo.event.extendedProps.time} </b>
        <i> {eventInfo.event.title}</i>
      </>
    )
  }

  
 

  return (
    <div className="agenda">
      <Nav/>
      <div className="agenda-container">
        <FullCalendar
          className="calendar"
          plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
          initialView="dayGridMonth"
          events={fcEvents}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          eventContent={renderEventContent}
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
      <div className='legend'>
        <span className="default"></span><b>Default</b><span className="worked"></span><b>Ingeschreven als werkkracht</b>
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

