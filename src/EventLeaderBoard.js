import React, {useEffect} from 'react';
import {connect} from "react-redux";
import {getAllEvents, getUsers} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link, useParams } from 'react-router-dom';
import { skillIcon } from './Global';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
import add from './img/eventshow/accept.png';

export const EventLeaderBoard = ({getAllEvents, getUsers}) => {

    const notifyEventFull = (eventSkill) => toast("Er is geen plaats meer vrij om deze gebruiker te accepteren voor " + eventSkill.skill.name + ". Als je toch meer gebruikers wilt accepteren zal je het aantal werknemers moeten verhogen.");
    const notifyCredits = (user, eventSkill) => toast("Je hebt niet genoeg credits om " + user.name + " te vergoeden voor " + eventSkill.hours + "u " + eventSkill.skill.name + ".");
    const notifyComplete = (user, eventSkill) => toast("Je moet nog aanvragen en aanwezigheden goedkeuren of verwijderen");

    useEffect(() => {
      getAllEvents();
      getUsers();
    }, []);
    
    const events = useSelector(state => state.remoteAllEvents);
    const users = useSelector(state => state.remoteUsers);

    let loggedUser = users.data ? users.data.find(user => user.id === JSON.parse(localStorage.getItem("user")).id) : null;

    const { id } = useParams();
    const event = events.data ? events.data.find(event => event.id === parseInt(id)) : null;

    function date(date) {
      const jsDate = new Date(date);
      return jsDate.getDate()+'-'+(jsDate.getMonth()+1)+'-'+jsDate.getFullYear();
    }

    function acceptUser(eventSkill, user) {
      if(eventSkill.users.filter(userItem => userItem.accepted === 1).length < eventSkill.amount) {
        Axios.post('/accept', {
          'eventSkill': eventSkill,
          'user': user.id,
          'leader': event.project.leader.name,
          'eventName': event.name
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
      } else {
        notifyEventFull(eventSkill);
      }
    }

    function declineUser(eventSkill, user) {
      Axios.post('/decline', {
        'eventSkill': eventSkill.id,
        'user': user.id
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

    function presentUser(eventSkill, user) {
      if(parseInt(loggedUser.credits) >= eventSkill.credits || eventSkill.paid === 0) {
        Axios.post('/present', {
          'eventSkill': eventSkill.id,
          'credits': eventSkill.credits,
          'user': user.id,
          'leader': event.project.leader.id
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
      } else {
        notifyCredits(user, eventSkill);
      }
      
    }

    function nonPresentUser(eventSkill, user) {
      Axios.post('/not-present', {
        'eventSkill': eventSkill.id,
        'user': user.id,
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

    function complete() {
      let finished = true;
      event.skills.forEach(skill => {
        skill.users.forEach(user => {
          if(!user.present) {
            finished = false;
          }
        })
      })
      if(finished) {
        Axios.post('/complete-event', {
          'event': event.id
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
      } else {
        notifyComplete();
      }
     
    }



    const freeSkill = event && event.skills ? event.skills.map(skill => 
      skill.paid === 0 ? <div key={skill.id}>
        <div className="skills" >
          <div className="skills-inner">
            <div className="image"><img src={skillIcon(skill.skill.icon)}/></div>
            <p>{skill.amount} x {skill.skill.name} - {skill.hours}u</p>
          </div>
          {
            skill.users ? skill.users.map(user => 
              <div className="users" key={user.id}>
                <div className="image">
                  <img src={profile}/>
                  <Link to={"/profiel/" + user.id}>{user.name}</Link>
                </div>
                {
                  user.accepted ? <div className="accept">
                    <p>Geaccepteerd</p>
                    <img className='credits' src={credits}/>
                    {
                      user.present ? <p>Aanwezig</p> : <div className='accept-present'>
                        <img src={accept} onClick={e => presentUser(skill, user)}/>
                        <img src={decline} onClick={e => nonPresentUser(skill, user)}/>
                      </div>
                    }
                  </div> : <div className="accept-accepted">
                    <img src={accept} onClick={e => acceptUser(skill, user)}/>
                    <img src={decline} onClick={e => declineUser(skill, user)}/>
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
            <div className="image"><img src={skillIcon(skill.skill.icon)}/></div>
            <p>{skill.amount} x {skill.skill.name} - {skill.hours}u</p>
          </div>
          {
            skill.users ? skill.users.map(user =>
              <div className="users" key={user.id}>
                <div className="image">
                  <img src={profile}/>
                  <Link to={"/profiel/" + user.id}>{user.name}</Link>
                </div>
                {
                  user.accepted ? <div className="accept">
                    <p>Geaccepteerd</p>
                    <img className='credits' src={credits}/>
                    {
                      user.present ? <p>Betaald</p> : <div className='accept-present'>
                        <img src={accept} onClick={e => presentUser(skill, user)}/>
                        <img src={decline} onClick={e => nonPresentUser(skill, user)}/>
                      </div>
                    }
                  </div> : <div className="accept-accepted">
                    <img src={accept} onClick={e => acceptUser(skill, user)}/>
                    <img src={decline} onClick={e => declineUser(skill, user)}/>
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
            { event.completed_at ? <h2 className='completed'><span>Dit event staat gemarkeerd als afgelopen.</span><img src={add}/></h2> : null}
            <div className="top">
              <div>
                  <img src={agenda} alt=""/>
                  <h2>{date(event.date)}</h2>
              </div>
              <div>
                  <img src={time} alt=""/>
                  <h2>{event.time}</h2>
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
                {!event.completed_at ? <button onClick={complete}>Markeer event als afgelopen</button> : null}
              </div>
              
            </div>
          </div>
          : null
        }
        <ToastContainer />
      </div>
    );
}

export default connect(
    null,
    {getAllEvents, getUsers}
  )(EventLeaderBoard);