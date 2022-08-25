import React from "react";
import { Link } from "react-router-dom";
import { date } from "../Global";
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';

import see from '../img/nav/see.png';
import agenda from '../img/nav/agenda.png';
import time from '../img/eventshow/time.png';
import evenementen from '../img/profile/badges.png';
import like from '../img/eventshow/like.png';
import geelPuzzel from '../img/eventshow/geel-puzzel.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, Popover, Typography } from "@mui/material";

let evenementenIcon = L.icon({
  iconUrl: evenementen,
  iconSize: [30, 30],
  popupAnchor: [0, -20],
});

function ActivityShow(props) {

  const [anchorEl, setAnchorEl] = React.useState(null);

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const notifyRegister = () => toast("Voor deze actie heb je een account nodig.");

  /*props.event.skills.forEach(skill => {
    skill.users.forEach(user => {
      if(user.id === loggedUser.id) {
        props.event.allowedInGroupchat = true;
      }
    })
  })*/

  let position = [props.activity.lat, props.activity.lng];

  const handlePopoverOpen = (event) => {
      setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
      setAnchorEl(null);
  };

  const openLiked = Boolean(anchorEl);

  function likeActivity() {
    if(loggedUser) {
      if(!props.activity.users.find(user => user.id === loggedUser.id)) {
        props.likeActivity(props.activity.id);
      }
    } else {
      notifyRegister();
    }
  }
  
  return (
    <div>    
      <div className={'event-panel activity-panel' + (props.popup ? ' popup-agenda' : '')}>
        <div className="top-items">
          <div className="groupchat">
            {
              /*props.event.allowedInGroupchat || props.event.project.leader.id === loggedUser.id ? <p onClick={e => window.location.href = "/netwerk/" + props.event.id}>Groupchat</p> : null*/
            }
          </div>
          <div>
            <img className="event-logo"  src={(process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/' : 'http://wecreationapi.test/') + "activities/" + props.activity.image}/>
          </div>
          <Typography 
              className={props.activity.users && props.activity.users.find(user => loggedUser && user.id === loggedUser.id) || props.liked ? "like liked" : "like"} 
              onClick={e => likeActivity()}
              aria-owns={openLiked ? 'mouse-over-popover' : undefined}
              aria-haspopup="true"
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
          >
              <span>{props.liked ? props.activity.users.length + 1 : props.activity.users.length}</span>
              <img className={props.activity.users && props.activity.users.find(user => loggedUser && user.id === loggedUser.id) || props.liked ? "liked" : ""} src={like}/>
              <p className={props.activity.users && props.activity.users.find(user => loggedUser && user.id === loggedUser.id) || props.liked ? "liked" : ""}>Interesse!</p>
          </Typography>
          <Popover
              id="mouse-over-popover"
              sx={{
                  pointerEvents: 'none',
              }}
              open={openLiked}
              anchorEl={anchorEl}
              anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
              }}
              transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
              }}
              onClose={handlePopoverClose}
              disableRestoreFocus
          >
              <List>
                  {
                  props.activity.users.map((user, i, row) =>
                      <>
                      <ListItem>
                          <ListItemAvatar>
                              <Avatar alt="" src={(process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/' : 'http://wecreationapi.test/') + 'users/' + user.image} />
                          </ListItemAvatar>
                          <ListItemText primary={user.name} />
                      </ListItem>
                      { i + 1 !== row.length && <Divider /> }
                      </>
                  )
                  }
              </List>
          </Popover>
        </div>
        <h2 className="event-title"><span>{props.activity.name}</span></h2>
        
        <div className="container">
          <div className="right">
            <h2><img src={evenementen} alt=""/>Eventbeschrijving</h2>
            <p className="desc">{props.activity.description}</p>
            <h2><img src={geelPuzzel} alt=""/>Ticketinfo</h2>
            <p className="desc"><a href={props.activity.ticketlink}>Koop hier je tickets</a></p>
            <MapContainer className="map map-desktop" center={position} zoom={15}>
              <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OSM</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker key={props.activity.id} position={[props.activity.lat, props.activity.lng]} icon={evenementenIcon}></Marker>
            </MapContainer>
          </div>
          <div className="left">
            <div className="left-item">
              <img src={agenda}/>
              <p>{date(props.activity.date)}</p>
            </div>
            <div className="left-item">
              <img src={time}/>
              <p>{props.activity.time}</p>
            </div>
            <div className="left-item">
              <Link to={"/see"}>
                  <img src={see}/>
                  <p>{props.activity.location}</p>
              </Link>
            </div>
          </div>
          <MapContainer className="map map-mobile" center={position} zoom={15}>
            <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker key={props.activity.id} position={[props.activity.lat, props.activity.lng]} icon={evenementenIcon}></Marker>
          </MapContainer>
        </div>
      
      </div>
      <ToastContainer />
    </div>
  );
}

export default ActivityShow;