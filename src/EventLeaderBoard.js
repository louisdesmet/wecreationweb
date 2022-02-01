import React, {useEffect} from 'react';
import {connect} from "react-redux";
import {getAllEvents} from "./redux/actions";
import {useSelector} from "react-redux";
import { useParams } from 'react-router-dom';
import Axios from 'axios';

import Nav from './Nav';
import './css/EventLeaderBoard.scss';
import agenda from './img/nav/agenda.png';
import time from './img/eventshow/time.png';
import get from './img/nav/get.png';
import see from './img/nav/see.png';

import work from './img/nav/work.png';
import free from './img/profile/free.png';
import skill from './img/profile/skill.png';

import profile from './img/eventshow/profile-purple.png';
import accept from './img/eventshow/accept.png';
import decline from './img/eventshow/decline.png';
import credits from './img/profile/credits.png';

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

export const EventLeaderBoard = ({getAllEvents}) => {

    useEffect(() => {
      getAllEvents();
    }, []);
    
    const events = useSelector(state => state.remoteAllEvents);

    const { id } = useParams();
    const event = events.data ? events.data.find(event => event.id === parseInt(id)) : null;

    function date(date) {
      const jsDate = new Date(date);
      return jsDate.getDate()+'-'+(jsDate.getMonth()+1)+'-'+jsDate.getFullYear();
    }

    function findSkillIcon(name) {
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

    function acceptUser(eventSkillId, userId) {
      Axios.post('/accept', {
        'eventSkillId': eventSkillId,
        'userId': userId
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
      })
      .then((response) => {
        window.location.href = '/event-leader-board/' + event.id;
      })
      .catch((error) => {
    
      })
    }

    function presentUser(eventSkillId, userId, credits) {
      Axios.post('/present', {
        'eventSkillId': eventSkillId,
        'credits': credits,
        'userId': userId,
        'leader': event.project.leader.id
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
      })
      .then((response) => {
        window.location.href = '/event-leader-board/' + event.id;
      })
      .catch((error) => {
    
      })
    }

    const freeSkill = event && event.skills ? event.skills.map(skill => 
      skill.paid === 0 ? <div key={skill.id}>
        <div className="skills" >
          <div className="skills-inner">
            <div className="image"><img src={findSkillIcon(skill.skill.icon)}/></div>
            <p>{skill.amount} x {skill.skill.name} - {skill.hours}u</p>
          </div>
          {
            skill.users ? skill.users.map(user => 
              <div className="users" key={user.id}>
                <div className="image">
                  <img src={profile}/>
                  <p>{user.name}</p>
                </div>
                {
                  user.accepted ? <div className="accept">
                    <p>Geaccepteerd</p>
                    <img className='credits' src={credits}/>
                    {
                      user.present ? <p>Aanwezig</p> : <div className='accept-present'>
                        <img src={accept} onClick={e => presentUser(skill.id, user.id)}/>
                        <img src={decline}/>
                      </div>
                    }
                  </div> : <div className="accept-accepted">
                    <img src={accept} onClick={e => acceptUser(skill.id, user.id)}/>
                    <img src={decline}/>
                  </div>
                }
              </div>
            ) : null
          }
        </div>
      </div> : null
    ) : null;

    const paidSkill = event && event.skills ? event.skills.map(skill => 
      skill.paid === 1 ? <div key={skill.id}>
        <div className="skills" >
          <div className="skills-inner">
            <div className="image"><img src={findSkillIcon(skill.skill.icon)}/></div>
            <p>{skill.amount} x {skill.skill.name} - {skill.hours}u</p>
          </div>
          {
            skill.users ? skill.users.map(user => 
              <div className="users">
                <div className="image">
                  <img src={profile}/>
                  <p>{user.name}</p>
                </div>
                {
                  user.accepted ? <div className="accept">
                    <p>Geaccepteerd</p>
                    <img className='credits' src={credits}/>
                    {
                      user.present ? <p>Betaald</p> : <div className='accept-present'>
                        <img src={accept} onClick={e => presentUser(skill.id, user.id, skill.credits)}/>
                        <img src={decline}/>
                      </div>
                    }
                  </div> : <div className="accept-accepted">
                    <img src={accept} onClick={e => acceptUser(skill.id, user.id)}/>
                    <img src={decline}/>
                  </div>
                }
              </div>
            ) : null
          }
        </div>
      </div> : null
    ) : null;

    return (
      <div className="height100">
        <Nav/>
        {
          event ? 
          <div className="event-leader-board">
            <h2 className="event-title"><span>{event.project.name} - {event.name}</span></h2>
            <div className="top">
              <div>
                  <img src={agenda} alt=""/>
                  <h2>{date(event.date)}</h2>
              </div>
              <div>
                  <img src={time} alt=""/>
                  <h2>{new Date(event.date).toLocaleTimeString()}</h2>
              </div>
              <div>
                  <img src={get} alt=""/>
                  <h2>Totaal budget</h2>
              </div>
              <div>
                  <img src={see} alt=""/>
                  <h2>{event.location}</h2>
              </div>
            </div>
            <div className="bottom">
              <div className="left">
                <h2><img src={work} alt=""/>Projectbeschrijving</h2>
                <p>{event.project.description}</p>
              </div>
              <div className="right">
                <h2><img src={free} alt=""/>Vrijwilliger uren</h2>
                {freeSkill}
                <h2><img src={skill} alt=""/>Skill uren</h2>
                {paidSkill}
              </div>
            </div>
          </div>
          : null
        }
      </div>
    );
}

export default connect(
    null,
    {getAllEvents}
  )(EventLeaderBoard);