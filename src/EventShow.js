import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getAllEvents, getSkills} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link, useParams } from 'react-router-dom';
import Axios from 'axios';
import { skillIcon } from './Global';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nav from './Nav';

import './css/EventShow.scss';
import agenda from './img/nav/agenda.png';
import time from './img/eventshow/time.png';
import see from './img/nav/see.png';
import get from './img/nav/get.png';
import team from './img/profile/team.png';
import leader from './img/profile/leader.png';
import desc from './img/profile/desc.png';
import geelPuzzel from './img/eventshow/geel-puzzel.png';
import credit from './img/profile/credit.png';
import free from './img/profile/free.png';
import accept from './img/eventshow/accept.png';
import decline from './img/eventshow/decline.png';
import like from './img/eventshow/like.png';

export const EventShow = ({getAllEvents, getSkills}) => {

  const notify = (event, skill) => toast("Je bent ingeschreven om te werken op " + event.name + " voor " + skill.hours + " uur " + skill.skill.name + ". De projectleider moet je nu eerst aanvaarden");

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    getAllEvents();
    getSkills();
  }, []);

  const [areYouSure, setAreYouSure] = useState(1);
  const [chosenSkill, setChosenSkill] = useState(null);
  const [teamClicked, setTeamClicked] = useState(false);
  const [budgetClicked, setBudgetClicked] = useState(false);
  const [liked, setLiked] = useState(false);

  const events = useSelector(state => state.remoteAllEvents);

  const { id } = useParams();
  const event = events.data ? events.data.find(event => event.id === parseInt(id)) : null;

  const paidSkill = event && event.skills ? event.skills.map(skill => 
    skill.paid === 1 ? <div className="skills" key={skill.id}>
      <div className="image"><img src={skillIcon(skill.skill.icon)}/></div>
      <p>{skill.amount} x {skill.skill.name} - {skill.hours}u</p>
      <div className="button">
        <button onClick={e => areYouSureBox(skill)}>Inschrijven</button>
      </div>
    </div> : null
  ) : null;

  const freeSkill = event && event.skills ? event.skills.map(skill => 
    skill.paid === 0 ? <div className="skills" key={skill.id}>
      <div className="image"><img src={skillIcon(skill.skill.icon)}/></div>
      <p>{skill.amount} x {skill.skill.name} - {skill.hours}u</p>
      <div className="button">
        <button onClick={e => areYouSureBox(skill)}>Inschrijven</button>
      </div>
    </div> : null
  ) : null;

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

  function date(date) {
    const jsDate = new Date(date);
    return jsDate.getDate()+'-'+(jsDate.getMonth()+1)+'-'+jsDate.getFullYear();
  }

  function areYouSureBox(skill) {
    setAreYouSure(1);
    setChosenSkill(skill);
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
      setAreYouSure(false);
      notify(event, chosenSkill);
    })
    .catch((error) => {
  
    })
  }
  
  function likeEvent() {
    Axios.post('/like-event', {
      'event': event.id,
      'user': JSON.parse(localStorage.getItem("user")).id
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      }
    })
    .then((response) => {
      getAllEvents();
      setLiked(true);
    })
    .catch((error) => {
  
    })
  }

  return (
    <div className="height100">
        <Nav/>
        {event ?
          <div className='event-panel'>
            <div className={event.users && event.users.find(user => user.id === loggedUser.id) || liked ? "like liked" : "like"} onClick={e => event.users && event.users.find(user => user.id === loggedUser.id) ? null : likeEvent()}>
              <img src={like}/>
              <p>Ik ben geinteresseerd</p>
            </div>
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
              <p>Weet je zeker dat je je voor {chosenSkill.hours} uur in <img src={skillIcon(chosenSkill.skill.icon)}/>{chosenSkill.skill.name} wilt inschrijven?</p>
              <img className="accept" src={accept} onClick={e => register(chosenSkill.id)}/>
              <img className="accept" src={decline} onClick={e => setAreYouSure(0)}/>
            </div> : null
            }
          </div>
          :
          null
        }
        <ToastContainer />
    </div>
  );
}

export default connect(
  null,
  {getAllEvents, getSkills}
)(EventShow);