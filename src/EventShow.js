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

import agenda from './img/nav/agenda.png';
import time from './img/eventshow/time.png';
import see from './img/nav/see.png';
import get from './img/nav/get.png';
import team from './img/profile/team.png';
import leader from './img/profile/leader.png';

import desc from './img/profile/desc.png';
import free from './img/profile/free.png';
import skill from './img/profile/skill.png';

import accept from './img/eventshow/accept.png';
import decline from './img/eventshow/decline.png';

import regie from './img/icons/regie.png';
import montage from './img/icons/montage.png';
import mode from './img/icons/mode.png';
import dans from './img/icons/dans.png';
import camera from './img/icons/camera.png';
import administratie from './img/icons/administratie.png';
import organisatie from './img/icons/organisatie.png';
import werkkracht from './img/icons/werkkracht.png';
import decor from './img/icons/decor.png';
import kostuum from './img/icons/kostuum.png';
import muzikant from './img/icons/muzikant.png';
import agendaplanning from './img/icons/agendaplanning.png';
import dj from './img/icons/dj.png';
import animatie from './img/icons/animatie.png';
import tolk from './img/icons/tolk.png';
import presentatie from './img/icons/presentatie.png';
import socialmedia from './img/icons/socialmedia.png';
import acrobatie from './img/icons/acrobatie.png';
import acteur from './img/icons/acteur.png';
import vakman from './img/icons/vakman.png';
import geluidstechnieker from './img/icons/geluidstechnieker.png';
import conceptbedenker from './img/icons/conceptbedenker.png';
import yoga from './img/icons/yoga.png';
import projectleider from './img/icons/projectleider.png';
import horeca from './img/icons/horeca.png';
import schilderkunst from './img/icons/schilderkunst.png';


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

    const [areYouSure, setAreYouSure] = useState(1);
    const [chosenSkill, setChosenSkill] = useState(null);

    const events = useSelector(state => state.remoteAllEvents);
    const skills = useSelector(state => state.remoteSkills);

    const { id } = useParams();
    const event = events.data ? events.data.find(event => event.id === parseInt(id)) : null;

    function date(date) {
      const jsDate = new Date(date);
      return jsDate.getDate()+'-'+(jsDate.getMonth()+1)+'-'+jsDate.getFullYear();
    }

    function findIcon(name) {
      switch(name) {
        case "regie": return regie;
        break;
        case "montage": return montage;
        break;
        case "mode": return mode;
        break;
        case "dans": return dans;
        break;
        case "camera": return camera;
        break;
        case "administratie": return administratie;
        break;
        case "organisatie": return organisatie;
        break;
        case "werkkracht": return werkkracht;
        break;
        case "decor": return decor;
        break;
        case "kostuum": return kostuum;
        break;
        case "muzikant": return muzikant;
        break;
        case "agendaplanning": return agendaplanning;
        break;
        case "dj": return dj;
        break;
        case "animatie": return animatie;
        break;
        case "tolk": return tolk;
        break;
        case "presentatie": return presentatie;
        break;
        case "socialmedia": return socialmedia;
        break;
        case "schilderkunst": return schilderkunst;
        break;
        case "acrobatie": return acrobatie;
        break;
        case "acteur": return acteur;
        break;
        case "vakman": return vakman;
        break;
        case "geluidstechnieker": return geluidstechnieker;
        break;
        case "conceptbedenker": return conceptbedenker;
        break;
        case "yoga": return yoga;
        break;
        case "projectleider": return projectleider;
        break;
        case "horeca": return horeca;
        break;
      }
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

    function areYouSureBox(skill) {
      setAreYouSure(1);
      setChosenSkill(skill);
    }

    const paidSkill = event && event.skills ? event.skills.map(skill => 
      skill.paid === 1 ? <div className="skills" key={skill.id}>
        <div className="image"><img src={findIcon(skill.skill.icon)}/></div>
        <p>{skill.amount} x {skill.skill.name} - {skill.hours}u</p>
        <div className="button">
          <button onClick={e => areYouSureBox(skill)}>Inschrijven</button>
        </div>
      </div> : null
    ) : null;

    const freeSkill = event && event.skills ? event.skills.map(skill => 
      skill.paid === 0 ? <div className="skills" key={skill.id}>
        <div className="image"><img src={findIcon(skill.skill.icon)}/></div>
        <p>{skill.amount} x {skill.skill.name} - {skill.hours}u</p>
        <div className="button">
          <button onClick={e => areYouSureBox(skill)}>Inschrijven</button>
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
                    <Link to={"/agenda/" + event.id}>
                      <img src={agenda}/>
                      <p>{date(event.date)}</p>
                    </Link>
                  </div>
                  <div>
                    <img src={time}/>
                    <p>{new Date(event.date).toLocaleTimeString()}</p>
                  </div>
                  <div>
                    <Link to={"/see"}>
                      <img src={see}/>
                      <p>{event.location}</p>
                    </Link>
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
              {
              areYouSure && chosenSkill ? <div className="are-you-sure">
                <p>Weet je zeker dat je je voor {chosenSkill.hours} uur in <img src={findIcon(chosenSkill.skill.icon)}/>{chosenSkill.skill.name} wilt inschrijven?</p>
                <img className="accept" src={accept} onClick={e => register(chosenSkill.id)}/>
                <img className="accept" src={decline} onClick={e => setAreYouSure(0)}/>
              </div> : null
              }
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