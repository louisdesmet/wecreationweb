import React, {useState} from "react";
import Nav from "./Nav";
import axios from 'axios';

function WorkEvents(props) {

    function date(date) {
        const jsDate = new Date(date);
        return jsDate.getDate()+'-'+(jsDate.getMonth()+1)+'-'+jsDate.getFullYear();
    }

    function click(e) {
      e.stopPropagation();
    }

    if(props.project.events && Object.keys(props.project.events).length) {
      return (
        <div className='event-panel' key={props.enabled} onClick={e => click(e)}>
            <div className="event-headers">
              <p>Naam</p>
              <p>Locatie</p>
              <p>Datum</p>
              <p>Tijdstip</p>
              <p>Skill</p>
            </div>
            {
                props.project.events.map(event =>
                    <div key={event.id}>
                    <div className="event">
                        <h2>{event.name}</h2>
                        <p>{event.location}</p>
                        <p>{date(event.date)}</p>
                        <p>{new Date(event.date).toLocaleTimeString()}</p>
                        <p>{event.skill}</p>
                    </div>
                    <List event={event}/>
                    <Subscribe event={event}/>
                    <div className="line"></div>                    
                    </div>
                )
            }
        </div>
      );
    } else {
      return 'Dit project heeft nog geen events';
    }

    
  
}

function List({ event }) {

    function Free({free}) {
      if (free == 0) {
        return (
          <div className="free"><p>Project volzet</p></div>
        );
      }
      return (
        <div className="free"><p>{event.free} vrije uren</p></div>
      );
    }
  
    if (event.credits == 0) {
      return null;
    }
   
    return (
      <div className="event-details">
        <div>
          <h3>Participanten</h3>
          {                             
            event.users.map((user, index) =>
              (user.accepted ? <div key={String(user.id) + String(index)}>
              <p>{user.name}</p>
            </div> : null)            
            )
          }
        </div>
        <div>
          <Free free={event.free}/>
          <div><p>Dit werk event heeft {event.credits} werkuren in totaal.</p></div>
        </div>                     
      </div>
    );
}

function Subscribe({ event }) {
  
    const [hours, setHours] = useState(0);
  
    if (event.free == 0 && event.credits != 0) {
      return null;
    }
  
    function join() {
  
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      }
      if(event.free >= hours) {
        axios.post('/subscribe', {
          'event_id': event.id,
          'user_id': JSON.parse(localStorage.getItem("user")).id,
          'hours': hours
        }, {
          headers: headers
        })
        .then((response) => {
          window.location.href = '/work';
        })
        .catch((error) => {
      
        })
      }
      
    }
  
    if (event.credits == 0) {
      return (
        <div className="subscribe">
          <button className="full-width">Schrijf je in</button>
        </div>
      )
    }
  
    return (
      <div className="subscribe">
        <input type="number" onChange={(e) => {setHours(parseInt(e.target.value))}} placeholder="Hoeveel uren wil je werken?"/>
        <button onClick={() => join()}>Schrijf je in</button>
      </div>
    )
}

export default WorkEvents;
