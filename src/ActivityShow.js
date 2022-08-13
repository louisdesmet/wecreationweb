import React from 'react';
import {getActivities} from "./redux/actions";
import { useParams } from 'react-router-dom';
import Nav from './Nav';
import Axios from 'axios';
import ActivityShowComp from "./components/ActivityShow";

import './css/EventShow.scss';


function ActivityShow(props) {

  const { id } = useParams();
  const activity = props.activities.data ? props.activities.data.find(activity => activity.id === parseInt(id)) : null;

  const likeActivity = (activityId) => {
    Axios.post('/like-activity', {
      'activity': activityId,
      'user': JSON.parse(localStorage.getItem("user")).id
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      }
    })
    .then((response) => {
        getActivities();
 
    })
    .catch((error) => {
  
    })
  }

  return (
    <div className="height100">
        <Nav/>
        {activity ? <ActivityShowComp activity={activity} likeActivity={likeActivity}/> : null}
    </div>
  );
}

export default ActivityShow;