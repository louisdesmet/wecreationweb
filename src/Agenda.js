import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getAllEvents} from "./redux/actions";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import {useSelector} from "react-redux";
import Nav from './Nav';
import { Link, useParams } from 'react-router-dom';
import datum from './img/nav-agenda.png';
import location from './img/nav-see.png';
import './css/Agenda.scss';

export const Agenda = ({getAllEvents}) => {

  const { id } = useParams();

  const [enabled, setEnabled] = useState(0);
  const [event, setEvent] = useState(null);

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

  function Popup(props) {

    function findEvent(eventId) {
      return events.data.find(event => event.id === parseInt(eventId));
    }

    function attendance(id) {
      let display = [];

      findEvent(id).skills.forEach(skill => {
        skill.users.forEach(user => {
            if(loggedUser && user.id === loggedUser.id) {
              display.push(<p key={"zin1"}>Je hebt je ingeschreven voor de functie: {skill.skill.name} voor {skill.hours} uur.</p>);    
              if(user.accepted === 1) {
                display.push(<p key={"zin2"}>Je bent goedgekeurd door de project leider.</p>);
              }
            }
            
        })
      })
      return display;
    }

    return (
      <div className="agenda-popup">
        <span className="close" onClick={e => setEnabled(0)}>x</span>
        {event ?
          <div>
            <p><Link to={"/events/" + event.id}>{event.title}</Link></p>
            <div className="flex">
              <img src={datum}/>
              <p>{new Date(event.startStr).toJSON().slice(0, 19).replace('T', ' ')}</p>
            </div>
            <div className="flex">
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

  const handleEventClick = ({ event, el }) => {
    setEnabled(1);
    setEvent(event);
  };

  return (
    <div className="agenda">
      <Nav/>
      <div className="agenda-container">
        <FullCalendar
        plugins={[ dayGridPlugin ]}
        initialView="dayGridMonth"
        events={fcEvents}
        eventClick={handleEventClick}
        height="parent"
        initialDate={events.data && id ? events.data.find(event => event.id === parseInt(id)).date : null}
        />
      </div>
      {enabled ? <Popup event={event}/> : null}
    </div>
  );
}

export default connect(
  null,
  {getAllEvents}
)(Agenda);

