import React, {useEffect} from 'react';
import {connect} from "react-redux";
import {getEvents} from "./redux/actions";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import {useSelector} from "react-redux";
import Nav from './Nav';

export const Agenda = ({getEvents}) => {

  useEffect(() => {
    getEvents();
  }, []);

  const events = useSelector(state => state.remoteEvents);
  const fcEvents = events.map((event) => {
    return {title: event.name, date: event.date}
  })
  return (
    <div>
      <Nav/>
      <FullCalendar
      plugins={[ dayGridPlugin ]}
      initialView="dayGridMonth"
      events={fcEvents}
    />
    </div>
   
  );
}


export default connect(
  null,
  {getEvents}
)(Agenda);