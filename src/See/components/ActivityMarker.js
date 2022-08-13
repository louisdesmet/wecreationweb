import React from "react";
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { date } from '../../Global';

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
        <div className="data-container">
            <img src={(process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/' : 'http://wecreationapi.test/') + "activities/" + activity.image}/>
            <Link to={"/activities/" + activity.id}>{activity.name}</Link>
        </div>
        <div className="data-container">
            <img src={datum} alt=""/>
            <p>{date(activity.date)}</p>
        </div>
        {
            activity.time ? <div className="data-container">
            <img src={timeIcon} alt=""/>
            <p>{activity.time}</p>
            </div> : null
        }
        <div className="data-container">
            <img src={see} alt=""/>
            <p>{activity.location}</p>
        </div>
        </Popup>
    </Marker>;

    return (
        <>
            {
                props.activities.data.map(activity =>
                    filteredActivityMarkers(activity)
                )
            }
        </>
    );
}

export default ActivityMarker;
