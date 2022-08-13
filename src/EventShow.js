import React from 'react';
import { useParams } from 'react-router-dom';
import Nav from './Nav';
import Axios from 'axios';
import EventShowComp from "./components/EventShow";

import './css/EventShow.scss';

function EventShow(props) {

  const { id } = useParams();
  const event = props.events.data ? props.events.data.find(event => event.id === parseInt(id)) : null;

  const likeEvent = (eventId) => {
    Axios.post('/like-event', {
      'event': eventId,
      'user': JSON.parse(localStorage.getItem("user")).id
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      }
    })
    .then((response) => {
      //getAllEvents();
 
    })
    .catch((error) => {
  
    })
  }

  return (
    <div className="height100">
        <Nav/>
        {event ? <EventShowComp event={event} likeEvent={likeEvent} isPage={true}/> : null}
    </div>
  );
}

export default EventShow;