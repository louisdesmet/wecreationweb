import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import Nav from "./Nav";
import location from './img/nav-see.png';
import datum from './img/nav-agenda.png';
import skillImg from './img/Skill.png';
import time from './img/tijdstip.png';
import navNetwork from './img/nav-netwerk.png';

import axios from 'axios';
import regie from './img/Regie.png';
import montage from './img/Montage.png';
import mode from './img/Mode.png';
import dans from './img/Dans.png';
import camera from './img/Camera.png';

import {getAllEvents, getSkills} from "./redux/actions";

import EventShow from "./EventShow";

export const Home = ({getAllEvents, getSkills}) => {

  useEffect(() => {
    getAllEvents();
    getSkills();
  }, []);

  const events = useSelector(state => state.remoteAllEvents);
  console.log('---------events------');
  console.log(events);
  console.log('-----------stop events----------');
  const skills = useSelector(state => state.remoteSkills);
  const eventsLength = events.data ? events.data.length : 0;
  const rndInt = Math.floor(Math.random() * eventsLength) + 1;
  
  console.log('---------num------');
  console.log(rndInt);
  console.log('-----------stop num----------');

  const event = events.data ? events.data.find((event, index) => index + 1 === rndInt) : null;

  console.log('---------event------');
  console.log(event);
  console.log('-----------stop event----------');

  return (
      <div className="height100">
        <Nav/>

        { event ? <EventShow event={event}/> : null }
      </div>
  );
}

export default connect(
  null,
  { getAllEvents, getSkills }
)(Home);