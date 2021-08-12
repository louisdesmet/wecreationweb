import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getProjects} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link } from 'react-router-dom';
import locprod from './Global';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from 'react-time-picker';
import './css/Admin.scss';

export const AdminProjectsEventsCreate = ({getProjects}) => {

    useEffect(() => {
      getProjects();
    }, []);

    const projects = useSelector(state => state.remoteProjects);

    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState(new Date());
    const [credits, setCredits] = useState("");
    const [project, setProject] = useState("");
    const [time, setTime] = useState('10:00');

    function format(date) {
        const jsDate = new Date(date);
        return jsDate.getFullYear()+'-'+(jsDate.getMonth()+1)+'-'+jsDate.getDate()+' '+jsDate.getHours()+':'+jsDate.getMinutes()+':'+jsDate.getSeconds();
    }
    
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
            date: format(date),
            time: time,
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
          <DatePicker selected={date} onChange={(date) => setDate(date)}/>
          <input type="time" onChange={(date) => setTime(date)}/>
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