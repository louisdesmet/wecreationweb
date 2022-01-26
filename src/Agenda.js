import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getAllEvents} from "./redux/actions";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import {useSelector} from "react-redux";
import Nav from './Nav';
import { Link } from 'react-router-dom';
import datum from './img/nav-agenda.png';
import location from './img/nav-see.png';
import './css/Agenda.scss';

export const Agenda = ({getAllEvents}) => {

  const [enabled, setEnabled] = useState(0);
  const [event, setEvent] = useState(null);

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    getAllEvents();
  }, []);

  const events = useSelector(state => state.remoteAllEvents);
  const fcEvents = events.data ? events.data.map((event, index) => {
    return {id: index, title: event.name, date: event.date}
  }) : null

  function Popup(props) {

    function findEvent(id) {
      return events.data[parseInt(id)];
    }

    function attendance(id) {
      let display = [];
      findEvent(id).skills.forEach(skill => {
        skill.users.forEach(user => {
            console.log(user.id === loggedUser.id)
            if(user.id === loggedUser.id) {
              display.push(<p>Je hebt je ingeschreven voor {skill.hours} uur.</p>);    
            }
            if(user.accepted === 1) {
              display.push(<p>Je bent goedgekeurd door de project leider.</p>);
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

