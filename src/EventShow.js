import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getAllEvents} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link, useParams } from 'react-router-dom';
import Nav from './Nav';

export const EventShow = ({getAllEvents}) => {

    useEffect(() => {
      getAllEvents();
    }, []);

    const events = useSelector(state => state.remoteAllEvents);

    const { id } = useParams();
    const event = events.data ? events.data.find(event => event.id === parseInt(id)) : null;

    if(event) {
      let hours = 0;
        event.users.forEach(user => {
          hours += parseInt(user.hours);
        })
        event.free = event.credits - hours;
    }

    console.log(event);


    function date(date) {
      const jsDate = new Date(date);
      return jsDate.getDate()+'-'+(jsDate.getMonth()+1)+'-'+jsDate.getFullYear();
    }

    return (
      <div className="event-details">
          <Nav/>
          <h2>Event details</h2>

          {event ? 
            <div className='event-panel'>
              <p className="mb-70"><span className="bold">Project:</span> {event.project.name}</p>
              <div className="event-headers">
                <p>Naam</p>
                <p>Locatie</p>
                <p>Datum</p>
                <p>Tijdstip</p>
                <p>Skill</p>
              </div>
              <div className="event">
                  <p>{event.name}</p>
                  <p>{event.location}</p>
                  <p>{date(event.date)}</p>
                  <p>{new Date(event.date).toLocaleTimeString()}</p>
                  <p>{event.skill}</p>
              </div>
              <List event={event}/> 
            </div>
            :
            null
          }
    
      </div>
    );
}


function List({ event }) {

  function Free({free}) {
    if (free == 0) {
      return (
        <div className="free"><p>Project volzet</p></div>
      );
    }
    return (
      <div className="free"><p>{event.free} vrije uren</p></div>
    );
  }

  if (event.credits == 0) {
    return null;
  }
 
  return (
    <div className="event-details mt-70">
      <div>
        <h3>Participanten</h3>
        {                             
          event.users.map((user, index) =>
            (user.accepted ? <div className="flex-space-between" key={String(user.id) + String(index)}>
              <p>{user.name}</p>
              <p>{user.hours} ingeschreven uren</p>
            </div> : null)            
          )
        }
      </div>
      <div>
        <Free free={event.free}/>
        <div><p>Dit werk event heeft {event.credits} werkuren in totaal.</p></div>
      </div>                     
    </div>
  );
}

export default connect(
    null,
    {getAllEvents}
  )(EventShow);