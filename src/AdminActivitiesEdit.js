import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getActivities} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link, useParams } from 'react-router-dom';
import locprod from './Global';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import './css/Admin.scss';

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
    const [date, setDate] = useState(new Date());
    const [lat, setLat] = useState(activity.lat);
    const [lng, setLng] = useState(activity.lng);

    function format(date) {
        const jsDate = new Date(date);
        return jsDate.getFullYear()+'-'+(jsDate.getMonth()+1)+'-'+jsDate.getDate()+' '+jsDate.getHours()+':'+jsDate.getMinutes()+':'+jsDate.getSeconds();
    }
    
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
            date: format(date),
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
          <DatePicker selected={date} onChange={(date) => setDate(date)} />
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