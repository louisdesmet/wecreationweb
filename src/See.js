import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {getActivities, getBusinesses, getAllEvents} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link } from 'react-router-dom';
import Geocode from "react-geocode";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet';
import Nav from "./Nav";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { DateRange } from "react-date-range";
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import locprod, { date as dateFunction } from './Global';
import timeIcon from './img/eventshow/time.png';

import './css/See.scss';
import see from './img/nav/see.png';
import datum from './img/nav/agenda.png';
import evenementen from './img/profile/badges.png';
import get from './img/nav/get.png';
import diensten from './img/map/diensten.png';
import workImage from './img/nav/work.png';
import free from './img/profile/free.png';
import credit from './img/profile/credit.png';
import active from './img/map/filter-active.png';
import nonactive from './img/map/filter-nonactive.png';
import mapFilter from './img/map/map-filter.png';
import close from './img/map/close.png';
import add from './img/eventshow/add.png';
import decline from './img/eventshow/decline.png';


let workIcon = L.icon({
  iconUrl: workImage,
  iconSize: [30, 30],
  popupAnchor: [0, -20],
});
let dienstIcon = L.icon({
  iconUrl: diensten,
  iconSize: [30, 30],
  popupAnchor: [0, -20],
});
let evenementenIcon = L.icon({
  iconUrl: evenementen,
  iconSize: [30, 30],
  popupAnchor: [0, -20],
});
let getIcon = L.icon({
  iconUrl: get,
  iconSize: [30, 30],
  popupAnchor: [0, -20],
});

export const See = ({getBusinesses, getActivities, getAllEvents}) => {

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const notify = () => toast("Gelieve alle velden in te vullen. Afbeelding is niet verplicht.");

  // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
  Geocode.setApiKey("AIzaSyB3hu-a1Gnzog5zG63fnQ8ZaMLghPGUPwI");

  // set response language. Defaults to english.
  Geocode.setLanguage("en");

  // set response region. Its optional.
  // A Geocoding request with region=es (Spain) will return the Spanish city.
  Geocode.setRegion("es");

  const [business, setBusiness] = useState(true);
  const [service, setService] = useState(true);
  const [activity, setActivity] = useState(true);
  const [freeWork, setFreeWork] = useState(true);
  const [paidWork, setPaidWork] = useState(true);

  const [displayMap, setDisplayMap] = useState(true);
  const [displayAddActivity, setDisplayAddActivity] = useState(false);
  const [displayFilters, setDisplayFilters] = useState(window.innerWidth > 1000 ? true : false);

  const [activityLocation, setActivityLocation] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [ticketlink, setTicketlink] = useState("");
  const [file, setFile] = useState(null);

  const [today, setToday] = useState(false);
  const [week, setWeek] = useState(false);
  
  const [position, setPosition] = useState({ lat: parseFloat(51.05), lng: parseFloat(3.71667) });
  const [zoom, setZoom] = useState(13);

  const [searchResults, setSearchResults] = useState(null);

  const [state, setState] = useState([
    {
      startDate: null,
      endDate: new Date(""),
      key: 'selection'
    }
  ]);

  const [imageId, setImageId] = useState("activityImage");
  const [imageURI, setImageURI] = useState(null);

  useEffect(() => {
    getBusinesses();
    getActivities();
    getAllEvents();

    document.getElementsByClassName( 'leaflet-control-attribution' )[0].style.display = 'none';

    function handleResize() {
      if(window.innerWidth > 1000) {
        setDisplayFilters(true);
      } else {
        setDisplayFilters(false);
      }
    }
    window.addEventListener('resize', handleResize);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const businesses = useSelector(state => state.remoteBusinesses);
  const activities = useSelector(state => state.remoteActivities);
  const events = useSelector(state => state.remoteAllEvents);

  const isToday = (someDate) => {
    const today = new Date()
    return someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()
  }

  const WEEK_LENGTH = 604800000;

  function onCurrentWeek(date) {

      var lastMonday = new Date(); // Creating new date object for today
      lastMonday.setDate(lastMonday.getDate() - (lastMonday.getDay()-1)); // Setting date to last monday
      lastMonday.setHours(0,0,0,0); // Setting Hour to 00:00:00:00
      
      const res = lastMonday.getTime() <= date.getTime() && date.getTime() < ( lastMonday.getTime() + WEEK_LENGTH);
      return res; // true / false
  }

  function sameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  }

  const businessMarkers = businesses.data ? businesses.data.filter((business) => {
      return business.type === 'business';
  }).map(business => {
    return <Marker key={business.id} position={[business.lat, business.lng]} icon={getIcon}>
      <Popup className="popup">
        <h2><Link to={"/get/handelaars/" + business.id + "/products"}>{business.name}</Link></h2>
        <p>{business.description}</p>
        <div className="data-container">
          <img src={see} alt=""/>
          <p>{business.location}</p>
        </div>
      </Popup>
    </Marker>
  }) : null;

  const serviceMarkers = businesses.data ? businesses.data.filter((business) => {
      return business.type === 'service';
  }).map(business => {
    return <Marker key={business.id} position={[business.lat, business.lng]} icon={dienstIcon}>
      <Popup className="popup">
        <h2><Link to={"/get/handelaars/" + business.id + "/products"}>{business.name}</Link></h2>
        <p>{business.description}</p>
        <div className="data-container">
          <img src={see} alt=""/>
          <p>{business.location}</p>
        </div>
      </Popup>
    </Marker>
  }) : null;

  const activityMarker = (activity) => <Marker key={activity.id} position={[activity.lat, activity.lng]} icon={evenementenIcon}>
    <Popup className="popup">
      <div className="data-container">
        <img src={(process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/' : 'http://wecreationapi.test/') + "activities/" + activity.image}/>
        <Link to={"/activities/" + activity.id}>{activity.name}</Link>
      </div>
      <div className="data-container">
        <img src={datum} alt=""/>
        <p>{dateFunction(activity.date)}</p>
      </div>
      {
        activity.time ? <div className="data-container">
          <img src={timeIcon} alt=""/>
          <p>{activity.time}</p>
        </div> : null
      }
      <div className="data-container">
        <img src={see} alt=""/>
        <p>{activity.location}</p>
      </div>
    </Popup>
  </Marker>

  const filteredActivityMarkers = (activity) => {
    if(today || week || state[0].startDate) {
      if(today) {
        return isToday(new Date(activity.date)) ? activityMarker(activity) : null
      }
      if(week) {
        return onCurrentWeek(new Date(activity.date)) ? activityMarker(activity) : null
      }
      if(state[0].startDate && state[0].endDate) {
        return new Date(activity.date) > new Date(state[0].startDate) && new Date(activity.date) < new Date(state[0].endDate) ? activityMarker(activity) : null
      }
      if(state[0].startDate) {
        return sameDay(new Date(state[0].startDate), new Date(activity.date)) ? activityMarker(activity) : null
      }
      
    } else {
      return activityMarker(activity)
    }
  }

  const activityMarkers = activities.data ? (activities.data.map(activity =>
    filteredActivityMarkers(activity)
  )) : null;

  if(events.data) {
    events.data.forEach(event => {
      event.skills.forEach(skill => {
        if(skill.paid) {
          event.hasPaid = 1
        }
      })
    })
  }

  const eventMarker = (event) => <Marker key={event.id} position={[event.lat, event.lng]} icon={workIcon}>
    <Popup className="popup" minWidth="280">
      <div className="data-container">
        <img src={(process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/' : 'http://wecreationapi.test/') + "events/" + event.image}/>
        <Link to={"/events/" + event.id}>{event.name}</Link>
      </div>
      <div className="data-container">
        <img src={datum} alt=""/>
        <p>{dateFunction(event.date)}</p>
      </div>
      {
        event.time ? <div className="data-container">
          <img src={timeIcon} alt=""/>
          <p>{event.time}</p>
        </div> : null
      }
      <div className="data-container">
        <img src={see} alt=""/>
        <p>{event.location}</p>
      </div>
    </Popup>
  </Marker>

  const filteredEventMarkers = (event) => {
    if(today || week || state[0].startDate) {
      if(today) {
        return isToday(new Date(event.date)) ? eventMarker(event) : null
      }
      if(week) {
        return onCurrentWeek(new Date(event.date)) ? eventMarker(event) : null
      }
      if(state[0].startDate && state[0].endDate) {
        return new Date(event.date) > new Date(state[0].startDate) && new Date(event.date) < new Date(state[0].endDate) ? eventMarker(event) : null
      }
      if(state[0].startDate) {
        return sameDay(new Date(state[0].startDate), new Date(event.date)) ? eventMarker(event) : null
      }
    } else {
      return eventMarker(event)
    }
  }

  const eventMarkersFree = events.data ? (events.data.map(event =>
    !event.hasPaid ? filteredEventMarkers(event) : null
  )) : null;

  const eventMarkersPaid = events.data ? (events.data.map(event =>
    event.hasPaid ? filteredEventMarkers(event) : null
  )) : null;

  function clickDay() {
    setWeek(false);
    setToday(today ? false : true);
    setState([
      {
        startDate: null,
        endDate: new Date(""),
        key: 'selection'
      }
    ]);
  } 

  function clickWeek() {
    setToday(false);
    setWeek(week ? false : true);
    setState([
      {
        startDate: null,
        endDate: new Date(""),
        key: 'selection'
      }
    ]);
  }

  function clickDaterange(selection) {
    setState([selection]);
    setToday(false);
    setWeek(false);
  }

  function showFilters() {
    setDisplayFilters(true);
    setDisplayMap(false);
  }

  function showMap() {
    setDisplayFilters(false);
    setDisplayMap(true);
  }

  function switchToActivity() {
    setDisplayMap(false);
    setDisplayFilters(false);
    setDisplayAddActivity(true);
  }

  function switchToMap() {
    setDisplayMap(true);
    setDisplayFilters(window.innerWidth > 1000 ? true : false);
    setDisplayAddActivity(false);
    setLat("");
    setLng("");
    setActivityLocation("");
    setFile(null);
    setImageURI(null);
  }

  function searchAddress(address) {
    Geocode.fromAddress(address).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setLat(lat);
        setLng(lng);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  const formData = new FormData();
  const imageHandler = (e) => {
    if(e.target.files && e.target.files[0]){
      let reader = new FileReader();
      reader.onload = function(ev) {
        setImageURI(ev.target.result)
      };
      reader.readAsDataURL(e.target.files[0]);
    }
    setFile(e.target.files[0]);
  }

  function sendActivity() {
    if(name && date && activityLocation && lat && lng) {

      formData.append('name', name);
      formData.append('desc', desc);
      formData.append('date', date);
      formData.append('time', time);
      formData.append('ticketlink', ticketlink);
      formData.append('location', activityLocation);
      formData.append('lat', lat);
      formData.append('lng', lng);
      formData.append('user', loggedUser.id);

      if(file) {
        formData.append('image', file);
      }
      
      fetch(locprod + '/activities', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'multipart/form-data',
          'Authorization': 'Bearer ' + localStorage.getItem("token")
        },
      }).then(response => {
        getActivities();
        setDisplayAddActivity(false);
        setDisplayMap(true);
        setDisplayFilters(window.innerWidth > 1000 ? true : false);
      })
      .catch(error => {
      
      });
    } else {
      notify();
    }
    
  }

  function searchItem(query) {
    const foundActivities = activities.data.filter((activity) => {
      const name = activity.name.toLowerCase();
      activity.type = "activity";
      return name.includes(query) && query !== "";
    });
    const foundBusinesses = businesses.data.filter((business) => {
      const name = business.name.toLowerCase();
      return business.type === "business" && name.includes(query) && query !== "";
    });
    const foundServices = businesses.data.filter((business) => {
      const name = business.name.toLowerCase();
      return business.type === "service" && name.includes(query) && query !== "";
    });
    const foundEvents = events.data.filter((event) => {
      const name = event.name.toLowerCase();
      event.type = "event";
      return name.includes(query) && query !== "";
    });

    const result = foundActivities.concat(foundBusinesses, foundServices, foundEvents);
    setSearchResults(result);
  }

  function clickResult(result) {
    setPosition({lat: parseFloat(result.lat), lng: parseFloat(result.lng)});
    setZoom(18);
  }

  function findIcon(type) {
    switch(type) {
      case "activity": return evenementen;
      break;
      case "business": return get;
      break;
      case "service": return diensten;
      break;
      case "event": return workImage;
      break;
    }
  }

  function buildImgTag() {
    let imgTag = null;
    if (imageURI !== null)
      imgTag = (
        <img className="thumbnail" src={imageURI}></img>
      );
    return imgTag;
  }

  const imgTag = buildImgTag();

  return (
    <div className="map-container">
      <Nav/>
      <div className="container">
        <div className="add-activity" onClick={e => displayMap ? switchToActivity() : switchToMap()}>{displayAddActivity ? "Annuleren" : "Activiteit toevoegen" }<img src={displayAddActivity ? decline : add} alt=""/></div>
        { !displayFilters && !displayAddActivity ? <img onClick={() => {showFilters()}} className="map-filter" src={mapFilter} alt=""/> : null }
        {
          displayFilters ? <div className="filters">
            <img onClick={() => {showMap()}} className="close" src={close} alt=""/>
            <input onChange={e => searchItem(e.target.value)} type="text" placeholder="Zoeken..."/>
            <div className="searchResults">
              {
                searchResults ? searchResults.map(result => <div key={result.type + result.id} onClick={e => clickResult(result)}><img src={findIcon(result.type)} alt=""/><span>{result.name}</span></div>) : null
              }
            </div>
            <div className="time">
              <div className={today ? "on" : ""} onClick={() => clickDay()}>Vandaag</div>
              <div className={week ? "on" : ""} onClick={() => clickWeek()}>Deze week</div>
            </div>
            <DateRange
              onChange={item => clickDaterange(item.selection)}
              ranges={state}
            />
            <h2>Filters</h2>
            <div className="categories">
              <div>
                <img src={evenementen} alt=""/>
                <p>Evenementen</p>
              </div>
              <img onClick={() => setActivity(!activity)} className="switch" src={activity ? active : nonactive} alt=""/>
            </div>
            <div className="categories">
              <div>
                <img src={get} alt=""/>
                <p>Handelaars</p>
              </div>
              <img onClick={() => setBusiness(!business)} className="switch" src={business ? active: nonactive} alt=""/>
            </div>
            <div className="categories">
              <div>
                <img src={diensten} alt=""/>
                <p>Diensten</p>
              </div>
              <img onClick={() => setService(!service)} className="switch" src={service ? active : nonactive} alt=""/>
            </div>
            <div className="categories">
              <div>
                <img src={free} alt=""/>
                <p>Vrijwillig werk</p>
              </div>
              <img onClick={() => setFreeWork(!freeWork)} className="switch" src={freeWork ? active : nonactive} alt=""/>
            </div>
            <div className="categories">
              <div>
                <img src={credit} alt=""/>
                <p>Credit werk</p>
              </div>
              <img onClick={() => setPaidWork(!paidWork)} className="switch" src={paidWork ? active : nonactive} alt=""/>
            </div>
          </div> : null
        }
        {
          displayMap ? <MapContainer className="map" center={position} zoom={zoom}>
            <ChangeView center={position} zoom={zoom} /> 
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
       
            <MarkerClusterGroup>
              { business ? businessMarkers : null}
              { service ? serviceMarkers : null}
              { activity ? activityMarkers : null}
              { freeWork ? eventMarkersFree : null}
              { paidWork ? eventMarkersPaid : null}
            </MarkerClusterGroup>
          </MapContainer> : null
        }
        {
          displayAddActivity ? <div className="add-activity-panel">
            <div>
              <label>Naam:</label>
              <input onChange={e => setName(e.target.value)} placeholder='Naam'/>
              <label>Beschrijving: (optioneel)</label>
              <textarea onChange={e => setDesc(e.target.value)} placeholder='Beschrijving'></textarea>
              <label>Datum:</label>
              <input className="date" type="date" onChange={e => setDate(e.target.value)}/>
              <label>Tijdstip: (optioneel)</label>
              <input type='time' onChange={e => setTime(e.target.value)} placeholder='Tijdstip'/>
              <label>Link ticketverdeler (optioneel)</label>
              <input onChange={e => setTicketlink(e.target.value)} placeholder='Link ticketverdeler'/>
            </div>
            <div>
              <label htmlFor={imageId}>Afbeelding: (optioneel)</label>
              <input id={imageId} type="file" name="image" accept="application/image" multiple={false} onChange={imageHandler}/>
              {imgTag}
              <label>Locatie:</label>
              <input onChange={e => setActivityLocation(e.target.value)} placeholder='Locatie'/>
              <button onClick={e => searchAddress(activityLocation)}>Zoeken</button>
              {
                lat && lng ? <MapContainer className="map-activity" center={[lat, lng]} zoom={18}>
                  <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                </MapContainer> : null
              }
              <div className="submit" onClick={e => sendActivity()}>Activiteit toevoegen<img src={add} alt=""/></div>
            </div>
          </div> : null
        }
        
        
      </div>
      <ToastContainer />
    </div>
  );
}

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default connect(
  null,
  {getBusinesses, getActivities, getAllEvents}
)(See);