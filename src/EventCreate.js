import React, {useEffect, useState} from 'react';
import {connect, useSelector} from "react-redux";
import { getProjects, getSkills } from './redux/actions';
import { Link, useParams } from 'react-router-dom';
import locprod from './Global';
import './css/EventCreate.scss';
import { MapContainer, TileLayer } from 'react-leaflet'
import Nav from './Nav';
import Geocode from "react-geocode";

import work from './img/nav/work.png';
import agenda from './img/nav/agenda.png';
import timeIcon from './img/eventshow/time.png';
import see from './img/nav/see.png';
import free from './img/profile/free.png';
import skill from './img/profile/skill.png';

import add from './img/eventshow/add.png';

export const EventCreate = ({getProjects, getSkills}) => {

  // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
  Geocode.setApiKey("AIzaSyB3hu-a1Gnzog5zG63fnQ8ZaMLghPGUPwI");

  // set response language. Defaults to english.
  Geocode.setLanguage("en");

  // set response region. Its optional.
  // A Geocoding request with region=es (Spain) will return the Spanish city.
  Geocode.setRegion("es");

  useEffect(() => {
    getProjects();
    getSkills();
  }, []);

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [file, setFile] = useState(null);

  const [freeAmount, setFreeAmount] = useState(1);
  const [paidAmount, setPaidAmount] = useState(1);

  const [freeData, setFreeData] = useState([]);
  const [paidData, setPaidData] = useState([]);

  const { id, eventId } = useParams();

  const projects = useSelector(state => state.remoteProjects);
  const skills = useSelector(state => state.remoteSkills);

  


  const project = projects.data ? projects.data.find(project => project.id === parseInt(id)) : null;
  let event = null;
  if(project) {
    event = project.events.find(event => event.id === parseInt(eventId));
    if(event && lng === "") {
      setName(event.name);
      setDesc(event.description);
      setDate(event.date);
      setTime(event.time);
      setLocation(event.location);
      setLat(event.lat);
      setLng(event.lng);
      if(event.skills && event.skills.length) {

        let filteredFree = event.skills.filter(skill => skill.paid === 0);
        let filteredPaid = event.skills.filter(skill => skill.paid === 1);

        setFreeAmount(filteredFree.length);
        setPaidAmount(filteredPaid.length);
        
        let tempFree = [];
        let tempPaid = [];

        filteredFree.forEach((skill, index) => {
          tempFree[index] = {};
          tempFree[index]["hours"] = skill.hours;
          tempFree[index]["amount"] = skill.amount;
          tempFree[index]["skill"] = skill.skill.id;
          tempFree[index]["eventSkill"] = skill.id;
        })
        setFreeData(tempFree);

        filteredPaid.forEach((skill, index) => {
          tempPaid[index] = {};
          tempPaid[index]["hours"] = skill.hours;
          tempPaid[index]["amount"] = skill.amount;
          tempPaid[index]["skill"] = skill.skill.id;
          tempPaid[index]["credits"] = skill.credits
          tempPaid[index]["eventSkill"] = skill.id;
        })
        setPaidData(tempPaid);

      } else {
        setFreeAmount(1);
        setPaidAmount(1);
      }
    }
  }

  const formData = new FormData();
  const imageHandler = (event) => {
    setFile(event.target.files[0]);
  }

  function submit(e) {
    e.preventDefault();
    if(name && desc && date && time && location && lat && lng) {
      formData.append('name', name);
      formData.append('desc', desc);
      formData.append('date', date);
      formData.append('time', time);
      formData.append('location', location);
      formData.append('lat', lat);
      formData.append('lng', lng);
      formData.append('project', project.id);
      formData.append('freeData', JSON.stringify(freeData));
      formData.append('paidData', JSON.stringify(paidData));
      formData.append('image', file);

      if(event) {
        fetch(locprod + '/events/' + event.id, {
          method: 'PUT',
          body: JSON.stringify({
            name: name,
            desc: desc,
            date: date,
            time: time,
            location: location,
            lat: lat,
            lng: lng,
            freeData: freeData,
            paidData: paidData,
          }),
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem("token")
          },
        }).then(response => window.location.href = '/projects/' + project.id)
        .catch(error => {
        
        });
      } else {
        fetch(locprod + '/events', {
          method: 'POST',
          body: formData,
          headers: {
              'Accept': 'multipart/form-data',
              'Authorization': 'Bearer ' + localStorage.getItem("token")
          },
        }).then(response => window.location.href = '/projects/' + project.id)
        .catch(error => {
        
        });
      }
      
      
    }
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

  
  function searchAddress(address) {
    Geocode.fromAddress(address).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setLat(lat);
        setLng(lng);
      },
      (error) => {
      }
    );
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
        <input defaultValue={event && event.name ? event.name : ""} className='naam' onChange={e => setName(e.target.value)} placeholder='Naam'/>
        <textarea defaultValue={event && event.description ? event.description : ""} onChange={e => setDesc(e.target.value)} placeholder='Omschrijving'></textarea>
        <label>Afbeelding</label>
        {
          event && event.image ? <img className="event-logo"  src={(process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/' : 'http://wecreationapi.test/') + "events/" + event.image}/> : null
        }
        <input type="file" name="image" accept="application/image" multiple={false} onChange={imageHandler}/>
        <div className='input-image'>
          <img src={agenda} alt=""/>
          <input defaultValue={event && event.date ?  new Date(event.date).toISOString().substr(0,10) : ""} type="date" onChange={e => setDate(e.target.value)}/>
        </div>
        <div className='input-image'>
          <img src={timeIcon} alt=""/>
          <input defaultValue={event && event.time ?  event.time : ""} type='time' onChange={e => setTime(e.target.value)} placeholder='Tijdstip'/>
        </div>
        <div className='input-image'>
          <img src={see} alt=""/>
          <input defaultValue={event && event.location ?  event.location : ""} onChange={e => setLocation(e.target.value)} placeholder='Locatie'/>
          <span onClick={e => searchAddress(location)}>Zoeken</span>
        </div>
        <MapContainer className="map" center={[lat, lng]} zoom={18}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
        <h2><img src={work} alt=""/>Team</h2>
        <h2 className='hours'><img src={free} alt=""/>Vrijwilliger uren</h2>
        {
          [...Array(freeAmount)].map((el, index) =>
          <div key={index} className='input-data'>
            {
              event && freeData.length && freeData[index] && freeData[index].skill ?  <select defaultValue={freeData[index].skill} onChange={e => AddToFree(index, 'skill', e.target.value)}>
                  <option>Kies een functie</option>
                  {skillList}
              </select> : null
            }
            {
              !freeData[index] || !freeData[index].skill ? <select onChange={e => AddToFree(index, 'skill', e.target.value)}>
                  <option>Kies een functie</option>
                  {skillList}
              </select> : null
            }
            <input defaultValue={event && freeData.length && freeData[index] ? freeData[index].amount : ""} placeholder='Aantal werknemers' onChange={e => AddToFree(index, 'amount', e.target.value)}/>
            <input defaultValue={event && freeData.length && freeData[index] ? freeData[index].hours : ""} placeholder='Aantal uren per werknemer' onChange={e => AddToFree(index, 'hours', e.target.value)}/>
          </div>
          )
        }
        <h2 className='new' onClick={e => setFreeAmount(freeAmount + 1)}><img src={add} alt=""/>Nieuwe functie</h2>
        <h2 className='hours'><img src={skill} alt=""/>Skill uren</h2>
        {
          [...Array(paidAmount)].map((el, index) =>
            <div key={index} className='input-data'>
              {
                event && paidData.length && paidData[index] && paidData[index].skill ?  <select defaultValue={paidData[index].skill} onChange={e => AddToPaid(index, 'skill', e.target.value)}>
                    <option>Kies een functie</option>
                    {skillList}
                </select> : null
              }
              {
                !paidData[index] || !paidData[index].skill ? <select onChange={e => AddToPaid(index, 'skill', e.target.value)}>
                    <option>Kies een functie</option>
                    {skillList}
                </select> : null
              }
 
              <input defaultValue={event && paidData.length && paidData[index] ? paidData[index].amount : ""} placeholder='Aantal werknemers' onChange={e => AddToPaid(index, 'amount', e.target.value)}/>
              <input defaultValue={event && paidData.length && paidData[index] ? paidData[index].hours : ""} placeholder='Aantal uren per werknemer' onChange={e => AddToPaid(index, 'hours', e.target.value)}/>
              <input defaultValue={event && paidData.length && paidData[index] ? paidData[index].credits : ""} placeholder='Credits per medewerker' onChange={e => AddToPaid(index, 'credits', e.target.value)}/>
            </div>
          )
        }
        <h2 className='new' onClick={e => setPaidAmount(paidAmount + 1)}><img src={add} alt=""/>Nieuwe functie</h2>
        <button onClick={e => submit(e)}>Event aanmaken</button>
      </div>
    </div>
  );
}

export default connect(
    null,
    {getProjects, getSkills}
)(EventCreate);