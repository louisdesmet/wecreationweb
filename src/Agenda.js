import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getEvents} from "./redux/actions";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import {useSelector} from "react-redux";
import Nav from './Nav';
import { Link } from 'react-router-dom';
import datum from './img/nav-agenda.png';
import location from './img/nav-see.png';
import './css/Agenda.scss';

export const Agenda = ({getEvents}) => {

  const [enabled, setEnabled] = useState(0);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    /*getEvents();*/
  }, []);

  /*const events = useSelector(state => state.remoteEvents);*/
  /*const fcEvents = events.map((event, index) => {
    return {id: index, title: event.name, date: event.date}
  })*/

  function Popup(props) {

    function findEvent(id) {
      /*return events[parseInt(id)];*/
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
            {/*events ? 
              <div>
                <div className="flex">
                  <img src={location}/>
                  <p>{findEvent(event.id).location}</p>
                </div>
                <p>Je hebt je ingeschreven voor {findEvent(event.id).pivot.hours} uur.</p>
                <p>{findEvent(event.id).pivot.accepted ? 'Je bent geaccepteerd door de project leider.' : null}</p>
                <p>{findEvent(event.id).pivot.present ? 'De project leider gaf aan dat je aanwezig was.' : null}</p>
              </div>
            : null*/}
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
        /*events={fcEvents}*/
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
  {getEvents}
)(Agenda);

