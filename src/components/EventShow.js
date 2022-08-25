import React, { useState } from "react";
import { Link } from "react-router-dom";
import Axios from 'axios';
import { date, skillIcon } from "../Global";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import see from '../img/nav/see.png';
import work from '../img/nav/work.png';
import get from '../img/nav/get.png';
import agenda from '../img/nav/agenda.png';
import time from '../img/eventshow/time.png';
import team from '../img/profile/team.png';
import leader from '../img/profile/leader.png';
import accept from '../img/eventshow/accept.png';
import decline from '../img/eventshow/decline.png';
import desc from '../img/profile/desc.png';
import geelPuzzel from '../img/eventshow/geel-puzzel.png';
import credit from '../img/profile/credit.png';
import like from '../img/eventshow/like.png';
import credits from '../img/profile/credits.png';
import add from '../img/eventshow/accept.png';
import { Avatar, CardHeader, Divider, List, ListItem, ListItemAvatar, ListItemText, Popover, Typography } from "@mui/material";

let workIcon = L.icon({
  iconUrl: work,
  iconSize: [30, 30],
  popupAnchor: [0, -20],
});

function EventShow(props) {

  const history = useHistory();

  const notify = (event, skill) => toast("Je bent ingeschreven om te werken op " + event.name + " voor " + skill.hours + " uur " + skill.skill.name + ". De projectleider moet je nu eerst aanvaarden");
  const notifyRegister = () => toast("Voor deze actie heb je een account nodig.");

  const loggedUser = JSON.parse(localStorage.getItem("user"));
  
  const [chosenSkill, setChosenSkill] = useState(null);
  const [teamClicked, setTeamClicked] = useState(false);
  const [budgetClicked, setBudgetClicked] = useState(false);
  const [showDesc, setShowDesc] = useState(false);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const openLiked = Boolean(anchorEl);

  props.event.skills.forEach(skill => {
    skill.users.forEach(user => {
      if(loggedUser && user.id === loggedUser.id) {
        props.event.allowedInGroupchat = true;
      }
    })
  })

  const paidSkill = props.event && props.event.skills ? props.event.skills.map(skill => 
    skill.paid === 1 ? <div className="skills" key={skill.id}>
      <div className="image"><img src={skillIcon(skill.skill.icon)}/></div>
      <p>{skill.amount} x {skill.skill.name} - {skill.hours}u  <span>{skill.credits}<img className='credits' src={credits}/></span></p>
      <div className="button">
        {
          skill.users.filter(user => user.accepted).length < skill.amount ? 
            skill.users.find(user => loggedUser && user.id === loggedUser.id) ? 
              skill.users.find(user => loggedUser && user.id === loggedUser.id && user.accepted) ? 
                skill.users.find(user => loggedUser && user.id === loggedUser.id && user.accepted && user.present) ? 
                <button className="paid">Uitbetaald</button>
                : <button className="accepted">Goedgekeurd</button>
              : <button className="requested">Aangevraagd</button>
            : <button onClick={e => areYouSureBox(skill)}>Inschrijven</button>
          : <button className="full">Volzet</button>
        }
      </div>
    </div> : null
  ) : null;

  const freeSkill = props.event && props.event.skills ? props.event.skills.map(skill => 
    skill.paid === 0 ? <div className="skills" key={skill.id}>
      <div className="image"><img src={skillIcon(skill.skill.icon)}/></div>
      <p>{skill.amount} x {skill.skill.name} - {skill.hours}u</p>
      <div className="button">
        {
          skill.users.filter(user => user.accepted).length < skill.amount ? 
            skill.users.find(user => loggedUser && user.id === loggedUser.id) ? 
              skill.users.find(user => loggedUser && user.id === loggedUser.id && user.accepted) ? 
              <button className="accepted">Goedgekeurd</button>
              : <button className="requested">Aangevraagd</button>
            : <button onClick={e => areYouSureBox(skill)}>Inschrijven</button>
          : <button className="full">Volzet</button>
        }
      </div>
    </div> : null
  ) : null;

  const teamList = props.event && props.event.skills ? <div className="team">{props.event.skills.map(skill => 
    <div key={skill.id}>
        {
          skill.users.length > 0  ? <div>
            <h2>{skill.skill.name}</h2>
            {
              skill.users ? skill.users.map(user =>
                <Link  key={user.id} to={"/profiel/" + user.id}>{user.name}</Link>
              ) : null
            }
          </div> : null
        }  
    </div>
  )}</div> : null;

  const budget = props.event && props.event.skills ? <div className="team">{props.event.skills.map(skill =>
    <div key={skill.id}>
        {
          skill.paid ? <p>{skill.skill.name}: {skill.amount * skill.credits}cc</p> : null
        }
    </div>
  )}</div> : null;

  function areYouSureBox(skill) {
    if(loggedUser) {
      handleClickOpen();
      setChosenSkill(skill);
    } else {
      notifyRegister();
    }
    
  }

  function register(eventSkillId) {
    Axios.post('/subscribe-skill', {
      'eventSkillId': eventSkillId,
      'userId': JSON.parse(localStorage.getItem("user")).id
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      }
    })
    .then((response) => {
      handleClose();
      notify(props.event, chosenSkill);
    })
    .catch((error) => {
  
    })

  }

  function likeEvent() {
    if(loggedUser) {
      if(!props.event.users.find(user => user.id === loggedUser.id)) {
        props.likeEvent(props.event.id);
      }
    } else {
      notifyRegister();
    }
  }

  let position = [props.event.lat, props.event.lng];
  
  return (
    <div>    
      <div className={'event-panel' + (props.popup ? ' popup-agenda' : '') + (props.event.completed_at ? ' completed' : '')}>
        <div className="top-items">
          <div className="groupchat">
            {
              props.event.allowedInGroupchat || (loggedUser && props.event.project.leader.id === loggedUser.id) ? <p onClick={e => window.location.href = "/netwerk/" + props.event.id}>Groupchat</p> : null
            }
            {
              props.isPage ? <div className='back' onClick={e =>  history.goBack()}>
                <span>&#10508;</span>
                <b>BACK</b>
              </div> : null
            }
          </div>
          <div>
            {props.event.completed_at ? <h2 className="completed-message">Dit event is afgerond.<img src={add}/></h2> : null}
            <img className="event-logo"  src={(process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/' : 'http://wecreationapi.test/') + "events/" + props.event.image}/>
          </div>
          <Typography 
            className={props.event.users && props.event.users.find(user => loggedUser && user.id === loggedUser.id) || props.liked ? "like liked" : "like"} 
            onClick={e => likeEvent()}
            aria-owns={openLiked ? 'mouse-over-popover' : undefined}
            aria-haspopup="true"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            <span>{props.liked ? props.event.users.length + 1 : props.event.users.length}</span>
            <img src={like}/>
            <p>Interesse!</p>
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
                  props.event.users.map((user, i, row) =>
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
        <h2 className="event-title"><span>{props.event.name}</span></h2>
        
        <div className="container">
          <div className="right">
            <h2><img src={geelPuzzel} alt=""/>Eventbeschrijving</h2>
            <p className="desc">{props.event.description}</p>
            <h2 onClick={e => setShowDesc(!showDesc)}><img src={desc} alt=""/>{props.event.project.name}</h2>
            {
              showDesc ? <p className="desc">{props.event.project.description}</p> : null
            }
            
            <h2><img src={work} alt=""/>vrijwilliger uren</h2>
            {freeSkill}
            <h2><img src={credit} alt=""/>skill uren</h2>
            {paidSkill}
            {
              <MapContainer className="map map-desktop" center={position} zoom={15}>
                <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OSM</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker key={props.event.id} position={[props.event.lat, props.event.lng]} icon={workIcon}></Marker>
              </MapContainer>
            }   
          </div>
          <div className="left">
            <div className="left-item">
              <Link to={"/agenda/" + props.event.id}>
                  <img src={agenda}/>
                  <p>{date(props.event.date)}</p>
              </Link>
            </div>
            <div className="left-item">
              <img src={time}/>
              <p>{props.event.time}</p>
            </div>
            <div className="left-item">
              <img src={leader}/>
              <h2>Projectleider</h2>
              <Link to={"/profiel/" + props.event.project.leader.id}>{props.event.project.leader.name}</Link>
            </div>
            <div className="left-item" onClick={e => setTeamClicked(!teamClicked)}>
              <img src={team}/>
              <h2>Team</h2>
              {teamClicked ? teamList : null}
            </div>
            <div className="left-item" onClick={e => setBudgetClicked(!budgetClicked)}>
              <img src={get}/>
              <h2>Totaal budget</h2>
              {budgetClicked ? budget : null}
            </div>
            <div className="left-item">
              <Link to={"/see"}>
                  <img src={see}/>
                  <p>{props.event.location}</p>
              </Link>
            </div>
          </div>
          <MapContainer className="map map-mobile" center={position} zoom={15}>
            <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker key={props.event.id} position={[props.event.lat, props.event.lng]} icon={workIcon}></Marker>
          </MapContainer>
        </div>
        {
          chosenSkill ? 
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              <CardHeader
                avatar={
                  <Avatar
                    alt="Remy Sharp"
                    src={skillIcon(chosenSkill.skill.icon)}
                  />
                }
                title={chosenSkill.skill.name}
                titleTypographyProps={{variant:'h5' }}
              />
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Weet je zeker dat je je voor {chosenSkill.hours} uur in {chosenSkill.skill.name} wilt inschrijven?
              </DialogContentText>
            </DialogContent>
            <DialogActions>

              <Button onClick={handleClose}><Avatar src={decline}/></Button>
              <Button onClick={e => register(chosenSkill.id)} autoFocus>
                <Avatar src={accept}/>
              </Button>
            </DialogActions>
          </Dialog>
          : null
        }
      </div>
      <ToastContainer />
    </div>
  );
}

export default EventShow;