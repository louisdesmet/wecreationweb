import React, { useState } from "react";
import { Link } from "react-router-dom";
import Axios from 'axios';
import { skillIcon } from "../Global";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import see from '../img/nav/see.png';
import get from '../img/nav/get.png';
import agenda from '../img/nav/agenda.png';
import time from '../img/eventshow/time.png';
import team from '../img/profile/team.png';
import leader from '../img/profile/leader.png';
import accept from '../img/eventshow/accept.png';
import decline from '../img/eventshow/decline.png';
import desc from '../img/profile/desc.png';
import geelPuzzel from '../img/eventshow/geel-puzzel.png';
import credit from '../img/profile/credit.png';
import free from '../img/profile/free.png';
import like from '../img/eventshow/like.png';

function EventShow(props) {

  const notify = (event, skill) => toast("Je bent ingeschreven om te werken op " + event.name + " voor " + skill.hours + " uur " + skill.skill.name + ". De projectleider moet je nu eerst aanvaarden");

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const [areYouSure, setAreYouSure] = useState(1);
  const [chosenSkill, setChosenSkill] = useState(null);
  const [teamClicked, setTeamClicked] = useState(false);
  const [budgetClicked, setBudgetClicked] = useState(false);

  props.event.skills.forEach(skill => {
    skill.users.forEach(user => {
      if(user.id === loggedUser.id) {
        props.event.allowedInGroupchat = true;
      }
    })
  })

  const paidSkill = props.event && props.event.skills ? props.event.skills.map(skill => 
    skill.paid === 1 ? <div className="skills" key={skill.id}>
      <div className="image"><img src={skillIcon(skill.skill.icon)}/></div>
      <p>{skill.amount} x {skill.skill.name} - {skill.hours}u</p>
      <div className="button">
        {
          skill.users.filter(user => user.accepted).length < skill.amount ? <button onClick={e => areYouSureBox(skill)}>Inschrijven</button> : <button className="full">Volzet</button>
        }
      </div>
    </div> : null
  ) : null;

  const freeSkill = props.event && props.event.skills ? props.event.skills.map(skill => 
    skill.paid === 0 ? <div className="skills" key={skill.id}>
      <div className="image"><img src={skillIcon(skill.skill.icon)}/></div>
      <p>{skill.amount} x {skill.skill.name} - {skill.hours}u</p>
      <div className="button">
        {
          skill.users.filter(user => user.accepted).length < skill.amount ? <button onClick={e => areYouSureBox(skill)}>Inschrijven</button> : <button className="full">Volzet</button>
        }
      </div>
    </div> : null
  ) : null;

  const teamList = props.event && props.event.skills ? <div className="team">{props.event.skills.map(skill => 
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

  const budget = props.event && props.event.skills ? <div className="team">{props.event.skills.map(skill =>
    <div key={skill.id}>
        {
          skill.paid ? <p>{skill.skill.name}: {skill.amount * skill.credits}cc</p> : null
        }
    </div>
  )}</div> : null;

  function areYouSureBox(skill) {
    setAreYouSure(1);
    setChosenSkill(skill);
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
      setAreYouSure(false);
      notify(props.event, chosenSkill);
    })
    .catch((error) => {
  
    })
  }
  
  return (
    <div>    
      {
        <div className='event-panel'>
          <div className="top-items">
            <div className="groupchat">
              {
                props.event.allowedInGroupchat || props.event.project.leader.id === loggedUser.id ? <p onClick={e => window.location.href = "/netwerk/" + props.event.id}>Groupchat</p> : null
              }
            </div>
            <img className="event-logo"  src={(process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/' : 'http://wecreationapi.test/') + "events/" + props.event.image}/>
            <div className={props.event.users && props.event.users.find(user => user.id === loggedUser.id) || props.liked ? "like liked" : "like"} onClick={e => props.event.users && props.event.users.find(user => user.id === loggedUser.id) ? null : props.likeEvent(props.event.id)}>
             
                  <span>{props.liked ? props.event.users.length + 1 : props.event.users.length}</span>
                  <img src={like}/>
                  <p>Interesse!</p>
         
            </div>
          </div>
          <h2 className="event-title"><span>{props.event.name}</span></h2>
          <div className="container">
          <div className="left">
            <div className="left-item">
              <Link to={"/agenda/" + props.event.id}>
                  <img src={agenda}/>
                  <p>{date(props.event.date)}</p>
              </Link>
            </div>
            <div className="left-item">
              <img src={time}/>
              <p>{props.event.time}</p>
            </div>
            <div className="left-item">
              <Link to={"/see"}>
                  <img src={see}/>
                  <p>{props.event.location}</p>
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
              <Link to={"/profiel/" + props.event.project.leader.id}>{props.event.project.leader.name}</Link>
            </div>
          </div>
          <div className="right">
            <h2><img src={desc} alt=""/>{props.event.project.name}</h2>
            <p className="desc">{props.event.project.description}</p>
            <h2><img src={geelPuzzel} alt=""/>Eventbeschrijving</h2>
            <p className="desc">{props.event.description}</p>
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
      }
      <ToastContainer />
    </div>
  );
}

export default EventShow;