import React, { useState, useEffect } from "react";
import {useSelector} from "react-redux";
import {connect} from "react-redux";
import {getProjects} from "./redux/actions";
import Nav from "./Nav";
import WorkEvents from "./WorkEvents";
import { useHistory } from "react-router-dom";


export const Work = ({getProjects}) => {
  const history = useHistory();
  useEffect(() => {
    getProjects();
  }, []);

  const projectsApi = useSelector(state => state.remoteProjects);
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
    Object.values(projectsApi.data).forEach(project => {
      project.enabled = 0;
      project.events.forEach(event => {
        event.users.forEach(user => {
          hours += parseInt(user.hours);
        })
        event.free = event.credits - hours;
        hours = 0;
      })
    });
  }

  function projectLeaderBoard(e, id) {
    e.stopPropagation();
    history.push("/work-project-leader/" + id);
  }

  if(loading) {
    return false;
  }
  const projectList = projects ? (
    <div className="projects">
      {
        projects.map(project =>
          <div className="project" key={project.id} onClick={e => {
            const clone = JSON.parse(JSON.stringify(projects))
            clone.forEach((element, index) => {
                if(element.id === project.id) {
                    if(clone[index].enabled === 0) {
                      clone[index].enabled = 1;
                    } else {
                      clone[index].enabled = 0;
                    }
                }
            });
            setProjects(Object.values(clone));
          }}>
              <p className="bold">{project.name}{JSON.parse(localStorage.getItem("user")).id === project.leader.id ? <span className="project-leader-btn" onClick={e => projectLeaderBoard(e, project.id)}>Project leider paneel</span> : null}</p>
              <p>{project.description}</p>
              <p>Projectleider: {project.leader.name}</p>
              {project.enabled == 1 ? <WorkEvents project={project}/> : null}
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
)(Work);
