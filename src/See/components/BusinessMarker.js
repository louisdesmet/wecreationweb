import React from "react";
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet';
import { Link, useHistory } from 'react-router-dom';
import { Avatar, ListItemText, ListItem, List, Divider, ListItemAvatar } from "@mui/material";

import see from '../../img/nav/see.png';
import get from '../../img/nav/get.png';

let getIcon = L.icon({
    iconUrl: get,
    iconSize: [30, 30],
    popupAnchor: [0, -20],
});

function BusinessMarker(props) {

    const history = useHistory();

    return (
        <Marker key={props.business.id} position={[props.business.lat, props.business.lng]} icon={getIcon}>
            <Popup className="popup">
                <List>
                    <ListItem button onClick={e => history.push("/get/handelaars/" +  props.business.id + "/products")}>
                        <ListItemAvatar>
                            <Avatar alt="" src={(process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/' : 'http://wecreationapi.test/') + "businesses/" + props.business.image} />
                        </ListItemAvatar>
                        <ListItemText primary={ props.business.name}/>
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar alt="" src={get}/>
                        </ListItemAvatar>
                        <ListItemText primary={ props.business.description}/>
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar alt="" src={see}/>
                        </ListItemAvatar>
                        <ListItemText primary={ props.business.location}/>
                    </ListItem>
                </List>
            </Popup>
        </Marker>
    );
}

export default BusinessMarker;
