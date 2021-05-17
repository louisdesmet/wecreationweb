import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getActivities} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link } from 'react-router-dom';
import locprod from './Global';

export const AdminActivitiesCreate = ({getUsers}) => {

    useEffect(() => {
      getActivities();
    }, []);

    const users = useSelector(state => state.remoteActivities);

    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    
    function submit() {
        fetch(locprod + '/activities', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
          },
          body: JSON.stringify({
            name: name,
            location: location,
            date: date,
            lat: lat,
            lng: lng
          })
        }).then(response => {
          window.location.href = '/admin-activities';
        })
    }

    return (
      <div className='create'>
          <h2>Activiteit aanmaken</h2>
          <input onChange={e => setName(e.target.value)} placeholder='Naam'/>
          <input onChange={e => setLocation(e.target.value)} placeholder='Location'/>
          <input onChange={e => setDate(e.target.value)} placeholder='Date'/>
          <input onChange={e => setLat(e.target.value)} placeholder='Latitude'/>
          <input onChange={e => setLng(e.target.value)} placeholder='Longitude'/>
          <input onClick={submit} type='submit' value='Toevoegen'/>
      </div>
    );
}

export default connect(
    null,
    {getActivities}
  )(AdminActivitiesCreate);