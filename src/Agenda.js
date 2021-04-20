import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getEvents} from "./redux/actions";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import {useSelector} from "react-redux";
import Nav from './Nav';

export const Agenda = ({getEvents}) => {

  const [enabled, setEnabled] = useState(0);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    getEvents();
  }, []);

  const events = useSelector(state => state.remoteEvents);
  const fcEvents = events.map((event) => {
    return {id: event.id, title: event.name, date: event.date}
  })

  function Popup(props) {

    function findEvent(id) {
      return events.find(ev => ev.id === parseInt(id))
    }

    return (
      <div className="popup">
        <span className="close" onClick={e => setEnabled(0)}>x</span>
      {event ? 
        <div>
          <p>{event.title }</p>
          <p>{new Date(event.startStr).toJSON().slice(0, 19).replace('T', ' ')}</p>
          {events ? 
            <p>{findEvent(event.id).location}</p>
          : null}

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
    <div>
      <Nav/>
      <FullCalendar
      plugins={[ dayGridPlugin ]}
      initialView="dayGridMonth"
      events={fcEvents}
      eventClick={handleEventClick}
      />
      {enabled ? <Popup event={event}/> : null}
    </div>
  );
}

export default connect(
  null,
  {getEvents}
)(Agenda);

