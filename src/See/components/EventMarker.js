import React from "react";
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet';
import { Link, useHistory } from 'react-router-dom';
import { date } from '../../Global';
import { Avatar, ListItemText, ListItem, List, Divider, ListItemAvatar } from "@mui/material";

import datum from '../../img/nav/agenda.png';
import workImage from '../../img/nav/work.png';
import timeIcon from '../../img/eventshow/time.png';
import see from '../../img/nav/see.png';

let workIcon = L.icon({
    iconUrl: workImage,
    iconSize: [30, 30],
    popupAnchor: [0, -20],
});

function EventMarker(props) {

    const history = useHistory();

    const isToday = (someDate) => {
        const today = new Date()
        return someDate.getDate() == today.getDate() &&
          someDate.getMonth() == today.getMonth() &&
          someDate.getFullYear() == today.getFullYear()
    }
    
    const WEEK_LENGTH = 604800000;
    
    function onCurrentWeek(date) {
    
        var lastMonday = new Date(); // Creating new date object for today
        lastMonday.setDate(lastMonday.getDate() - (lastMonday.getDay()-1)); // Setting date to last monday
        lastMonday.setHours(0,0,0,0); // Setting Hour to 00:00:00:00
        
        const res = lastMonday.getTime() <= date.getTime() && date.getTime() < ( lastMonday.getTime() + WEEK_LENGTH);
        return res; // true / false
    }
    
    function sameDay(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

    const filteredEventMarkers = (event) => {
        if(props.today || props.week || props.state[0].startDate) {
          if(props.today) {
            return isToday(new Date(event.date)) ? marker(event) : null
          }
          if(props.week) {
            return onCurrentWeek(new Date(event.date)) ? marker(event) : null
          }
          if(props.state[0].startDate && props.state[0].endDate) {
            return new Date(event.date) > new Date(props.state[0].startDate) && new Date(event.date) < new Date(props.state[0].endDate) ? marker(event) : null
          }
          if(props.state[0].startDate) {
            return sameDay(new Date(props.state[0].startDate), new Date(event.date)) ? marker(event) : null
          }
          
        } else {
          return marker(event)
        }
    }

    const marker = (event) => <Marker key={event.id} position={[event.lat, event.lng]} icon={workIcon}>
        <Popup className="popup">
            <List>
                <ListItem button onClick={e => history.push("/events/" + event.id)}>
                    <ListItemAvatar>
                        <Avatar alt="" src={(process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/' : 'http://wecreationapi.test/') + "events/" + event.image} />
                    </ListItemAvatar>
                    <ListItemText primary={event.name}/>
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemAvatar>
                        <Avatar alt="" src={datum}/>
                    </ListItemAvatar>
                    <ListItemText primary={date(event.date)}/>
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemAvatar>
                        <Avatar alt="" src={timeIcon}/>
                    </ListItemAvatar>
                    <ListItemText primary={event.time}/>
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemAvatar>
                        <Avatar alt="" src={see}/>
                    </ListItemAvatar>
                    <ListItemText primary={event.location}/>
                </ListItem>
            </List>
        </Popup>
    </Marker>;

    return (
        <>
            {
                props.events.data.map(event =>
                    props.paid ? event.hasPaid && filteredEventMarkers(event) : !event.hasPaid && filteredEventMarkers(event)
                )
            }
        </>
    );
}

export default EventMarker;
