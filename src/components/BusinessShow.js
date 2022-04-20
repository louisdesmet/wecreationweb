
import Axios from "axios";
import React, { useState } from "react";
import { profileIcon } from '../Global.js'
import { Map, Marker, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import profile from '../img/eventshow/profile-purple.png';
import team from '../img/profile/team.png';
import location from '../img/nav/see.png';
import accept from '../img/eventshow/accept.png';
import decline from '../img/eventshow/decline.png';
import get from '../img/nav/get.png';

let icon = L.icon({
  iconUrl: get,
  iconSize: [50, 50],
  popupAnchor: [0, -20],
});
function BusinessShow(props) {

    const notifyCredits = (user, product) => toast("Je hebt " + user.credits + " credits en  het product " + product.name + " kost " + product.price + " credits");
    const notifyStock = (product) => toast("Het product " + product.name + " is uitverkocht.");

    const loggedUser = JSON.parse(localStorage.getItem("user"));

    const [product, setProduct] = useState(null);
    const [areYouSure, setAreYouSure] = useState(1);
  
    let position = [props.business.lat, props.business.lng];

    const businessMarkers = <Marker key={props.business.id} position={[props.business.lat, props.business.lng]} icon={icon}></Marker>;

    props.users.forEach(user => {
        user.roles.forEach(role => {
            if(role.business_id === props.business.id) {
                props.business.leader = user
            }
        })
    })

    function areYouSureBox(product) {
        let user = props.users.find(user => user.id === loggedUser.id);
        if(parseInt(user.credits) >= product.price && product.amount > 0) {
            setAreYouSure(1);
            setProduct(product);
        } else {
            if(product.amount > 0) {
                notifyCredits(user, product)
            } else {
                notifyStock(product)
            }
        
            
        
        }
     
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
        <div className="products-container">          
            <div>
                <FontAwesomeIcon icon={profileIcon(props.business.leader.icon)} className="profile-icon" color="white"/>
                <h2><span>{props.business.name}</span></h2>
                <div className="business-info">
                <div className="left">
                    <div>
                    <img src={profile}/>
                    <h3>Handelaar</h3>
                    <p>{props.business.leader.name}</p>
                    </div>
                    <div>
                    <img src={team}/>
                    </div>
                    <div>
                    <img src={location}/>
                    <p>{props.business.location}</p>
                    </div>
                </div>
                <div className="right">
                    <h3><img src={get} alt=""/>Beschrijving</h3>
                    <p>{props.business.description}</p>
                </div>
                </div>
                <h2><span>Producten</span></h2>
                <div className="products">
                {
                    props.business.products.map(product =>
                    <div className="product" key={product.id}>
                        <img src={(process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/' : 'http://wecreationapi.test/') + "products/" + product.picture}/>
                        <h4>{ product.name }</h4>
                        <p>{product.description}</p>
                        <p>{product.price}cc</p>
                        <button onClick={e => areYouSureBox(product)}><span className="product-buy">Ik neem er 1</span></button>
                    </div>
                    )
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
            </div>
            <ToastContainer />
        </div>
    );
}

export default BusinessShow;
