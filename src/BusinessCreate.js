import React, {useEffect, useState} from 'react';
import {connect, useSelector} from "react-redux";
import { getBusinesses } from './redux/actions';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import locprod from './Global';
import './css/EventCreate.scss';
import { MapContainer, TileLayer } from 'react-leaflet'
import Nav from './Nav';
import Geocode from "react-geocode";

import see from './img/nav/see.png';
import free from './img/profile/free.png';
import get from './img/nav/get.png';
import add from './img/eventshow/add.png';

export const BusinessCreate = ({getBusinesses}) => {

    const routerLocation = useLocation();
    const history = useHistory();
  
    const loggedUser = JSON.parse(localStorage.getItem("user"));

    // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
    Geocode.setApiKey("AIzaSyB3hu-a1Gnzog5zG63fnQ8ZaMLghPGUPwI");

    // set response language. Defaults to english.
    Geocode.setLanguage("en");

    // set response region. Its optional.
    // A Geocoding request with region=es (Spain) will return the Spanish city.
    Geocode.setRegion("es");

    useEffect(() => {
      getBusinesses();
    }, []);

    const { id } = useParams();

    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [location, setLocation] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [file, setFile] = useState(null);

    const [freeAmount, setFreeAmount] = useState(1);

    const [freeData, setFreeData] = useState([]);

    const businesses = useSelector(state => state.remoteBusinesses);

    let business = businesses.data ? businesses.data.find(business => business.id === parseInt(id)) : null;

    if(business && lng === "") {
      setName(business.name);
      setDesc(business.description);
      setLocation(business.location);
      setLat(business.lat);
      setLng(business.lng);
      if(business.products && business.products.length) {

        setFreeAmount(business.products.length);
        
        let tempFree = [];

        business.products.forEach((product, index) => {
          tempFree[index] = {};
          tempFree[index]["name"] = product.name;
          tempFree[index]["desc"] = product.description;
          tempFree[index]["price"] = product.price;
          tempFree[index]["stock"] = product.amount;
          tempFree[index]["product"] = product.id;
          tempFree[index]["date"] = product.date;
          tempFree[index]["starthour"] = product.start_hour;
          tempFree[index]["endhour"] = product.end_hour;
        })
        setFreeData(tempFree);

      } else {
        setFreeAmount(1);
      }
    }

    const formData = new FormData();
    const imageHandler = (event) => {
      setFile(event.target.files[0]);
    }

    const productImageHandler = (event, id) => {
      const formDataImage = new FormData();
      formDataImage.append('id', id);
      formDataImage.append('image', event.target.files[0]);
      fetch(locprod + '/products/image', {
        method: 'POST',
        body: formDataImage,
        headers: {
            'Accept': 'multipart/form-data',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        },
      }).then(response => {})
      .catch(error => {
      
      });
    }

    function submit() {
      if(name && desc && location && lat && lng) {
        formData.append('name', name);
        formData.append('desc', desc);
        formData.append('type', routerLocation.pathname.includes("handelaar") ? "business" : "service",);
        formData.append('location', location);
        formData.append('lat', lat);
        formData.append('lng', lng);
        formData.append('freeData', JSON.stringify(freeData));
        formData.append('user', loggedUser.id);
        if(file) {
          formData.append('image', file);
        }

        if(business) {
          formData.append('businessid', business.id);
          fetch(locprod + '/businesses/' + business.id, {
            method: 'PUT',
            body: JSON.stringify({
              name: name,
              desc: desc,
              location: location,
              lat: lat,
              lng: lng,
              type: routerLocation.pathname.includes("handelaar") ? "business" : "service",
              freeData: freeData,
              user: loggedUser.id
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
          }).then(response => {
            fetch(locprod + '/businesses/image', {
              method: 'POST',
              body: formData,
              headers: {
                  'Accept': 'multipart/form-data',
                  'Authorization': 'Bearer ' + localStorage.getItem("token")
              },
            }).then(response => window.location.href = '/profiel')
            .catch(error => {
            
            });
          })
          .catch(error => {
          
          });
        } else {
          fetch(locprod + '/businesses', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'multipart/form-data',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
          }).then(response => window.location.href = '/profiel')
          .catch(error => {
          
          });
        }
      }
    }

    function AddToFree(index, field, value) {
      const temp = freeData;
      if(!temp[index]) {
        temp[index] = {};
      }
      temp[index][field] = value;
      setFreeData(temp);
    }

    function searchAddress(address) {
      Geocode.fromAddress(address).then(
        (response) => {
          const { lat, lng } = response.results[0].geometry.location;
          setLat(lat);
          setLng(lng);
        },
        (error) => {
        }
      );
    }

    function setLocationFunction(value) {
      setLat(null);
      setLng(null);
      setLocation(value);
    }

    return (
      <div className="height100">
        <Nav/>
        <div className="event-create">
          {
            <h2 className="event-title"><span>Mijn handelszaak</span></h2>
          }
          <h2><img src={get} alt=""/>Beschrijving handelszaak</h2>
          <input defaultValue={business && business.name ? business.name : ""} className='naam' onChange={e => setName(e.target.value)} placeholder='Naam'/>
          <textarea defaultValue={business && business.description ? business.description : ""} onChange={e => setDesc(e.target.value)} placeholder='Omschrijving'/>
          <label>Afbeelding (optioneel)</label>
          {
            business && business.image ? <img className="event-logo"  src={(process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/' : 'http://wecreationapi.test/') + "businesses/" + business.image}/> : null
          }
          <input type="file" name="image" accept="application/image" multiple={false} onChange={imageHandler}/>
          <div className='input-image'>
            <img src={see} alt=""/>
            <input defaultValue={business && business.location ?  business.location : ""} onChange={e => setLocationFunction(e.target.value) } placeholder='Adres'/>
            <span onClick={e => searchAddress(location)}>Zoeken</span>
          </div>

          {
            lat && lng ? <MapContainer className="map" center={[lat, lng]} zoom={18}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </MapContainer> : null
          }
          <h2><img src={get} alt=""/>Handelswaren</h2>
          <h2 className='hours'><img src={free} alt=""/>Producten</h2>
          {
            [...Array(freeAmount)].map((el, index) =>
            <div key={index} className='input-data'>
              <input defaultValue={business && freeData.length && freeData[index] ? freeData[index].name : ""} placeholder='Naam' onChange={e => AddToFree(index, 'name', e.target.value)}/>
              <input defaultValue={business && freeData.length && freeData[index] ? freeData[index].desc : ""} placeholder='Description' onChange={e => AddToFree(index, 'desc', e.target.value)}/>
              <input defaultValue={business && freeData.length && freeData[index] ? freeData[index].price : ""} placeholder='Prijs' onChange={e => AddToFree(index, 'price', e.target.value)}/>
              {
                routerLocation.pathname.includes("handelaar") ? <>
                  <input defaultValue={business && freeData.length && freeData[index] ? freeData[index].stock : ""} placeholder='Voorraad' onChange={e => AddToFree(index, 'stock', e.target.value)}/>
                </> : null
              }
              
              {
                routerLocation.pathname.includes("dienst") ? <>
                  <input type="date" defaultValue={business && freeData.length && freeData[index] ? freeData[index].date : ""} placeholder='Datum' onChange={e => AddToFree(index, 'date', e.target.value)}/>
                  <input type="time" id="starthour" defaultValue={business && freeData.length && freeData[index] ? freeData[index].starthour : ""} placeholder='Start uur' onChange={e => AddToFree(index, 'starthour', e.target.value)}/>
                  <input type="time" id="endhour" defaultValue={business && freeData.length && freeData[index] ? freeData[index].endhour : ""} placeholder='Eind uur' onChange={e => AddToFree(index, 'endhour', e.target.value)}/>
                </> : null
              }
              {business ? <input type="file" name="image" accept="application/image" multiple={false} onChange={e => productImageHandler(e, freeData[index].product)}/> : null}
            </div>
            )
          }
          <h2 className='new' onClick={e => setFreeAmount(freeAmount + 1)}><img src={add} alt=""/>Nieuw product</h2>
          <button onClick={e => submit()}>{id ? "Handelszaak aanpassen" : "Handelszaak aanmaken"}</button>
        </div>
      </div>
    );
}

export default connect(
    null,
    {getBusinesses}
)(BusinessCreate);