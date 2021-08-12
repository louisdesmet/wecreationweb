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

import {getAllEvents, getBusinesses, getSkills} from "./redux/actions";

import EventShow from "./EventShow";
import GetProducts from "./GetProducts";
export const Home = ({getAllEvents, getBusinesses, getSkills}) => {

  useEffect(() => {
    getAllEvents();
    getBusinesses();
    getSkills();
  }, []);

  const events = useSelector(state => state.remoteAllEvents);
  const businesses = useSelector(state => state.remoteBusinesses);
  const skills = useSelector(state => state.remoteSkills);

  const eventsLength = events.data ? events.data.length : 0;
  const businessLength = businesses.data ? businesses.data.length : 0;

  const rndIntEvent = Math.floor(Math.random() * eventsLength) + 1;
  const rndIntBusiness = Math.floor(Math.random() * businessLength) + 1;

  const event = events.data ? events.data.find((event, index) => index + 1 === rndIntEvent) : null;
  const business = businesses.data ? businesses.data.find((business, index) => index + 1 === rndIntBusiness) : null;


  const rndInt = Math.floor(Math.random() * 2) + 1;


  

  return (
      <div className="height100">
        <Nav/>
        { business && rndInt === 1 ? <GetProducts business={business}/> : null }
        { event && rndInt === 2 ? <EventShow event={event}/> : null }
      </div>
  );
}

export default connect(
  null,
  { getAllEvents, getBusinesses, getSkills }
)(Home);