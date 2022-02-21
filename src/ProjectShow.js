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
                {JSON.parse(localStorage.getItem("user")).id === project.leader.id ? <Link to={"/event/create/" + project.id} className='new-event'>Nieuw event</Link> : null}
              </div>
              <div className="column-2">
                {
                  project.events.map(event =>
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