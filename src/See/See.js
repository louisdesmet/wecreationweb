import React, {useEffect, useState} from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import Nav from "../Nav";
import MarkerClusterGroup from 'react-leaflet-markercluster';

import '../css/See.scss';
import mapFilter from '../img/map/map-filter.png';
import add from '../img/eventshow/add.png';
import decline from '../img/eventshow/decline.png';
import Filters from "./components/Filters";
import EventMarker from "./components/EventMarker";
import BusinessMarker from "./components/BusinessMarker";
import ServiceMarker from "./components/ServiceMarker";
import ActivityMarker from "./components/ActivityMarker";
import CreateActivity from "./components/CreateActivity";

function See(props) {

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const notify = () => toast("Gelieve alle velden in te vullen. Afbeelding is niet verplicht.");
  const notifyRegister = () => toast("Voor deze actie heb je een account nodig.");

  const [business, setBusiness] = useState(true);
  const [service, setService] = useState(true);
  const [activity, setActivity] = useState(true);
  const [place, setPlace] = useState(true);
  const [freeWork, setFreeWork] = useState(true);
  const [paidWork, setPaidWork] = useState(true);

  const [displayMap, setDisplayMap] = useState(true);//
  const [displayAddActivity, setDisplayAddActivity] = useState(false);
  const [displayFilters, setDisplayFilters] = useState(window.innerWidth > 1000 ? true : false);//

  const [today, setToday] = useState(false);
  const [week, setWeek] = useState(false);
  
  const [position, setPosition] = useState({ lat: parseFloat(51.05), lng: parseFloat(3.71667) });
  const [zoom, setZoom] = useState(13);

  const [state, setState] = useState([
    {
      startDate: null,
      endDate: new Date(""),
      key: 'selection'
    }
  ]);

  useEffect(() => {
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

  const businessMarkers = props.businesses.data.filter((business) => {
      return business.type === 'business';
  }).map(business => {
    return <BusinessMarker business={business}/>
  });

  const serviceMarkers = props.businesses.data.filter((business) => {
      return business.type === 'service';
  }).map(business => {
    return <ServiceMarker business={business}/>
  });

  props.events.data.forEach(event => {
    event.skills.forEach(skill => {
      if(skill.paid) {
        event.hasPaid = 1
      }
    })
  })

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
  }

  function addActivity() {
    if(loggedUser) {
      if(displayMap) {
        switchToActivity()
      } else {
        switchToMap();
      }
    } else {
      notifyRegister();
    }
    
  }

  return (
    <div className="map-container">
      <Nav/>
      <div className="container">
        <div className="add-activity" onClick={e => addActivity()}>{displayAddActivity ? "Annuleren" : "Locatie toevoegen" }<img src={displayAddActivity ? decline : add} alt=""/></div>
        { !displayFilters && !displayAddActivity ? <img onClick={() => {showFilters()}} className="map-filter" src={mapFilter} alt=""/> : null }
        <Filters
          displayFilters={displayFilters}
          showMap={() => showMap()}

          activities={props.activities} businesses={props.businesses} events={props.events}

          activity={activity} setActivity={(param) => setActivity(param)}
          place={place} setPlace={(param) => setPlace(param)}
          business={business} setBusiness={(param) => setBusiness(param)}
          service={service} setService={(param) => setService(param)}
          freeWork={freeWork} setFreeWork={(param) => setFreeWork(param)}
          paidWork={paidWork} setPaidWork={(param) => setPaidWork(param)}
          today={today} setToday={(param) => setToday(param)}
          week={week} setWeek={(param) => setWeek(param)}
          state={state} setState={(param) => setState(param)}
          setPosition={(param) => setPosition(param)} 
          setZoom={(param) => setZoom(param)}
        />
        {
          displayMap ? <MapContainer className="map" center={position} zoom={zoom}>
            <ChangeView center={position} zoom={zoom} /> 
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
       
            <MarkerClusterGroup>
              { business ? businessMarkers : null }
              { service ? serviceMarkers : null }
              { activity || place ? <ActivityMarker activities={props.activities} activity={activity} place={place} today={today} week={week} state={state}/> : null }
              { freeWork ? <EventMarker events={props.events} paid={false} event={freeWork} today={today} week={week} state={state}/> : null }
              { paidWork ? <EventMarker events={props.events} paid={true} event={paidWork} today={today} week={week} state={state}/> : null }
            </MarkerClusterGroup>
          </MapContainer> : null
        }  
        <CreateActivity 
          reloadActivities={() => props.reloadActivities()}
          displayAddActivity={displayAddActivity} 
          setDisplayAddActivity={(param) => setDisplayAddActivity(param)}
          setDisplayMap={(param) => setDisplayMap(param)}
          setDisplayFilters={(param) => setDisplayFilters(param)}
          notify={() => notify()}
        /> 
      </div>
      <ToastContainer/>
    </div>
  );
}

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default See;