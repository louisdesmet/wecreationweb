import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import {connect} from "react-redux";
import {getProjects} from "./redux/actions";
import Nav from "./Nav";
import { useHistory } from "react-router-dom";
import Axios from "axios";

export const WorkLeaderBoard = ({getProjects}) => {
  const history = useHistory();
  
  useEffect(() => {
    getProjects();
  }, []);

  const { id } = useParams();
  const projects = useSelector(state => state.remoteProjects);

  function send(event, user) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("token")
    }
    Axios.post('/accept', {
      'event_id': event.id,
      'user_id': user.id,
      'id': user.event_user_id,
      'accepted': 1
    }, {
      headers: headers
    })
    .then((response) => {
      window.location.href = "/work-project-leader/" + id;
      
    })
    .catch((error) => {
  
    })
  }

  function verify(event, user) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("token")
    }
    Axios.post('/verify', {
      'event_id': event.id,
      'user_id': user.id,
      'id': user.event_user_id,
      'present': 1
    }, {
      headers: headers
    })
    .then((response) => {
      window.location.href = "/work-project-leader/" + id;
      
    })
    .catch((error) => {
  
    })
  }

  const project = projects.data ? projects.data.find(project => project.id === parseInt(id)) : null;
  if(!project) {
    return (
      <div>
        <Nav/>
        
      </div>
    );
  } else if(JSON.parse(localStorage.getItem("user")).id === project.leader.id) {
    const eventList = project ? (
      <div className="leader-events">
        {
          project.events.map(event =>
           
            <div className="leader-event" key={event.id}>
              <h2>Event naam: {event.name}</h2>
              {
                event.users.map(user =>
                  (!user.accepted ? <div key={user.id}>
                    <p>{user.name}</p>
                    <p>{user.hours}</p>
                    <p onClick={e => send(event, user)}>Accepteren</p>
                    <p>Afwijzen</p>
                  </div> : null) 
                )
              }
            </div>
            
          )
        }
      </div>
    ) : null;

    const eventShowupList = project ? (
      <div className="leader-events">
        {
          project.events.map(event =>
           
            <div className="leader-event" key={event.id}>
              <h2>Event naam: {event.name}</h2>
              {
                event.users.map(user =>
                  (user.accepted && !user.present ? <div key={user.id}>
                    <p>{user.name}</p>
                    <p>{user.hours}</p>
                    <p onClick={e => verify(event, user)}>Aanwezig</p>
                    <p>Afwezig</p>
                  </div> : null)
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
        <h2 className="project-leader-titles">Verifieer de mensen die zich hebben ingeschreven op jouw events.</h2>
        {eventList}
        <h2 className="project-leader-titles">Verifieer hier of de mensen die je hebt geaccepteerd ook effectief zijn komen opdagen.</h2>
        {eventShowupList}
      </div>
    );
  } else {
    history.push("/home");
    return false;
  }
}


export default connect(
  null,
  { getProjects }
)(WorkLeaderBoard);
