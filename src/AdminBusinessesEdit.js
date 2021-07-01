import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getBusinesses} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link, useParams } from 'react-router-dom';
import locprod from './Global';
import './css/Admin.scss';

export const AdminBusinessesEdit = ({getBusinesses}) => {

    useEffect(() => {
      getBusinesses();
    }, []);

    const businesses = useSelector(state => state.remoteBusinesses);

    const { id } = useParams();
    const business = businesses.data ? businesses.data.find(business => business.id === parseInt(id)) : null;

    const users = useSelector(state => state.remoteUsers);

    const [name, setName] = useState(business.name);
    const [type, setType] = useState(business.type);
    const [description, setDescription] = useState(business.description);
    const [location, setLocation] = useState(business.location);
    const [lat, setLat] = useState(business.lat);
    const [lng, setLng] = useState(business.lng);
    
    function submit() {
        fetch(locprod + '/businesses/' + business.id, {
          method: 'PUT',
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

    return (
      <div className='create'>
          <h2>Handelaar aanpassen</h2>
          <input onChange={e => setName(e.target.value)} defaultValue={business.name} placeholder='Naam'/>
          <input onChange={e => setType(e.target.value)} defaultValue={business.type} placeholder='Type'/>
          <input onChange={e => setDescription(e.target.value)} defaultValue={business.description} placeholder='Description'/>
          <input onChange={e => setLocation(e.target.value)} defaultValue={business.location} placeholder='Location'/>
          <input onChange={e => setLat(e.target.value)} defaultValue={business.lat} placeholder='Latitude'/>
          <input onChange={e => setLng(e.target.value)} defaultValue={business.lng} placeholder='Longitude'/>
          <input onClick={submit} type='submit' value='Toevoegen'/>
      </div>
    );
}

export default connect(
    null,
    {getBusinesses}
  )(AdminBusinessesEdit);