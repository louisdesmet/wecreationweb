import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {useSelector} from "react-redux";
import { Link, useParams } from 'react-router-dom';
import locprod from './Global';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export const AdminProjectsEventsEdit = ({}) => {

    const events = useSelector(state => state.remoteAllEvents);
    const projects = useSelector(state => state.remoteProjects);

    const { id } = useParams();
    const event = events.data ? events.data.find(event => event.id === parseInt(id)) : null;

    const [name, setName] = useState(event.name);
    const [location, setLocation] = useState(event.location);
    const [date, setDate] = useState(new Date(event.date));
    const [credits, setCredits] = useState(event.credits);
    const [project, setProject] = useState(event.project.id);

    function format(date) {
      const jsDate = new Date(date);
      return jsDate.getFullYear()+'-'+(jsDate.getMonth()+1)+'-'+jsDate.getDate()+' '+jsDate.getHours()+':'+jsDate.getMinutes()+':'+jsDate.getSeconds();
  }
    
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
            date: format(date),
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
          <DatePicker selected={date} onChange={(date) => setDate(date)} />
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