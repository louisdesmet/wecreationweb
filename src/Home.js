import React, { useState, useEffect } from "react";
import {useSelector} from "react-redux";
import {connect} from "react-redux";
import {getProjects} from "./redux/actions";
import axios from 'axios';
import Nav from "./Nav";

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
    <div className="event-details">
      <div>
        <h3>Participanten</h3>
        {                       
          event.users.map((user, index) =>
            <div key={String(user.id) + String(index)}>
              <p>{user.name}</p>
            </div>
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

function Subscribe({ event }) {

  const [hours, setHours] = useState(0);

  if (event.free == 0 && event.credits != 0) {
    return null;
  }

  function join() {

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("token")
    }
    if(event.free >= hours) {
      axios.post('/subscribe', {
        'event_id': event.id,
        'user_id': JSON.parse(localStorage.getItem("user")).id,
        'hours': hours
      }, {
        headers: headers
      })
      .then((response) => {
        
      })
      .catch((error) => {
    
      })
    }
    
  }

  if (event.credits == 0) {
    return (
      <div className="subscribe">
        <button className="full-width">Schrijf je in</button>
      </div>
    )
  }

  return (
    <div className="subscribe">
      <input type="number" onChange={(e) => {setHours(parseInt(e.target.value))}} placeholder="Hoeveel uren wil je werken?"/>
      <button onClick={() => join()}>Schrijf je in</button>
    </div>
  )
  

}

export const Home = ({getProjects}) => {

  useEffect(() => {
    getProjects();
  }, []);

   
    const projects = useSelector(state => state.remoteProjects);
    if(projects.data) {
      let hours = 0;
      Object.values(projects.data).forEach(project => {
        project.events.forEach(event => {
          event.users.forEach(user => {
            hours += parseInt(user.hours);
          })
          event.free = event.credits - hours;
          hours = 0;
        })
      });
     
    }

    function date(date) {
      const jsDate = new Date(date);
      return jsDate.getDate()+'-'+(jsDate.getMonth()+1)+'-'+jsDate.getFullYear();
    }

    const projectList = projects.data ? (
      <div>
        {
          projects.data.map(project =>
              <div className="project" key={project.id}>
                  <p className="bold">{project.name}</p>
                  <p>{project.description}</p>
                  <p>Projectleider: {project.leader.name}</p>
                  <div className="event-headers">
                    <p>Naam</p>
                    <p>Locatie</p>
                    <p>Datum</p>
                    <p>Tijdstip</p>
                    <p>Skill</p>
                  </div>
                  {
                    project.events.map(event =>
                      <div key={event.id}>
                        <div className="event">
                            <h2>{event.name}</h2>
                            <p>{event.location}</p>
                            <p>{date(event.date)}</p>
                            <p>{new Date(event.date).toLocaleTimeString()}</p>
                            <p>{event.skill}</p>
                        </div>
                        <List event={event} />
                        <Subscribe event={event} />
                        <div className="line"></div>                    
                      </div>
                    )
                  }
              </div>
          )
        }
      </div>
    ) : null;

    return (
        <div>
          <Nav/>
          {projectList}
        </div>
    );
}

export default connect(
  null,
  { getProjects }
)(Home);
