import React, {useEffect, useState} from 'react';
import {connect, useSelector} from "react-redux";
import { getProjects } from './redux/actions';
import { Link, useParams } from 'react-router-dom';
import locprod from './Global';
import './css/EventCreate.scss';
import Nav from './Nav';

import work from './img/nav/work.png';
import agenda from './img/nav/agenda.png';
import time from './img/eventshow/time.png';
import see from './img/nav/see.png';
import free from './img/profile/free.png';
import skill from './img/profile/skill.png';

export const EventCreate = ({getProjects}) => {

    useEffect(() => {
      getProjects();
    }, []);

    const [name, setName] = useState("");

    const { id } = useParams();

    const projects = useSelector(state => state.remoteProjects);
    const project = projects.data ? projects.data.find(project => project.id === parseInt(id)) : null;

    /*function submit() {
        fetch(locprod + '/projects/' + project.id, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
          },
          body: JSON.stringify({
            name: name,
            description: description,
            credits: credits,
            leader: leader
          })
        }).then(response => {
          window.location.href = '/admin-projects';
        })
    }*/


    return (
      <div className="height100">
        <Nav/>
        <div className="event-create">
          {
            project ? <h2 className="event-title"><span>{project.name}</span></h2> : null
          }
          <h2><img src={work} alt=""/>Naam</h2>
          <input className='naam' onChange={e => setName(e.target.value)}/>
          <div className='input-image'>
            <img src={agenda} alt=""/>
            <input type="date" onChange={e => setName(e.target.value)}/>
          </div>
          <div className='input-image'>
            <img src={time} alt=""/>
            <input onChange={e => setName(e.target.value)}/>
          </div>
          <div className='input-image'>
            <img src={see} alt=""/>
            <input onChange={e => setName(e.target.value)}/>
          </div>
          <h2><img src={work} alt=""/>Team</h2>
          <h2><img src={free} alt=""/>Vrijwilliger uren</h2>
          
          <h2><img src={skill} alt=""/>Skill uren</h2>
        </div>
      </div>
    );
}

export default connect(
    null,
    {getProjects}
)(EventCreate);