import React, { useState } from "react";
import locprod from '../../Global';
import Geocode from "react-geocode";
import { MapContainer, TileLayer } from 'react-leaflet';

import add from '../../img/eventshow/add.png';

function CreateActivity(props) {

    // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
    Geocode.setApiKey("AIzaSyB3hu-a1Gnzog5zG63fnQ8ZaMLghPGUPwI");

    // set response language. Defaults to english.
    Geocode.setLanguage("en");

    // set response region. Its optional.
    // A Geocoding request with region=es (Spain) will return the Spanish city.
    Geocode.setRegion("es");

    const loggedUser = JSON.parse(localStorage.getItem("user"));

    const [activityLocation, setActivityLocation] = useState("");
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState("");
    const [ticketlink, setTicketlink] = useState("");
    const [file, setFile] = useState(null);

    const [imageId, setImageId] = useState("activityImage");
    const [imageURI, setImageURI] = useState(null);
  
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
                setLat("");
                setLng("");
                setActivityLocation("");
                setFile(null);
                setImageURI(null);
                props.setDisplayAddActivity(false);
                props.setDisplayMap(true);
                props.setDisplayFilters(window.innerWidth > 1000 ? true : false);
                props.reloadActivities();
            })
            .catch(error => {
            
            });
        } else {
            props.notify();
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

    return (
        props.displayAddActivity ? <div className="add-activity-panel">
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
    );
}

export default CreateActivity;
