
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {getBusinesses, getUsers} from "./redux/actions";
import credit from './img/profile-credit.png';
import stock from './img/stock.png';
import { Map, Marker, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import get from './img/nav/get.png';
import Nav from "./Nav";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import locprod, { profileIcon } from './Global.js'

import profile from './img/eventshow/profile-purple.png';
import team from './img/profile/team.png';
import location from './img/nav/see.png';

import accept from './img/eventshow/accept.png';
import decline from './img/eventshow/decline.png';

let icon = L.icon({
  iconUrl: get,
  iconSize: [50, 50],
  popupAnchor: [0, -20],
});

export const GetProducts = ({getBusinesses, getUsers, ...otherProps}) => {

  useEffect(() => {
    getBusinesses();
    getUsers();
  }, []);

  const businesses = useSelector(state => state.remoteBusinesses);
  const users = useSelector(state => state.remoteUsers);

  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [areYouSure, setAreYouSure] = useState(1);

  let business
  if(otherProps.business) {
    business = otherProps.business;
  } else {
    business = businesses.data ? businesses.data.find(business => business.id === parseInt(id)) : null;
  }

  if(users.data) {
    users.data.forEach(user => {
      user.roles.forEach(role => {
        if(role.business_id === business.id) {
          business.leader = user
        }
      })
    })

  }

  let position = business ? [business.lat, business.lng] : [];

  const businessMarkers = business ? <Marker key={business.id} position={[business.lat, business.lng]} icon={icon}></Marker> : null;

  function areYouSureBox(product) {
    setAreYouSure(1);
    setProduct(product);
  }

  function buy(product) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
    }
    Axios.post('/orders', {
        product: product.id,
        user: JSON.parse(localStorage.getItem("user")).id
      }, {
        headers: headers
      })
      .then((response) => {
        window.location.href = '/orders/' + response.data.id;
      })
      .catch((error) => {
        
      })
  }

  return (
    <div className="height100">
      <Nav/>
      <div className="products-container">
          
          { business ? <div>
            {business.leader ? <FontAwesomeIcon icon={profileIcon(business.leader.icon)} className="profile-icon" color="white"/> : null}
            <h2><span>{business.name}</span></h2>
            <div className="business-info">
              <div className="left">
                <div>
                  <img src={profile}/>
                  <h3>Handelaar</h3>
                  <p>{business.leader ? business.leader.name : null}</p>
                </div>
                <div>
                  <img src={team}/>
                </div>
                <div>
                  <img src={location}/>
                  <p>{business.location}</p>
                </div>
              </div>
              <div className="right">
                <h3><img src={get} alt=""/>Beschrijving</h3>
                <p>{business.description}</p>
              </div>
            </div>
            <h2><span>Producten</span></h2>
            <div className="products">
              {
                business ? business.products.map(product =>
                  <div className="product" key={product.id}>
                    <img src={(process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/' : 'http://wecreationapi.test/') + "products/" + product.picture}/>
                    <h4>{ product.name }</h4>
                    <p>{product.description}</p>
                    <p>{product.price}cc</p>
                    <button onClick={e => areYouSureBox(product)}><span className="product-buy">Ik neem er 1</span></button>
                  </div>
                ) : null
              }
            </div>
            <Map className="map" center={position} zoom={13}>
              <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {businessMarkers}
            </Map>
            {
              areYouSure && product ? <div className="are-you-sure">
                <p>Bevestig je aankoop.</p>
                <img className="accept" src={accept} onClick={e => buy(product)}/>
                <img className="accept" src={decline} onClick={e => setAreYouSure(0)}/>
              </div> : null
            }   
          </div> : null }
      </div>
    </div>
  );
}

export default connect(
  null,
  {getBusinesses, getUsers}
)(GetProducts);


