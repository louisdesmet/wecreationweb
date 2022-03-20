import React, { useState, useEffect } from "react";
import {useSelector} from "react-redux";
import {connect} from "react-redux";
import {getProjects, getSkills} from "./redux/actions";
import Nav from "./Nav";
import { useHistory } from "react-router-dom";
import admin from './img/admin.png';
import accept from './img/accept.png';
import upEvent from './img/up-event.png';
import downEvent from './img/down-event.png';
import navProfile from './img/nav-profiel.png';
import navGet from './img/nav-get.png';
import './css/Work.scss';

export const Work = ({getProjects, getSkills}) => {

  const history = useHistory();

  useEffect(() => {
    getProjects();
    getSkills();
  }, []);

  const projectsApi = useSelector(state => state.remoteProjects);
  const skills = useSelector(state => state.remoteSkills);

  const [loading, setLoading] = useState(true);
  const [oneTime, setOneTime] = useState(false);
  const [projects, setProjects] = useState(null);

  if(projectsApi.data && oneTime === false) {
    setOneTime(true);
    setLoading(false);
    setProjects(projectsApi.data);
  }

  if(projectsApi.data) {
    let hours = 0;

    /*Object.values(projectsApi.data).forEach(project => {
      project.events.forEach(event => {
        let listHours = 0;
        if(event.skill) {
          JSON.parse(event.skill).forEach(item => {
              listHours += item.hours;
          });
        }
        
        event.users.forEach(user => {
          hours += parseInt(user.hours);
        })
        let totalSkillHours = 0; 
        skills.data.forEach(skill => {
          skill.events.forEach(newEvent => {
            if(newEvent.id === event.id) {
              totalSkillHours += newEvent.hours;
            }
          });
        });

        event.free = ((event.credits - listHours - hours) + (listHours - totalSkillHours));
        event.generalFree = (event.credits - listHours) - hours;
        hours = 0;
      })
    });*/
  }

  function projectLeaderBoard(e, id) {
    e.stopPropagation();
    history.push("/event/create/" + id);
  }

  function events(id) {
    history.push("/projects/" + id);
  }

  if(loading) {
    return false;
  }

  projects.forEach(project => {
    project.upEvents = project.events.filter(event => new Date(event.date) > new Date()).length;
    project.downEvents = project.events.filter(event => new Date(event.date) < new Date()).length;
  });

  const projectList = projects ? (
    <div className="projects">
      {
        projects.map(project =>
          <div className="project" key={project.id} onClick={e => events(project.id)}>
              {JSON.parse(localStorage.getItem("user")).id === project.leader.id ? <span className="project-leader-btn" onClick={e => projectLeaderBoard(e, project.id)}><img src={admin} alt=""/></span> : null}
              <img className="project-logo" src={ require('./img/project/' + project.picture) }/>
              <p className="project-title">{project.name}</p>
              <div className="project-desc">
                <p>{project.description}</p>
              </div>
              

              <div className="project-icons-container">
                <div className="project-icons">
                  <div>
                    <img src={navProfile}/>
                    <p className="project-leader-name">{project.leader.name}</p>
                  </div>
                  <div>
                    <img src={upEvent}/>
                    <p>{project.upEvents}</p>
                  </div>
                  <div>
                    <img src={downEvent}/>
                    <p>{project.downEvents}</p>
                  </div>
                </div>
              </div>
          </div>
        )
      }
    </div>
  ) : null;

  return (
      <div className="height100">
        <Nav/>
        {projectList}
      </div>
  );
}

export default connect(
  null,
  { getProjects, getSkills }
)(Work);
