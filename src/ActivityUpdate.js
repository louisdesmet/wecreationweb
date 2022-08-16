import React, {useState} from 'react';
import { useParams } from 'react-router-dom';
import locprod from './Global';
import './css/EventCreate.scss';
import { MapContainer, TileLayer } from 'react-leaflet'
import Nav from './Nav';
import Geocode from "react-geocode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import work from './img/nav/work.png';
import agenda from './img/nav/agenda.png';
import timeIcon from './img/eventshow/time.png';
import see from './img/nav/see.png';
function ActivityUpdate(props) {

  // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
  Geocode.setApiKey("AIzaSyB3hu-a1Gnzog5zG63fnQ8ZaMLghPGUPwI");

  // set response language. Defaults to english.
  Geocode.setLanguage("en");

  // set response region. Its optional.
  // A Geocoding request with region=es (Spain) will return the Spanish city.
  Geocode.setRegion("es");

  const notify = () => toast("Gelieve alle verplichte velden in te vullen");

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [file, setFile] = useState(null);

  const { id } = useParams();

  const activity = props.activities.data.find(activity => activity.id === parseInt(id));

  if(activity && lng === "") {
    setName(activity.name);
    setDesc(activity.description);
    setDate(activity.date);
    setTime(activity.time);
    setLocation(activity.location);
    setLat(activity.lat);
    setLng(activity.lng);
  }

  const formData = new FormData();
  const imageHandler = (event) => {
    setFile(event.target.files[0]);
  }

  function submit(e) {
    e.preventDefault();
    if(name && desc && date && time && location && lat && lng) {
      if(file) {
        formData.append('image', file);
      }
      if(activity) {
        formData.append('activityid', activity.id);
        fetch(locprod + '/activities/' + activity.id, {
          method: 'PUT',
          body: JSON.stringify({
            name: name,
            desc: desc,
            date: date,
            time: time,
            location: location,
            lat: lat,
            lng: lng,
            user: JSON.parse(localStorage.getItem("user")).id
          }),
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem("token")
          },
        }).then(response => {
          fetch(locprod + '/activities/image', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'multipart/form-data',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
          }).then(response => window.location.href = '/activities/' + activity.id)
          .catch(error => {
          
          });
        })
        .catch(error => {
        
        });
      }
    } else {
      notify();
    }
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

  function setLocationFunction(value) {
    setLat(null);
    setLng(null);
    setLocation(value);
  }
  return (
    <div className="height100">
      <Nav/>
      <div className="event-create">
        {
          activity ? <h2 className="event-title"><span>{activity.name}</span></h2> : null
        }
        <h2><img src={work} alt=""/>Activiteit beschrijving</h2>
        <input defaultValue={activity && activity.name ? activity.name : ""} className='naam' onChange={e => setName(e.target.value)} placeholder='Naam'/>
        <textarea defaultValue={activity && activity.description ? activity.description : ""} onChange={e => setDesc(e.target.value)} placeholder='Omschrijving'></textarea>
        <label>Afbeelding (optioneel)</label>
        {
          activity && activity.image ? <img className="event-logo"  src={(process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/' : 'http://wecreationapi.test/') + "activities/" + activity.image}/> : null
        }
        <input type="file" name="image" accept="application/image" multiple={false} onChange={imageHandler}/>
        <div className='input-image'>
          <img src={agenda} alt=""/>
          <input defaultValue={activity && activity.date ?  new Date(activity.date).toISOString().substr(0,10) : ""} type="date" onChange={e => setDate(e.target.value)}/>
        </div>
        <div className='input-image'>
          <img src={timeIcon} alt=""/>
          <input defaultValue={activity && activity.time ?  activity.time : ""} type='time' onChange={e => setTime(e.target.value)} placeholder='Tijdstip'/>
        </div>
        <div className='input-image'>
          <img src={see} alt=""/>
          <input defaultValue={activity && activity.location ?  activity.location : ""} onChange={e => setLocationFunction(e.target.value)} placeholder='Locatie'/>
          <span onClick={e => searchAddress(location)}>Zoeken</span>
        </div>
        {
          lat && lng ? <MapContainer className="map" center={[lat, lng]} zoom={18}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </MapContainer> : null
        }
        <button onClick={e => submit(e)}>Activiteit aanmaken</button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ActivityUpdate;