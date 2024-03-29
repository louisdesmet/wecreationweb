import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getUsers} from "./redux/actions";
import {useSelector} from "react-redux";
import './css/Admin.scss';

import locprod from './Global';

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
            lng: lng
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
          <input onClick={submit} type='submit' value='Toevoegen'/>
      </div>
    );
}

export default connect(
    null,
    {getUsers}
  )(AdminBusinessesCreate);