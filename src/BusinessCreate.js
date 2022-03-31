import React, {useEffect, useState} from 'react';
import {connect, useSelector} from "react-redux";
import { getBusinesses } from './redux/actions';
import { Link, useParams } from 'react-router-dom';
import locprod from './Global';
import './css/EventCreate.scss';
import Nav from './Nav';

import work from './img/nav/work.png';
import agenda from './img/nav/agenda.png';
import timeIcon from './img/eventshow/time.png';
import see from './img/nav/see.png';
import free from './img/profile/free.png';
import skill from './img/profile/skill.png';
import get from './img/nav/get.png';

import add from './img/eventshow/add.png';

export const BusinessCreate = ({getBusinesses}) => {

    useEffect(() => {
      getBusinesses();
    }, []);

    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [location, setLocation] = useState("");

    const [freeAmount, setFreeAmount] = useState(1);

    const [freeData, setFreeData] = useState([]);

    const businesses = useSelector(state => state.remoteBusinesses);

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
            desc: desc,
            location: location,
            freeData: freeData
          })
        }).then(response => {
          window.location.href = '/handelaar/create';
        })
    }

    function AddToFree(index, field, value) {
      const temp = freeData;
      if(!temp[index]) {
        temp[index] = {};
      }
      temp[index][field] = value;
      setFreeData(temp);
    }

    return (
      <div className="height100">
        <Nav/>
        <div className="event-create">
          {
            <h2 className="event-title"><span>Mijn handelszaak</span></h2>
          }
          <h2><img src={get} alt=""/>Beschrijving handelszaak</h2>
          <input className='naam' onChange={e => setName(e.target.value)} placeholder='Naam'/>
          <textarea onChange={e => setDesc(e.target.value)} placeholder='Omschrijving'></textarea>
          <div className='input-image'>
            <img src={see} alt=""/>
            <input onChange={e => setLocation(e.target.value)} placeholder='Adres'/>
          </div>
          <h2><img src={get} alt=""/>Handelswaren</h2>
          <h2 className='hours'><img src={free} alt=""/>Producten</h2>

          {
            [...Array(freeAmount)].map((el, index) =>
            <div className='input-data'>
              <input placeholder='Naam' onChange={e => AddToFree(index, 'name', e.target.value)}/>
              <input placeholder='Description' onChange={e => AddToFree(index, 'desc', e.target.value)}/>
              <input placeholder='Prijs' onChange={e => AddToFree(index, 'price', e.target.value)}/>
              <input placeholder='Voorraad' onChange={e => AddToFree(index, 'stock', e.target.value)}/>
            </div>
            )
          }
          <h2 className='new' onClick={e => setFreeAmount(freeAmount + 1)}><img src={add} alt=""/>Nieuwe functie</h2>
          <button onClick={e => submit()}>Handelszaak aanmaken</button>
        </div>
      </div>
    );
}

export default connect(
    null,
    {getBusinesses}
)(BusinessCreate);