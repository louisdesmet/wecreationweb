import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getUsers} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link } from 'react-router-dom';
import './css/Admin.scss';

import locprod from './Global';

import Geocode from "react-geocode";

// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey("AIzaSyAeL1_SHoc_Hq_PmVrYfhWcici2i08J2vM");

// set response language. Defaults to english.
Geocode.setLanguage("en");

// set response region. Its optional.
// A Geocoding request with region=es (Spain) will return the Spanish city.
Geocode.setRegion("es");

// set location_type filter . Its optional.
// google geocoder returns more that one address for given lat/lng.
// In some case we need one address as response for which google itself provides a location_type filter.
// So we can easily parse the result for fetching address components
// ROOFTOP, RANGE_INTERPOLATED, GEOMETRIC_CENTER, APPROXIMATE are the accepted values.
// And according to the below google docs in description, ROOFTOP param returns the most accurate result.
Geocode.setLocationType("ROOFTOP");

// Enable or disable logs. Its optional.
Geocode.enableDebug();

// Get address from latitude & longitude.
/*Geocode.fromLatLng("48.8583701", "2.2922926").then(
  (response) => {
    const address = response.results[0].formatted_address;
    console.log(address);
  },
  (error) => {
    console.error(error);
  }
);*/

// Get formatted address, city, state, country from latitude & longitude when
// Geocode.setLocationType("ROOFTOP") enabled
// the below parser will work for most of the countries
/*Geocode.fromLatLng("48.8583701", "2.2922926").then(
  (response) => {
    const address = response.results[0].formatted_address;
    let city, state, country;
    for (let i = 0; i < response.results[0].address_components.length; i++) {
      for (let j = 0; j < response.results[0].address_components[i].types.length; j++) {
        switch (response.results[0].address_components[i].types[j]) {
          case "locality":
            city = response.results[0].address_components[i].long_name;
            break;
          case "administrative_area_level_1":
            state = response.results[0].address_components[i].long_name;
            break;
          case "country":
            country = response.results[0].address_components[i].long_name;
            break;
        }
      }
    }
    console.log(city, state, country);
    console.log(address);
  },
  (error) => {
    console.error(error);
  }
);*/

// Get latitude & longitude from address.
/*Geocode.fromAddress("Eiffel Tower").then(
  (response) => {
    const { lat, lng } = response.results[0].geometry.location;
    console.log(lat, lng);
  },
  (error) => {
    console.error(error);
  }
);*/



export const AdminBusinessesCreate = ({getUsers}) => {

    useEffect(() => {
      getUsers();
    }, []);

    const users = useSelector(state => state.remoteUsers);

    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [credits, setCredits] = useState("");

    
    function submit() {
        fetch(locprod + '/businesses', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
          },
          body: JSON.stringify({
            name: name,
            type: type,
            description: description,
            location: location,
            lat: lat,
            lng: lng,
            credits: credits
          })
        }).then(response => {
          window.location.href = '/admin-businesses';
        })
    }

    const userList =  users.data ? users.data.map(user => <option key={user.id} value={user.id}>{user.name}</option>) : null;

    return (
      <div className='create'>
          <h2>Handelaar aanmaken</h2>
          <input onChange={e => setName(e.target.value)} placeholder='Naam'/>
          <input onChange={e => setType(e.target.value)} placeholder='Type'/>
          <input onChange={e => setDescription(e.target.value)} placeholder='Description'/>
          <input onChange={e => setLocation(e.target.value)} placeholder='Location'/>
          <input onChange={e => setLat(e.target.value)} placeholder='Latitude'/>
          <input onChange={e => setLng(e.target.value)} placeholder='Longitude'/>
          <input onChange={e => setCredits(e.target.value)} placeholder='Credits'/>
          <input onClick={submit} type='submit' value='Toevoegen'/>
      </div>
    );
}

export default connect(
    null,
    {getUsers}
  )(AdminBusinessesCreate);