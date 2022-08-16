import React, {useState} from 'react';
import { Link, useParams } from 'react-router-dom';
import { skillIcon } from './Global';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from '@fullcalendar/interaction';
import nlLocale from '@fullcalendar/core/locales/nl';

import Nav from './Nav';
import datum from './img/nav/agenda.png';
import location from './img/nav/see.png';

import './css/Agenda.scss';

function Agenda(props) {

  const { id } = useParams();

  const [enabled, setEnabled] = useState(0);
  const [event, setEvent] = useState(null);

  const [enabledEvents, setEnabledEvents] = useState(0);
  const [dateClicked, setDateClicked] = useState(null);
  const [dateEvents, setDateEvents] = useState([]);

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
    return '<span class="dategreen">'+jsDate.toLocaleString('nl-be', {  weekday: 'long' })+'</span>'+' '+jsDate.toLocaleString('nl-be', { month: 'short' })+' '+jsDate.getDate()+', '+jsDate.getFullYear();
  }

  function Popup(props) {

    function findEvent(paramEvent) {
      
      if(paramEvent.extendedProps.type === "event") {
        return props.events.data.find(event => event.id === parseInt(paramEvent.id));
      } else {
        return props.activities.data.find(activity => activity.id === parseInt(paramEvent.id));
      }
      
    }

    function attendance(event) {
      let display = [];

      findEvent(event).skills.forEach(skill => {
        skill.users.forEach(user => {
            if(loggedUser && user.id === loggedUser.id) {
              display.push(<p className='attendance' key={skill.skill.name + "zin1"}>Je hebt je ingeschreven voor <img src={skillIcon(skill.skill.icon)}/> {skill.skill.name} voor {skill.hours} uur.</p>);    
              if(user.accepted === 1) {
                display.push(<p className='attendance' key={skill.skill.name + "zin2"}>Je bent goedgekeurd voor <img src={skillIcon(skill.skill.icon)}/> {skill.skill.name} door de project leider.</p>);
              }
            }
            
        })
      })
      return display;
    }

    return (
      <div className="agenda-popup">
        {event ?
          <div>
            <div className='top-agenda-popup'>
              <div>
             
                <img src={(process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/' : 'http://wecreationapi.test/') + "events/" + findEvent(event).image}/>
                <Link to={"/events/" + event.id}>{event.extendedProps.type === "event" ? findEvent(event).project.name + " - " : null}{event.title}</Link>
              </div>
              <span className="close" onClick={e => setEnabled(0)}>x</span>
            </div>
            
            <div className="flex-popup">
              <img src={datum}/>
              <p dangerouslySetInnerHTML={{__html: date(event.startStr)}}></p>
            </div>
            <div className="flex-popup">
              <img src={location}/>
              <p>{findEvent(event).location}</p>
            </div>
            {
              event.extendedProps.type === "event" ? attendance(event) : null
            }
            <Link to={event.extendedProps.type === "event" ? "/events/" + event.id : "/activities/" + event.id}><span>Naar event</span></Link>
          </div>
        : null}
      </div>
    );
  }

  function EventsPopup(props) {
    return (
      <div className="agenda-popup">
        <div className='top-agenda-popup'>
          <p dangerouslySetInnerHTML={{__html: date(dateClicked)}}></p>
          <span className="close" onClick={e => setEnabledEvents(0)}>x</span>
        </div>
        
        {dateEvents.map(event =>
          <div className='events-list' key={event.id}>
            <div className='events-list-flex'>
              <img src={(process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/' : 'http://wecreationapi.test/') + "events/" + event.image}/>
              <div>
                <p className={event.worked ? "title worked" : "title"}>{(event.project ? event.project.name + " - " : "") + event.name}</p>
                <p>{event.time}</p>
              </div>
            </div>

            <Link to={event.project ? "/events/" + event.id : "/activities/" + event.id}><span>Naar event</span></Link>
          </div>
        )}
      </div>
    );
  }

  const handleEventClick = ({ event, el }) => {
    setEnabled(1);
    setEvent(event);
  };
  
  const handleDateClick = (args) => {
    let filteredEvents = props.events.data.filter(event => date(event.date) === date(args.dateStr));
    let filteredActivities = props.activities.data.filter(activity => date(activity.date) === date(args.dateStr));
    let mergedEvents = filteredEvents.concat(filteredActivities);
    if(mergedEvents.length > 0) {
      setDateEvents(mergedEvents);
      setDateClicked(args.dateStr);
      setEnabledEvents(1);
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
      {enabled ? <Popup events={props.events} activities={props.activities} event={event}/> : null}
      {enabledEvents ? <EventsPopup event={dateEvents}/> : null}
    </div>
  );
}

export default Agenda;

