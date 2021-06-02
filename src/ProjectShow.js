import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getProjects} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link, useParams } from 'react-router-dom';
import Nav from './Nav';

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


    return (
      <div className="event-details height100">
          <Nav/>
          <h2>Project details</h2>

          {project ? 
            <div className='event-panel'>
              <div className="event-headers">
                <p>Naam</p>
                <p>Type</p>
                <p>Omschrijving</p>
                <p>Credits</p>
                <p>Project leider</p>
              </div>
              <div className="event mb-70">
                  <p>{project.name}</p>
                  <p>{project.type}</p>
                  <p>{project.description}</p>
                  <p>{project.credits}</p>
                  <p>{project.leader.name}</p>
              </div>
              <h3>Events</h3>
              {
                project.events.map(event =>          
                  <div className="flex-space-between" key={event.id}>
                      <p><Link to={"/events/" + event.id}>{event.name}</Link></p>                    
                      <p>{date(event.date)}</p>
                  </div>
                )
              }
     
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