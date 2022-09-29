import React from "react";
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet';
import { Link, useNavigate } from 'react-router-dom';
import { date } from '../../Global';
import { Avatar, ListItemText, ListItem, List, Divider, ListItemAvatar } from "@mui/material";

import datum from '../../img/nav/agenda.png';
import timeIcon from '../../img/eventshow/time.png';
import see from '../../img/nav/see.png';
import evenementen from '../../img/profile/badges.png';


let evenementenIcon = L.icon({
    iconUrl: evenementen,
    iconSize: [30, 30],
    popupAnchor: [0, -20],
});

function ActivityMarker(props) {
    
    const history = useNavigate();

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

    const filteredActivityMarkers = (activity) => {
        if(props.today || props.week || props.state[0].startDate) {
          if(props.today) {
            return isToday(new Date(activity.date)) ? marker(activity) : null
          }
          if(props.week) {
            return onCurrentWeek(new Date(activity.date)) ? marker(activity) : null
          }
          if(props.state[0].startDate && props.state[0].endDate) {
            return new Date(activity.date) > new Date(props.state[0].startDate) && new Date(activity.date) < new Date(props.state[0].endDate) ? marker(activity) : null
          }
          if(props.state[0].startDate) {
            return sameDay(new Date(props.state[0].startDate), new Date(activity.date)) ? marker(activity) : null
          }
          
        } else {
          return marker(activity)
        }
    }

    const marker = (activity) => <Marker key={activity.id} position={[activity.lat, activity.lng]} icon={evenementenIcon}>
        <Popup className="popup">
            <List>
                <ListItem button onClick={e => history("/activities/" + activity.id)}>
                    <ListItemAvatar>
                        <Avatar alt="" src={(process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/' : 'http://wecreationapi.test/') + "activities/" + activity.image} />
                    </ListItemAvatar>
                    <ListItemText primary={activity.name}/>
                </ListItem>
                <Divider />
                {
                    activity.resourceType === "activity" ?
                    <>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar alt="" src={datum}/>
                            </ListItemAvatar>
                            <ListItemText primary={date(activity.date)}/>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar alt="" src={timeIcon}/>
                            </ListItemAvatar>
                            <ListItemText primary={activity.time}/>
                        </ListItem>
                        <Divider />
                    </>
                    : null
                }
                <ListItem>
                    <ListItemAvatar>
                        <Avatar alt="" src={see}/>
                    </ListItemAvatar>
                    <ListItemText primary={activity.location}/>
                </ListItem>
            </List>
        </Popup>
    </Marker>;

    

    return (
        <>
            {
                props.activities.data.map(activity =>
                    (props.activity && activity.resourceType === "activity")  || (props.place && activity.resourceType === "place") ? filteredActivityMarkers(activity) : null
                )
            }
        </>
    );
}

export default ActivityMarker;
