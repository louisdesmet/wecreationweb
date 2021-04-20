import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getProjects} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link } from 'react-router-dom';

export const AdminProjectsEventsCreate = ({getProjects}) => {

    useEffect(() => {
      getProjects();
    }, []);

    const projects = useSelector(state => state.remoteProjects);

    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [credits, setCredits] = useState("");
    const [project, setProject] = useState("");
    
    const locprod = (process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/api' : 'http://api.test/api');
    
    function submit() {
        fetch(locprod + '/events', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
          },
          body: JSON.stringify({
            name: name,
            location: location,
            date: date,
            credits: credits,
            project: project
          })
        }).then(response => {
          window.location.href = '/admin-projects-events';
        })
    }

    const projectList =  projects.data ? projects.data.map(project => <option key={project.id} value={project.id}>{project.name}</option>) : null;

    return (
      <div className='create'>
          <h2>Event aanmaken</h2>
          <input onChange={e => setName(e.target.value)} placeholder='Naam'/>
          <input onChange={e => setLocation(e.target.value)} placeholder='Location'/>
          <input onChange={e => setDate(e.target.value)} placeholder='Date'/>
          <input onChange={e => setCredits(e.target.value)} placeholder='Credits'/>
          <select onChange={e => setProject(e.target.value)}>
              {projectList}
          </select>
          <input onClick={submit} type='submit' value='Toevoegen'/>
      </div>
    );
}

export default connect(
  null,
  {getProjects}
)(AdminProjectsEventsCreate);