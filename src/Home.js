import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import {getAllEvents, getBusinesses, getSkills} from "./redux/actions";
import { Link } from "react-router-dom";


import work from './img/nav/work.png';
import see from './img/nav/see.png';
import get from './img/nav/get.png';
import random from './img/nav/random.png';
import profiel from './img/nav/profile.png';
import agenda from './img/nav/agenda.png';
import netwerk from './img/nav/network.png';

import time from './img/eventshow/time.png';
import team from './img/profile/team.png';
import leader from './img/profile/leader.png';

import accept from './img/eventshow/accept.png';
import decline from './img/eventshow/decline.png';

import desc from './img/profile/desc.png';
import geelPuzzel from './img/eventshow/geel-puzzel.png';
import credit from './img/profile/credit.png';
import free from './img/profile/free.png';
import skill from './img/profile/skill.png';

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

import Axios from 'axios';

export const Home = ({getAllEvents, getBusinesses, getSkills}) => {

  useEffect(() => {
    getAllEvents();
    getBusinesses();
    getSkills();
  }, []);

  const [areYouSure, setAreYouSure] = useState(1);
  const [chosenSkill, setChosenSkill] = useState(null);
  const [oneTime, setOneTime] = useState(1);
  const [event, setEvent] = useState(null);
  const [teamClicked, setTeamClicked] = useState(false);
  const [budgetClicked, setBudgetClicked] = useState(false);

  const events = useSelector(state => state.remoteAllEvents);
  const businesses = useSelector(state => state.remoteBusinesses);
  const skills = useSelector(state => state.remoteSkills);

  const futureEvents = events.data ? events.data.filter(event => {
    return new Date(event.date) > new Date();
  }) : null;

  if(futureEvents && oneTime) {
    let rndIntEvent = Math.floor(Math.random() * futureEvents.length) + 1;
    setEvent(futureEvents.find((event, index) => index + 1 === rndIntEvent));
    setOneTime(0);
  }

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

  function newEvent() {
    let eventsLength = futureEvents ? futureEvents.length : 0;
    let rndIntEvent = Math.floor(Math.random() * eventsLength) + 1;
    setEvent(futureEvents.find((event, index) => index + 1 === rndIntEvent));
  }

  const teamList = event && event.skills ? <div className="team">{event.skills.map(skill => 
    <div key={skill.id}>
        {
          skill.users.length > 0  ? <div>
            <h2>{skill.skill.name}</h2>
            {
              skill.users ? skill.users.map(user =>
                <Link  key={user.id} to={"/profiel/" + user.id}>{user.name}</Link>
              ) : null
            }
          </div> : null
        }  
    </div>
  )}</div> : null;

  const budget = event && event.skills ? <div className="team">{event.skills.map(skill =>
    <div key={skill.id}>
        {
          skill.paid ? <p>{skill.skill.name}: {skill.amount * skill.credits}cc</p> : null
        }
    </div>
  )}</div> : null;
  
  return (
      <div className="height100">
        <div className='nav'>
          <div><Link to="/work"><img src={work} alt=""/></Link></div>
          <div><Link to="/see"><img src={see} alt=""/></Link></div>
          <div><Link to="/get"><img src={get} alt=""/></Link></div>
          <div><a onClick={e => newEvent()}><img src={random} alt=""/></a></div>
          <div><Link to="/profiel"><img src={profiel} alt=""/></Link></div>
          <div><Link to="/agenda"><img src={agenda} alt=""/></Link></div>
          <div><Link to="/netwerk"><img src={netwerk} alt=""/></Link></div>
        </div>
        {event ?
          <div className='event-panel'>
            <h2 className="event-title"><span>{event.project.name + ' - ' + event.name}</span></h2>
            <div className="container">
              <div className="left">
                <div className="left-item">
                  <Link to={"/agenda/" + event.id}>
                    <img src={agenda}/>
                    <p>{date(event.date)}</p>
                  </Link>
                </div>
                <div className="left-item">
                  <img src={time}/>
                  <p>{event.time}</p>
                </div>
                <div className="left-item">
                  <Link to={"/see"}>
                    <img src={see}/>
                    <p>{event.location}</p>
                  </Link>
                </div>
                <div className="left-item" onClick={e => setBudgetClicked(!budgetClicked)}>
                  <img src={get}/>
                  <h2>Totaal budget</h2>
                  {budgetClicked ? budget : null}
                </div>
                <div className="left-item" onClick={e => setTeamClicked(!teamClicked)}>
                  <img src={team}/>
                  <h2>Team</h2>
                  {teamClicked ? teamList : null}
                </div>
                <div className="left-item">
                  <img src={leader}/>
                  <h2>Projectleider</h2>
                  <Link to={"/profiel/" + event.project.leader.id}>{event.project.leader.name}</Link>
                </div>
              </div>
              <div className="right">
                <h2><img src={desc} alt=""/>Projectbeschrijving</h2>
                <p className="desc">{event.project.description}</p>
                <h2><img src={geelPuzzel} alt=""/>Eventbeschrijving</h2>
                <p className="desc">{event.description}</p>
                <h2><img src={free} alt=""/>Vrijwilliger uren</h2>
                {freeSkill}
                <h2><img src={credit} alt=""/>Skill uren</h2>
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
  { getAllEvents, getBusinesses, getSkills }
)(Home);