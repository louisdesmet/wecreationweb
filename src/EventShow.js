import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getAllEvents, getSkills} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link, useParams } from 'react-router-dom';
import Nav from './Nav';
import datum from './img/nav-agenda.png';
import location from './img/nav-see.png';
import time from './img/tijdstip.png';
import navGet from './img/nav-get.png';
import profiel from './img/nav-profiel.png';
import work from './img/nav-work.png';
import navNetwork from './img/nav-netwerk.png';

import regie from './img/Regie.png';
import montage from './img/Montage.png';
import mode from './img/Mode.png';
import dans from './img/Dans.png';
import camera from './img/Camera.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChess, faAddressCard, faBeer, faBalanceScale, faMugHot, faBurn, faAnchor, faBlind, faBowlingBall, 
    faRadiation, faBandAid, faBath, faBed, faBible, faBlender, faBong, faBox } from '@fortawesome/free-solid-svg-icons';

import './css/EventShow.scss';
import Axios from 'axios';


export const EventShow = ({getAllEvents, getSkills, ...otherProps}) => {

    useEffect(() => {
      getAllEvents();
      getSkills();
    }, []);
    

    const events = useSelector(state => state.remoteAllEvents);
    const skills = useSelector(state => state.remoteSkills);

    const { id } = useParams();

    let event
    if(otherProps.event) {
      event = otherProps.event;
    } else {
      event = events.data ? events.data.find(event => event.id === parseInt(id)) : null;
    }

    let newSkills = [];
    let skillList = [];
    let worked = [];
    let hours = 0;
    
 
    if(event) {
      let hours = 0;

      event.users.forEach(user => {
        hours += parseInt(user.hours);
      })

      let listHours = 0;
      if(event.skill) {
        JSON.parse(event.skill).forEach(item => {
            listHours += item.hours;
        });
      }

      event.free = (event.credits - listHours) - hours;
      
      if(skills.data && event.skill) {
        let hoursCounter = 0;
        skills.data.forEach(skill => {
          skill.events.forEach(eventItem => {
            if(event.id === eventItem.id) {
              hoursCounter += parseInt(eventItem.hours);
            }
          });
          JSON.parse(event.skill).forEach(item => {
            if(skill.id === item.id) {
              skill.hours = item.hours;
              skill.free =  item.hours - hoursCounter;
              newSkills.push(skill);
            }
          });
          hoursCounter = 0;
        });
      }

      skillList = (newSkills ? newSkills.map(skill =>
        <div className="skills-container" key={skill.id}>
          <div className="skill-title">
            <img src={findIcon(skill.name)}/>
            <h3>{skill.name}</h3>
          </div>
          <div className="skill-number">
            <div>
              <input type="number" placeholder="_" onChange={(e) => {setHours(parseInt(e.target.value))}}/>
              <p> / {skill.free}</p>
            </div>
          </div>
          <div className="confirm">
            <button onClick={() => joinSkill(skill)}>Bevestig</button>
          </div>
        </div>
      ) : null);

      worked = [];
      event.users.forEach(user => {
        if(worked[user.id]) {

          const newNum = parseInt(worked[user.id].hours) + parseInt(user.hours);
          worked[user.id].hours = newNum;
        } else {
          worked[user.id] = user;

        }
      });

      skills.data.forEach(skill => {
        skill.events.forEach(skillEvent => {
          if(worked[skillEvent.user_id]) {
            if(!worked[skillEvent.user_id].skills) {
              worked[skillEvent.user_id].skills = [];
            }
            if(worked[skillEvent.user_id].skills[skill.id]) {
              const newNum = parseInt(worked[skillEvent.user_id].skills[skill.id].hours) + parseInt(skillEvent.hours);
              worked[skillEvent.user_id].skills[skill.id].hours = newNum;
            } else {
              worked[skillEvent.user_id].skills[skill.id] = skillEvent;
              worked[skillEvent.user_id].skills[skill.id].skillName = skill.name;
            }
          }
        })
      });
    }

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
      }
    }

    function findProfileIcon(icon) {
      switch(icon) {
          case "faChess": return faChess;
          break;
          case "faAddressCard": return faAddressCard;
          break;
          case "faBeer": return faBeer;
          break;
          case "faBalanceScale": return faBalanceScale;
          break;
          case "faMugHot": return faMugHot;
          break;
          case "faBurn": return faBurn;
          break;
          case "faAnchor": return faAnchor;
          break;
          case "faBlind": return faBlind;
          break;
          case "faBowlingBall": return faBowlingBall;
          break;
          case "faRadiation": return faRadiation;
          break;
          case "faBandAid": return faBandAid;
          break;
          case "faBath": return faBath;
          break;
          case "faBed": return faBed;
          break;
          case "faBible": return faBible;
          break;
          case "faBlender": return faBlender;
          break;
          case "faBong": return faBong;
          break;
          case "faBox": return faBox;
          break;
        }
    }

    function join() {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      }
      if(event.free >= hours && hours != 0) {

        Axios.post('/subscribe', {
          'event_id': event.id,
          'user_id': JSON.parse(localStorage.getItem("user")).id,
          'hours': hours
        }, {
          headers: headers
        })
        .then((response) => {
          window.location.href = '/events/' + event.id;
        }).catch((error) => {})
      }
      
    }

    function joinSkill(skill) {
  
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      }

      let skillHours = 0;
      skills.data.forEach(skill => {
        skill.events.forEach(eventItem => {
          if(event.id === eventItem.id && skill.id === JSON.parse(eventItem.skill).id) {
            skillHours += parseInt(eventItem.hours);
          }
        });
      });

      if(skill.free >= hours && hours != 0) {
        Axios.post('/subscribe-skill', {
          'event_id': event.id,
          'user_id': JSON.parse(localStorage.getItem("user")).id,
          'skill_id': skill.id,
          'hours': hours
        }, {
          headers: headers
        })
        .then((response) => {
          window.location.href = '/events/' + event.id;
        })
        .catch((error) => {
      
        })
      }
      
    }

    function setHours(num) {
      hours = num;
    }

    return (
      <div className="height100">
          {event ? 
            <div className='event-panel'>
              <h2 className="mb-70 mt-70">{event.project.name + ' - ' + event.name}</h2>
              <div className="event-panel-images">
                <img src={datum}/>
                <img src={time}/>
                <img src={location}/>
                <img src={navGet}/>
                <img src={profiel}/>
              </div>
              <div className="event">
                  <p>{date(event.date)}</p>
                  <p>{new Date(event.date).toLocaleTimeString()}</p>
                  <p><Link to={"/see"}>{event.location}</Link></p>
                  <p>8.31</p>
                  <p>{event.project.leader.name}</p>
              </div>
              <div className="event-panel-container">

                <div className="event-panel-general">

                  <h2><img src={work}/>Vrije uren vrijwilleger</h2>

                  <div className="skills-container">
                    <div className="skill-title">
                      <img src={regie}/>
                      <h3>Vrijwilleger</h3>
                    </div>
                    <div className="skill-number">
                      <div>
                        <input type="number" placeholder="_" onChange={(e) => {setHours(parseInt(e.target.value))}}/>
                        <p> / {event.free}</p>
                      </div>
                    </div>
                    <div className="confirm">
                      <button onClick={() => join()}>Bevestig</button>
                    </div>
                  </div>

                </div>

                <div className="event-panel-desc">
                  <p>{event.description}</p>
                </div>

                <div className="event-panel-skills">
                  <h2><img src={work}/>Vrije uren skills</h2>
                  {skillList}
                </div>

                <div className="event-panel-part">
                  <h2><img src={navNetwork}/>Participanten</h2>
                  {                  
                    worked.map((user) =>
                      (user.accepted ? <div className="user" key={user.id}>
                        <p><FontAwesomeIcon icon={findProfileIcon(user.icon)} className="icon"/>{user.name}</p>
                        <p>{user.hours}u. vrijwilleger</p>
                        {
                          user.skills ? user.skills.map(skill =>
                            <p key={user.id + '-' + skill.id + '-' + Math.random()}>{skill.hours + 'u. ' + skill.skillName}</p>
                          ) : null
                        }
                      </div> : null)
                    )
                  }

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