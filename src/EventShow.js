import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getAllEvents, getSkills} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link, useParams } from 'react-router-dom';
import Nav from './Nav';
import datum from './img/nav-agenda.png';
import location from './img/nav-see.png';
import navGet from './img/nav-get.png';
import profiel from './img/nav-profiel.png';
import work from './img/nav-work.png';
import navNetwork from './img/nav-netwerk.png';

import regie from './img/Regie.png';
import montage from './img/Montage.png';
import mode from './img/Mode.png';
import dans from './img/Dans.png';
import camera from './img/Camera.png';

import agenda from './img/nav/agenda.png';
import time from './img/eventshow/time.png';
import see from './img/nav/see.png';
import get from './img/nav/get.png';
import team from './img/profile/team.png';
import leader from './img/profile/leader.png';

import desc from './img/profile/desc.png';
import free from './img/profile/free.png';
import skill from './img/profile/skill.png';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChess, faAddressCard, faBeer, faBalanceScale, faMugHot, faBurn, faAnchor, faBlind, faBowlingBall, 
    faRadiation, faBandAid, faBath, faBed, faBible, faBlender, faBong, faBox } from '@fortawesome/free-solid-svg-icons';

import './css/EventShow.scss';
import Axios from 'axios';


export const EventShow = ({getAllEvents, getSkills}) => {

    useEffect(() => {
      getAllEvents();
      getSkills();
    }, []);
    

    const events = useSelector(state => state.remoteAllEvents);
    const skills = useSelector(state => state.remoteSkills);

    const { id } = useParams();
    const event = events.data ? events.data.find(event => event.id === parseInt(id)) : null;

    function date(date) {
      const jsDate = new Date(date);
      return jsDate.getDate()+'-'+(jsDate.getMonth()+1)+'-'+jsDate.getFullYear();
    }

    function register(eventSkillId) {
      Axios.post('/subscribe-skill', {
        'eventSkillId': eventSkillId,
        'userId': JSON.parse(localStorage.getItem("user")).id
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
      })
      .then((response) => {
        window.location.href = '/events/' + event.id;
      })
      .catch((error) => {
    
      })
    }

    const paidSkill = event && event.skills ? event.skills.map(skill => 
      skill.paid === 1 ? <div className="skills" key={skill.id}>
        <div className="image"><img src={agenda}/></div>
        <p>{skill.amount} x {skill.skill.name} - {skill.hours}u</p>
        <div className="button">
          <button onClick={e => register(skill.id)}>Inschrijven</button>
        </div>
      </div> : null
    ) : null;

    const freeSkill = event && event.skills ? event.skills.map(skill => 
      skill.paid === 0 ? <div className="skills" key={skill.id}>
        <div className="image"><img src={agenda}/></div>
        <p>{skill.amount} x {skill.skill.name} - {skill.hours}u</p>
        <div className="button">
          <button onClick={e => register(skill.id)}>Inschrijven</button>
        </div>
      </div> : null
    ) : null;

    return (
      <div className="height100">
          <Nav/>
          {event ?
            <div className='event-panel'>
              <h2 className="event-title"><span>{event.project.name + ' - ' + event.name}</span></h2>
              <div className="container">
                <div className="left">
                  <div>
                    <img src={agenda}/>
                    <p>{date(event.date)}</p>
                  </div>
                  <div>
                    <img src={time}/>
                    <p>{new Date(event.date).toLocaleTimeString()}</p>
                  </div>
                  <div>
                    <img src={see}/>
                    <p><Link to={"/see"}>{event.location}</Link></p>
                  </div>
                  <div>
                    <img src={get}/>
                    <h2>Totaal budget</h2>
                  </div>
                  <div>
                    <img src={team}/>
                    <h2>Team</h2>
                  </div>
                  <div>
                    <img src={leader}/>
                    <h2>Projectleider</h2>
                    <p>{event.project.leader.name}</p>
                  </div>
                </div>
                <div className="right">
                  <h2><img src={desc} alt=""/>Projectbeschrijving</h2>
                  <p className="desc">{event.project.description}</p>
                  <h2><img src={free} alt=""/>Vrijwilliger uren</h2>
                  {freeSkill}
                  <h2><img src={skill} alt=""/>Skill uren</h2>
                  {paidSkill}
                </div>
              </div>
            </div>
            :
            null
          }
      </div>
    );
}

export default connect(
    null,
    {getAllEvents, getSkills}
  )(EventShow);