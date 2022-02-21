
import Axios from "axios";
import React, { useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {getBusinesses} from "./redux/actions";
import credit from './img/profile-credit.png';
import stock from './img/stock.png';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import get from './img/nav-get.png';
import Nav from "./Nav";
let icon = L.icon({
  iconUrl: get,
  iconSize: [50, 50],
  popupAnchor: [0, -20],
});



export const GetProducts = ({getBusinesses,  ...otherProps}) => {

  useEffect(() => {
    getBusinesses();
  }, []);

  const businesses = useSelector(state => state.remoteBusinesses);

  const { id } = useParams();
  

  let business
  if(otherProps.business) {
    business = otherProps.business;
  } else {
    business = businesses.data ? businesses.data.find(business => business.id === parseInt(id)) : null;
  }

  let position = business ? [business.lat, business.lng] : [];

  const businessMarkers = business ? <Marker key={business.id} position={[business.lat, business.lng]} icon={icon}></Marker> : null;


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
            <h2>{business.name}</h2>
            <div className="products-data">
              <div className="products">
                  <h3>Producten</h3>
                  <div className="products-inner">
                    {
                        business ? business.products.map(product =>
                            <div className="product" key={product.id}>
                                <h4>{ product.name }</h4>
                                <div className="product-credits">
                                  <div><span>{product.amount}</span><img src={credit} alt=""/></div>
                                  <div><span>{product.price}</span><img src={stock} alt=""/></div>
                                </div>
                                <p onClick={() => buy(product)}><span className="product-buy">Aankopen</span></p>
                            </div>
                        ) : null
                    }
                  </div>
              </div>
              <div className="description">
                  <p>{business.description}</p>   
                  <Map className="map" center={position} zoom={13}>
                    <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {businessMarkers}
                  </Map>   
              </div>
            </div>
          </div> : null }
      </div>
    </div>
  );
}

export default connect(
  null,
  {getBusinesses}
)(GetProducts);


