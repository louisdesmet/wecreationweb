import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getActivities} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link } from 'react-router-dom';
import Nav from './Nav';

import './css/MyEvents.scss';

import work from './img/nav/work.png';
import agenda from './img/nav/agenda.png';
import time from './img/eventshow/time.png';
import see from './img/nav/see.png';
import team from './img/profile/team.png';
import evenementen from './img/profile/badges.png';
import edit from './img/eventshow/edit.png';

export const MyActivities = ({getActivities}) => {

    useEffect(() => {
        getActivities();
    }, []);
    
    const activities = useSelector(state => state.remoteActivities);


    const futureActivities = activities.data ? activities.data.filter(activity => {
        return JSON.parse(localStorage.getItem("user")).id === activity.user.id && new Date(activity.date) > new Date();
    }) : null;



   /* const futureGroup = futureEvents ? futureEvents.reduce((acc, item) => {
        if (!acc[item.project.id]) {
            acc[item.project.id] = [];
        }
        acc[item.project.id].push(item);
        return acc;
    }, {}) : null*/

    const pastActivities = activities.data ? activities.data.filter(activity => {
        return JSON.parse(localStorage.getItem("user")).id === activity.user.id && new Date(activity.date) < new Date();
    }) : null;

   /* const pastGroup = pastEvents ? pastEvents.reduce((acc, item) => {
        if (!acc[item.project.id]) {
            acc[item.project.id] = [];
        }
        acc[item.project.id].push(item);
        return acc;
    }, {}) : null*/
    
    function date(date) {
        const jsDate = new Date(date);
        return jsDate.getDate()+'-'+(jsDate.getMonth()+1)+'-'+jsDate.getFullYear();
    }

    return (
        <div className="height100">
            <Nav/>
            <div className="event-container">
                <h2><img src={evenementen} alt=""/>Lopende activiteiten</h2>
                {
                    futureActivities ? futureActivities.map(activity => (
                        <div className="event" key={activity.id}>
                            <p><img src={evenementen} alt=""/>{activity.name}</p>
                            <p><img src={agenda} alt=""/>{date(activity.date)}</p>
                            <p><img src={time} alt=""/>{activity.time}</p>
                            <p><img src={see} alt=""/>{activity.location}</p>
                            <div><Link to={"/activity/update/" + activity.id}><img src={edit} alt=""/></Link></div>
                        </div>
                    )): null
                }

                <h2><img src={evenementen} alt=""/>Afgelopen activiteiten</h2>
                {
                    pastActivities ? pastActivities.map(activity => (
                        <div className="event" key={activity.id}>
                            <p><img src={evenementen} alt=""/>{activity.name}</p>
                            <p><img src={agenda} alt=""/>{date(activity.date)}</p>
                            <p><img src={time} alt=""/>{activity.time}</p>
                            <p><img src={see} alt=""/>{activity.location}</p>
                            <div><Link to={"/event-leader-board/" + activity.id}><img src={edit} alt=""/></Link></div>
                        </div>
                    )): null
                }

            </div>
      </div>
    );
}



export default connect(
    null,
    {getActivities}
  )(MyActivities);