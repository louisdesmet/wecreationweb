import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getProjects} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link, useParams } from 'react-router-dom';
import Nav from './Nav';
import accept from './img/accept.png';
import credit from './img/profile-credit.png';
import profiel from './img/nav-profiel.png';
import datum from './img/nav-agenda.png';
import location from './img/nav-see.png';
import navGet from './img/nav-get.png';
import decline from './img/decline.png';
import './css/ProjectShow.scss';
import locprod from './Global';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChess, faAddressCard, faBeer, faBalanceScale, faMugHot, faBurn, faAnchor, faBlind, faBowlingBall, 
    faRadiation, faBandAid, faBath, faBed, faBible, faBlender, faBong, faBox } from '@fortawesome/free-solid-svg-icons'

export const ProjectShow = ({getProjects}) => {

    useEffect(() => {
      getProjects();
    }, []);

    const projects = useSelector(state => state.remoteProjects);

    const { id } = useParams();
    const project = projects.data ? projects.data.find(project => project.id === parseInt(id)) : null;

    function date(date) {
      const jsDate = new Date(date);
      return jsDate.getDate()+'-'+(jsDate.getMonth()+1)+'-'+jsDate.getFullYear();
    }

    var sorted = project ? project.events.sort((a,b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    }) : null;
    const reversed = sorted ? sorted.slice().reverse() : null;

    let totalHoursPaid = 0;
    let totalHoursFree = 0;
    let team = [];

    if(project) {
      
      project.events.forEach(event => {
        event.skills.forEach(skill => {
          skill.users.forEach(user => {
            if(user.present) {
              if(skill.paid) {
                totalHoursPaid += skill.hours
              } else {
                totalHoursFree += skill.hours
              }
              if(!team.find(item => item.id === user.id)) {
                
                  
                    team.push({id: user.id, name: user.name, icon: user.icon})
                
              }
            }
          })
        })
      })
    }

    function deleteEvent(e, id) {
      
      e.preventDefault();
      fetch(locprod + '/events/' + id, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
      }).then(response => {
        window.location.href = '/projects/' + project.id;
      })
      
    }

    function findIcon(icon) {
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


    return (
      <div className="project-details height100">
          <Nav/>
          {project ?
            <div className='project-panel'>
              <div className="column-1">
                
                <h2>{project.name}</h2>
                <div className="project-headers">
                  <img src={accept}/>
                  <img src={credit}/>
                  <img src={profiel}/>
                </div>
                <div className="project-info">
                    <p>{project.type}</p>
                    <p>{project.credits}</p>
                    <p>{project.leader.name}</p>
                </div>
                <p className="mt-70 mb-70">{project.description}</p>
                {"Er werden al " + (totalHoursPaid + totalHoursFree) + " uren gepresteerd waarvan " + totalHoursPaid + " betaald en " + totalHoursFree + " vrijwillig"}
                <h2>Team</h2>
                {team.map(user => 
                  <Link key={user.id} className="team" to={"/profiel/" + user.id}><FontAwesomeIcon className="teamIcon" icon={findIcon(user.icon)} color="white"/>{user.name}</Link>                      
                )}
                {JSON.parse(localStorage.getItem("user")).id === project.leader.id ? <Link to={"/event/create/" + project.id} className='new-event'>Nieuw event</Link> : null}
              </div>
              <div className="column-2">
                {
                  reversed.map(event =>
                    <Link to={"/events/" + event.id} className={"project-panel-event" + (new Date(event.date) < new Date() ? " project-panel-event-past" : "")} key={event.id}>
                        {JSON.parse(localStorage.getItem("user")).id === project.leader.id ? <img className="delete" onClick={e => deleteEvent(e, event.id)} src={decline} alt=""/> : null}
                        
                        <h2>{event.name}</h2>
                        <p className="mt-15">{event.description}</p>
                        <div>
                          <img src={datum}/>
                          <img src={location}/>
                          <img src={navGet}/>
                          <img src={accept}/>
                        </div>
                        <div>
                          <p>{date(event.date)}</p>
                          <p>{event.location}</p>
                          <p>{event.credits}</p>
                          <p>vrije uren</p>
                        </div>
                    </Link>
                  )
                }
              </div>
            </div>
            :
            null
          }
      </div>
    );
}


function List({ event }) {

  function Free({free}) {
    if (free == 0) {
      return (
        <div className="free"><p>Project volzet</p></div>
      );
    }
    return (
      <div className="free"><p>{event.free} vrije uren</p></div>
    );
  }

  if (event.credits == 0) {
    return null;
  }
 
  return (
    <div className="event-details mt-70">
      <div>
        <h3>Participanten</h3>
        {                             
          event.users.map((user, index) =>
            (user.accepted ? <div className="event-user-hours" key={String(user.id) + String(index)}>
              <p>{user.name}</p>
              <p>{user.hours} ingeschreven uren</p>
            </div> : null)            
          )
        }
      </div>
      <div>
        <Free free={event.free}/>
        <div><p>Dit werk event heeft {event.credits} werkuren in totaal.</p></div>
      </div>                     
    </div>
  );
}

export default connect(
    null,
    {getProjects}
  )(ProjectShow);