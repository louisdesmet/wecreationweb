import React, {useEffect, useState} from 'react';
import {connect, useSelector} from "react-redux";
import { getProjects, getSkills } from './redux/actions';
import { Link, useParams } from 'react-router-dom';
import locprod from './Global';
import './css/EventCreate.scss';
import Nav from './Nav';

import work from './img/nav/work.png';
import agenda from './img/nav/agenda.png';
import timeIcon from './img/eventshow/time.png';
import see from './img/nav/see.png';
import free from './img/profile/free.png';
import skill from './img/profile/skill.png';

import add from './img/eventshow/add.png';

export const EventCreate = ({getProjects, getSkills}) => {

    useEffect(() => {
      getProjects();
      getSkills();
    }, []);

    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [location, setLocation] = useState("");

    const [freeAmount, setFreeAmount] = useState(1);
    const [paidAmount, setPaidAmount] = useState(1);

    const [freeData, setFreeData] = useState([]);
    const [paidData, setPaidData] = useState([]);

    const { id } = useParams();

    const projects = useSelector(state => state.remoteProjects);
    const skills = useSelector(state => state.remoteSkills);

    const project = projects.data ? projects.data.find(project => project.id === parseInt(id)) : null;

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
            desc: desc,
            date: date,
            time: time,
            location: location,
            project: project.id,
            freeData: freeData,
            paidData: paidData
          })
        }).then(response => {
          window.location.href = '/projects/' + project.id;
        })
    }

    function AddToFree(index, field, value) {
      const temp = freeData;
      if(!temp[index]) {
        temp[index] = {};
      }
      temp[index][field] = value;
      setFreeData(temp);
    }

    function AddToPaid(index, field, value) {
      const temp = paidData;
      if(!temp[index]) {
        temp[index] = {};
      }
      temp[index][field] = value;
      setPaidData(temp);
    }

    const skillList =  skills.data ? skills.data.map(skill => <option key={skill.id} value={skill.id}>{skill.name}</option>) : null;
    return (
      <div className="height100">
        <Nav/>
        <div className="event-create">
          {
            project ? <h2 className="event-title"><span>{project.name}</span></h2> : null
          }
          <h2><img src={work} alt=""/>Event beschrijving</h2>
          <input className='naam' onChange={e => setName(e.target.value)} placeholder='Naam'/>
          <textarea onChange={e => setDesc(e.target.value)} placeholder='Omschrijving'></textarea>
          <div className='input-image'>
            <img src={agenda} alt=""/>
            <input type="date" onChange={e => setDate(e.target.value)}/>
          </div>
          <div className='input-image'>
            <img src={timeIcon} alt=""/>
            <input onChange={e => setTime(e.target.value)} placeholder='Tijdstip'/>
          </div>
          <div className='input-image'>
            <img src={see} alt=""/>
            <input onChange={e => setLocation(e.target.value)} placeholder='Locatie'/>
          </div>
          <h2><img src={work} alt=""/>Team</h2>
          <h2 className='hours'><img src={free} alt=""/>Vrijwilliger uren</h2>

          {
            [...Array(freeAmount)].map((el, index) =>
            <div className='input-data'>
              <select onChange={e => AddToFree(index, 'skill', e.target.value)}>
                  <option>Kies een functie</option>
                  {skillList}
              </select>
              <input placeholder='Aantal werknemers' onChange={e => AddToFree(index, 'amount', e.target.value)}/>
              <input placeholder='Aantal uren per werknemer' onChange={e => AddToFree(index, 'hours', e.target.value)}/>
            </div>
            )
          }
          <h2 className='new' onClick={e => setFreeAmount(freeAmount + 1)}><img src={add} alt=""/>Nieuwe functie</h2>
          <h2 className='hours'><img src={skill} alt=""/>Skill uren</h2>
          {
            [...Array(paidAmount)].map((el, index) =>
              <div className='input-data'>
                <select onChange={e => AddToPaid(index, 'skill', e.target.value)}>
                    <option>Kies een functie</option>
                    {skillList}
                </select>
                <input placeholder='Aantal werknemers' onChange={e => AddToPaid(index, 'amount', e.target.value)}/>
                <input placeholder='Aantal uren per werknemer' onChange={e => AddToPaid(index, 'hours', e.target.value)}/>
                <input placeholder='Credits per medewerker' onChange={e => AddToPaid(index, 'credits', e.target.value)}/>
              </div>
            )
          }
          <h2 className='new' onClick={e => setPaidAmount(paidAmount + 1)}><img src={add} alt=""/>Nieuwe functie</h2>
          <button onClick={e => submit()}>Event aanmaken</button>
        </div>
      </div>
    );
}

export default connect(
    null,
    {getProjects, getSkills}
)(EventCreate);