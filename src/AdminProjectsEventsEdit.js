import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {useSelector} from "react-redux";
import { Link, useParams } from 'react-router-dom';

export const AdminProjectsEventsEdit = ({}) => {

    const events = useSelector(state => state.remoteAllEvents);
    const projects = useSelector(state => state.remoteProjects);

    const { id } = useParams();
    const event = events.data ? events.data.find(event => event.id === parseInt(id)) : null;

    const [name, setName] = useState(event.name);
    const [location, setLocation] = useState(event.location);
    const [date, setDate] = useState(event.date);
    const [credits, setCredits] = useState(event.credits);
    const [project, setProject] = useState(event.project.id);
    
    const locprod = (process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/api' : 'http://api.test/api');
    
    function submit() {
        fetch(locprod + '/events/' + event.id, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
          },
          body: JSON.stringify({
            name: name,
            location: location,
            date: date,
            credits: credits
          })
        }).then(response => {
          window.location.href = '/admin-projects-events';
        })
    }

    const projectList =  projects.data ? projects.data.map(project => <option key={project.id} value={project.id}>{project.name}</option>) : null;

    return (
      <div className='create'>
          <h2>Project Event aanmaken</h2>
          <input onChange={e => setName(e.target.value)} defaultValue={event.name} placeholder='Naam'/>
          <input onChange={e => setLocation(e.target.value)} defaultValue={event.location} placeholder='Location'/>
          <input onChange={e => setDate(e.target.value)} defaultValue={event.date} placeholder='Date'/>
          <input onChange={e => setCredits(e.target.value)} defaultValue={event.credits} placeholder='Credits'/>
          <select onChange={e => setProject(e.target.value)}>
              {projectList}
          </select>
          <input onClick={submit} type='submit' value='Toevoegen'/>
      </div>
    );
}

export default connect(
    null,
    {}
  )(AdminProjectsEventsEdit);