import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getAllEvents} from "./redux/actions";
import {useSelector} from "react-redux";
import { useParams } from 'react-router-dom';
import Nav from './Nav';
import Axios from 'axios';
import EventShowComp from "./components/EventShow";

import './css/EventShow.scss';

export const EventShow = ({getAllEvents}) => {

  useEffect(() => {
    getAllEvents();
  }, []);

  const events = useSelector(state => state.remoteAllEvents);

  const [liked, setLiked] = useState(false);

  const { id } = useParams();
  const event = events.data ? events.data.find(event => event.id === parseInt(id)) : null;

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
      getAllEvents();
 
    })
    .catch((error) => {
  
    })
  }

  return (
    <div className="height100">
        <Nav/>
        {event ? <EventShowComp event={event} likeEvent={likeEvent} liked={liked}/> : null}
    </div>
  );
}

export default connect(
  null,
  {getAllEvents}
)(EventShow);