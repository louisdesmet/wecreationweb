import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getActivities} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link, useParams } from 'react-router-dom';

export const AdminActivitiesEdit = ({getActivities}) => {

    useEffect(() => {
      getActivities();
    }, []);

    const activities = useSelector(state => state.remoteActivities);

    const { id } = useParams();
    const activity = activities.data ? activities.data.find(activity => activity.id === parseInt(id)) : null;

    const users = useSelector(state => state.remoteUsers);

    const [name, setName] = useState(activity.name);
    const [location, setLocation] = useState(activity.location);
    const [date, setDate] = useState(activity.date);
    const [lat, setLat] = useState(activity.lat);
    const [lng, setLng] = useState(activity.lng);
    
    const locprod = (process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/api' : 'http://api.test/api');
    
    function submit() {
        fetch(locprod + '/activities/' + activity.id, {
          method: 'PUT',
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
          <input onChange={e => setName(e.target.value)} defaultValue={activity.name} placeholder='Naam'/>
          <input onChange={e => setLocation(e.target.value)} defaultValue={activity.location} placeholder='Location'/>
          <input onChange={e => setDate(e.target.value)} defaultValue={activity.date} placeholder='Date'/>
          <input onChange={e => setLat(e.target.value)} defaultValue={activity.lat} placeholder='Latitude'/>
          <input onChange={e => setLng(e.target.value)} defaultValue={activity.lng} placeholder='Longitude'/>
          <input onClick={submit} type='submit' value='Toevoegen'/>
      </div>
    );
}

export default connect(
    null,
    {getActivities}
  )(AdminActivitiesEdit);