import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getActivities} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link } from 'react-router-dom';
import locprod from './Global';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import './css/Admin.scss';

export const AdminActivitiesCreate = ({getActivities}) => {

    useEffect(() => {
      getActivities();
    }, []);

    const users = useSelector(state => state.remoteActivities);

    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState(new Date());
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");

    function format(date) {
        const jsDate = new Date(date);
        return jsDate.getFullYear()+'-'+(jsDate.getMonth()+1)+'-'+jsDate.getDate()+' '+jsDate.getHours()+':'+jsDate.getMinutes()+':'+jsDate.getSeconds();
    }
    
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
          <input onChange={e => setName(e.target.value)} placeholder='Naam'/>
          <input onChange={e => setLocation(e.target.value)} placeholder='Location'/>
          <DatePicker selected={date} onChange={(date) => setDate(date)} />
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