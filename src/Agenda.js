import React, {useState} from 'react';
import { useHistory, useParams } from 'react-router-dom';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from '@fullcalendar/interaction';
import nlLocale from '@fullcalendar/core/locales/nl';

import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItemAvatar from '@mui/material/ListItemAvatar';

import EventShowComp from "./components/EventShow";
import ActivityShowComp from "./components/ActivityShow";
import Axios from 'axios';

import Nav from './Nav';

import './css/Agenda.scss';
import { Avatar } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Agenda(props) {

  const history = useHistory();

  const { id } = useParams();

  const [enabled, setEnabled] = useState(0);
  const [event, setEvent] = useState(null);

  const [enabledEvents, setEnabledEvents] = useState(0);
  const [dateClicked, setDateClicked] = useState(null);
  const [dateEvents, setDateEvents] = useState([]);

  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };


  const loggedUser = JSON.parse(localStorage.getItem("user"));

  props.events.data.forEach(event => {
    event.skills.forEach(skill => {
      skill.users.forEach(user => {
        if(loggedUser && user.id === loggedUser.id) {
          event.worked = true
        }
      })
    })
  })

  const fcEvents = props.events.data.map((event, index) => {
    let newDate = new Date(event.date);
    let time = event.time.split(":");
    newDate.setHours(time[0]);
    newDate.setMinutes(time[1]);
    return {id: event.id, title: event.name, date: newDate, extendedProps: {
      worked: event.worked,
      time: event.time,
      type: "event"
    }}
  })

  const fcActivities = props.activities.data.map((activity, index) => {
    let newDate = new Date(activity.date);
    return {id: activity.id, title: activity.name, date: newDate, extendedProps: {
      time: activity.time,
      type: "activity"
    }}
  })

  if(id && !event) {
    setEnabled(1);
    let tempEvent = props.events.data.find(event => event.id === parseInt(id));
    tempEvent.startStr = tempEvent.date
    tempEvent.title = tempEvent.name
    tempEvent.extendedProps = {
      worked: tempEvent.worked,
      time: tempEvent.time,
      type: "event"
    }
    setEvent(tempEvent);
  }

  function date(date) {
    const jsDate = new Date(date);
    return jsDate.toLocaleString('nl-be', {  weekday: 'long' })+' '+jsDate.toLocaleString('nl-be', { month: 'short' })+' '+jsDate.getDate()+', '+jsDate.getFullYear();
  }

  const handleEventClick = ({ event, el }) => {
    setEnabled(1);
    setEvent(event);
    handleClickOpen2();
  };
  
  const handleDateClick = (args) => {
    let filteredEvents = props.events.data.filter(event => date(event.date) === date(args.dateStr));
    let filteredActivities = props.activities.data.filter(activity => date(activity.date) === date(args.dateStr));
    let mergedEvents = filteredEvents.concat(filteredActivities);
    if(mergedEvents.length > 0) {
      setDateEvents(mergedEvents);
      setDateClicked(args.dateStr);
      setEnabledEvents(1);
      handleClickOpen();
    }
  };

  function renderEventContent(eventInfo) {
    return (
      <>
        <span className={eventInfo.event.extendedProps.worked ? "worked" : eventInfo.event.extendedProps.type === "event" ? "event" : "activity"}></span>
        <b>{eventInfo.event.extendedProps.time} </b>
        <i> {eventInfo.event.title}</i>
      </>
    )
  }

  const likeEvent = (eventId) => {
    if(loggedUser) {
      Axios.post('/like-event', {
        'event': eventId,
        'user': loggedUser.id
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
      })
      .then((response) => {
        props.reloadEvents();
   
      })
      .catch((error) => {
    
      })
    }
  }

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
      props.reloadActivities();
 
    })
    .catch((error) => {
  
    })
  }

  return (
    <div className="agenda">
      <Nav/>
      <div className="agenda-container">
        <FullCalendar
          plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
          initialView="dayGridMonth"
          events={fcEvents && fcActivities ? fcEvents.concat(fcActivities) : null}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          eventContent={renderEventContent}
          height="parent"
          initialDate={id ? props.events.data.find(event => event.id === parseInt(id)).date : null}
          locale={nlLocale}
          headerToolbar={{
            left: 'prev title next',
            center: '',
            right: 'today dayGridMonth,timeGridWeek,timeGridDay'
          }}
        />
      </div>
      <div className='legend'>
        <span className="activity"></span><b>Activiteit</b><span className="default"></span><b>Job</b><span className="worked"></span><b>Ingeschreven</b>
      </div>
      {/*enabled ? <Popup events={props.events} activities={props.activities} event={event}/> : null*/}
      {
        enabled ?
          <Dialog
            
            open={open2}
            onClose={handleClose2}
            TransitionComponent={Transition}
          >
            <AppBar sx={{ position: 'relative' }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleClose2}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                <p dangerouslySetInnerHTML={{__html: date(dateClicked)}}></p>
                </Typography>
              </Toolbar>
            </AppBar>
            {
              event ?
              event.extendedProps.type === "event" ?
              <EventShowComp event={props.events.data.find(foundEvent => foundEvent.id === parseInt(event.id))} likeEvent={likeEvent} isPage={true} popup={true}/>
              : <ActivityShowComp activity={props.activities.data.find(foundActivity => foundActivity.id === parseInt(event.id))} likeActivity={likeActivity} popup={true}/>
              : null
            }
          </Dialog>
        : null
      }
      {
        enabledEvents ?
          <Dialog
            
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
          >
            <AppBar sx={{ position: 'relative' }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleClose}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                <p dangerouslySetInnerHTML={{__html: date(dateClicked)}}></p>
                </Typography>
              </Toolbar>
            </AppBar>
            <List>
              {
                dateEvents.map(event =>
                  <>
                    <ListItem button onClick={e => history.push(event.project ? "/events/" + event.id : "/activities/" + event.id)}>
                      <ListItemAvatar>
                        <Avatar alt="" src={(process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/' : 'http://wecreationapi.test/') + (event.type === "event" ? "events/" : "activities/") + event.image} />
                      </ListItemAvatar>
                      <ListItemText primary={(event.project ? event.project.name + " - " : "") + event.name} secondary={event.time} />
                    </ListItem>
                    <Divider />
                  </>
                )
              }
              
            </List>
          </Dialog>
        : null
      }
    </div>
  );
}