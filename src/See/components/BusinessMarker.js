import React from "react";
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet';
import { Link } from 'react-router-dom';

import see from '../../img/nav/see.png';
import get from '../../img/nav/get.png';

let getIcon = L.icon({
    iconUrl: get,
    iconSize: [30, 30],
    popupAnchor: [0, -20],
});

function BusinessMarker(props) {
    return (
        <Marker key={props.business.id} position={[props.business.lat, props.business.lng]} icon={getIcon}>
            <Popup className="popup">
                <h2><Link to={"/get/handelaars/" + props.business.id + "/products"}>{props.business.name}</Link></h2>
                <p>{props.business.description}</p>
                <div className="data-container">
                <img src={see} alt=""/>
                <p>{props.business.location}</p>
                </div>
            </Popup>
        </Marker>
    );
}

export default BusinessMarker;
