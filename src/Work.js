import React, { useState, useEffect } from "react";
import {useSelector} from "react-redux";
import {connect} from "react-redux";
import {getProjects} from "./redux/actions";
import Nav from "./Nav";
import { Link, useHistory } from "react-router-dom";
import { date } from './Global.js';
import upEvent from './img/eventshow/future.png';
import downEvent from './img/eventshow/past.png';
import navProfile from './img/nav/profile.png';
import work from './img/nav/work.png';
import './css/Work.scss';

import add from './img/eventshow/add.png';

export const Work = ({getProjects}) => {

  const history = useHistory();

  useEffect(() => {
    getProjects();
  }, []);

  const projects = useSelector(state => state.remoteProjects);

  function events(id) {
    history.push("/projects/" + id);
  }

  if(projects.data) {
    projects.data.forEach(project => {
      project.upEvents = project.events.filter(event => new Date(event.date) > new Date()).length;
      project.downEvents = project.events.filter(event => new Date(event.date) < new Date()).length;
    });
  }

  const projectList = projects.data ? (
    <div className="projects">
      {
        projects.data.map(project =>
          <div className="project" key={project.id} onClick={e => events(project.id)}>
              <img className="project-logo"  src={(process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/' : 'http://wecreationapi.test/') + "projects/" + project.picture}/>
              <p className="project-title">{project.name}</p>
              <div className="project-desc">
                <p>Beschrijving</p>
                <p>{project.description}</p>
              </div>
              

              <div className="project-icons-container">
                <div className="project-icons">
                  <div>
                    <img src={navProfile}/>
                    <h2>{project.leader.name}</h2>
                    <p className="createdat">sinds {date(project.created_at)}</p>
                  </div>
                  <div>
                    <img src={upEvent}/>
                    <h2>Lopende events</h2>
                    <p>{project.upEvents}</p>
                  </div>
                  <div>
                    <img src={downEvent}/>
                    <h2>Afgelopen events</h2>
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
        <div className="projects-container">
          <Link to={"/project/create"} className="add">Project toevoegen <img src={add}/></Link>
          <img className="logo" src={work}/>
          <h2 className="title"><span>Projecten</span></h2>
          {projectList}
        </div>
      </div>
  );
}

export default connect(
  null,
  { getProjects }
)(Work);
