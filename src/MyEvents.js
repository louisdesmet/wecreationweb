import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getAllEvents} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link } from 'react-router-dom';
import Nav from './Nav';

import './css/MyEvents.scss';

import work from './img/nav/work.png';
import agenda from './img/nav/agenda.png';
import time from './img/eventshow/time.png';
import see from './img/nav/see.png';

import edit from './img/eventshow/edit.png';

export const MyEvents = ({getAllEvents}) => {

    useEffect(() => {
      getAllEvents();
    }, []);
    
    const events = useSelector(state => state.remoteAllEvents);

    const futureEvents = events.data ? events.data.filter(event => {
        return JSON.parse(localStorage.getItem("user")).id === event.project.leader.id && new Date(event.date) > new Date();
    }) : null;

    const pastEvents = events.data ? events.data.filter(event => {
        return JSON.parse(localStorage.getItem("user")).id === event.project.leader.id && new Date(event.date) < new Date();
    }) : null;
    
    function date(date) {
        const jsDate = new Date(date);
        return jsDate.getDate()+'-'+(jsDate.getMonth()+1)+'-'+jsDate.getFullYear();
    }

    return (
      <div className="height100">
          <Nav/>
          <div className="event-container">
            <h2><img src={work} alt=""/>Lopende events</h2>
            {
                futureEvents ? futureEvents.map(event =>
                    <div className="event" key={event.id}>
                        <p><img src={work} alt=""/>{event.name}</p>
                        <p><img src={agenda} alt=""/>{date(event.date)}</p>
                        <p><img src={time} alt=""/>{new Date(event.date).toLocaleTimeString()}</p>
                        <p><img src={see} alt=""/>{event.location}</p>
                        <div><Link to={"/event-leader-board/" + event.id}><img src={edit} alt=""/></Link></div>
                    </div>
                ) : null
            }
            <h2><img src={work} alt=""/>Afgelopen events</h2>
            {
                pastEvents ? pastEvents.map(event =>
                    <div className="event" key={event.id}>
                        <p><img src={work} alt=""/>{event.name}</p>
                        <p><img src={agenda} alt=""/>{date(event.date)}</p>
                        <p><img src={time} alt=""/>{new Date(event.date).toLocaleTimeString()}</p>
                        <p><img src={see} alt=""/>{event.location}</p>
                        <div><Link to={"/event-leader-board/" + event.id}><img src={edit} alt=""/></Link></div>
                    </div>
                ) : null
            }
          </div>
      </div>
    );
}

export default connect(
    null,
    {getAllEvents}
  )(MyEvents);