import React from 'react';
import { useParams } from 'react-router-dom';
import Nav from './Nav';
import Axios from 'axios';
import EventShowComp from "./components/EventShow";

import './css/EventShow.scss';

function EventShow(props) {

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const { id } = useParams();
  const event = props.events.data.find(event => event.id === parseInt(id));

  const likeEvent = (eventId) => {
    if(loggedUser) {
      Axios.post('/like-event', {
        'event': eventId,
        'user': loggedUser.id
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
      })
      .then((response) => {
        props.reloadEvents();
   
      })
      .catch((error) => {
    
      })
    }
    
  }

  return (
    <div className="height100">
        <Nav/>
        {event ? <EventShowComp event={event} likeEvent={likeEvent} isPage={true}/> : null}
    </div>
  );
}

export default EventShow;