import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getActivities} from "./redux/actions";
import {useSelector} from "react-redux";
import { useParams } from 'react-router-dom';
import Nav from './Nav';
import Axios from 'axios';
import ActivityShowComp from "./components/ActivityShow";

import './css/EventShow.scss';

export const ActivityShow = ({getActivities}) => {

  useEffect(() => {
    getActivities();
  }, []);

  const activities = useSelector(state => state.remoteActivities);

  const { id } = useParams();
  const activity = activities.data ? activities.data.find(activity => activity.id === parseInt(id)) : null;

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

export default connect(
  null,
  {getActivities}
)(ActivityShow);