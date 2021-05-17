import React, {useState} from "react";
import Nav from "./Nav";
import axios from 'axios';
import location from './img/nav-see.png';
import datum from './img/nav-agenda.png';
import skillImg from './img/Skill.png';


function WorkEvents(props) {

    function date(date) {
        const jsDate = new Date(date);
        return jsDate.getDate()+'-'+(jsDate.getMonth()+1)+'-'+jsDate.getFullYear();
    }

    function click(e) {
      e.stopPropagation();
    }

    function findSkill(list) {

      let newSkills = [];
      if(props.skills.data && list) {
        props.skills.data.forEach(skill => {
          JSON.parse(list).forEach(item => {
            if(skill.id === item.id) {
              newSkills.push(skill);
            }
          })
        });
      }

      return newSkills.map(skill =>
        <span key={skill.id}>{skill.name}</span>
      );
    }

    if(props.project.events && Object.keys(props.project.events).length) {
      return (
        <div className='event-panel' key={props.enabled} onClick={e => click(e)}>
           
            {
                props.project.events.map(event =>
                  <div key={event.id}>
                    <div className="event">
                        <div className="event-detail bold">{event.name}</div>
                        <div className="event-detail">
                          
                          <img src={location}/>
                          <p>{event.location}</p>
                        </div>
                        <div className="event-detail">
                          <img src={datum}/>
                          <p>{date(event.date)}</p>
                        </div>
                        <div className="event-detail">
                          <img src={datum}/>
                          <p>{new Date(event.date).toLocaleTimeString()}</p>
                        </div>
                        <div className="event-detail">
                          <img src={skillImg}/>
                          <p>{event.skill ? findSkill(event.skill) : ''}</p>
                        </div>
                    </div>
                    <List event={event}/>
                    <Subscribe event={event} skills={props.skills} list={event.skill}/>
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

function Subscribe({ event, skills, list }) {
  
    const [hours, setHours] = useState(0);
  
    function join() {
  
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      }
      if(event.generalFree >= hours && hours != 0) {
        axios.post('/subscribe', {
          'event_id': event.id,
          'user_id': JSON.parse(localStorage.getItem("user")).id,
          'hours': hours
        }, {
          headers: headers
        })
        .then((response) => {
          window.location.href = '/work';
        }).catch((error) => {})
      }
      
    }

    function joinSkill(skill) {
  
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      }

      console.log(skills);
      let skillHours = 0;
      skills.data.forEach(skill => {
        skill.events.forEach(eventItem => {
      
          console.log(event.id + '' + eventItem.id + '' + skill.id + '' + JSON.parse(eventItem.skill).id);
          if(event.id === eventItem.id && skill.id === JSON.parse(eventItem.skill).id) {
            skillHours += parseInt(eventItem.hours);
          }
        });
      });

      console.log(skillHours);
      console.log('nog ' + JSON.parse(list).find(item => item.id === skill.id).hours + ' vrij en zoveel ' + hours);
      if(skill.free >= hours && hours != 0) {
        axios.post('/subscribe-skill', {
          'event_id': event.id,
          'user_id': JSON.parse(localStorage.getItem("user")).id,
          'skill_id': skill.id,
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

    let newSkills = [];
    if(skills.data && list) {
      let hoursCounter = 0;
      skills.data.forEach(skill => {
        skill.events.forEach(eventItem => {
          if(event.id === eventItem.id) {
            hoursCounter += parseInt(eventItem.hours);
          }

        });
        JSON.parse(list).forEach(item => {
          if(skill.id === item.id) {
            skill.hours = item.hours;
            skill.free =  item.hours - hoursCounter;
            newSkills.push(skill);
          }
        });

        hoursCounter = 0;
      });
    }

    function Free({free, skill}) {
      if (free == 0) {
        return (
          <div className="free"><p>Project volzet</p></div>
        );
      }
      return (
        <div className="free"><p>Nog {free} vrije uren beschikbaar voor de skill {skill.name.toLowerCase()}</p></div>
      );
    }
    
    const skillList = (newSkills ? newSkills.map(skill =>
      <div key={skill.id}>
        <h2>{skill.name}</h2>

        <Free skill={skill} free={skill.free}/>
        <div><p>Dit werk event heeft voor de skill {skill.name.toLowerCase()} {skill.hours} werkuren in totaal.</p></div>

        <div className="subscribe">
          <input type="number" onChange={(e) => {setHours(parseInt(e.target.value))}} placeholder="Hoeveel uren wil je werken?"/>
          <button onClick={() => joinSkill(skill)}>Schrijf je in</button>
        </div>

      </div>
    ) : null);

    if (event.credits == 0) {
      return (
        <div className="subscribe">
          <button className="full-width">Schrijf je in</button>
        </div>
      )
    }
  
    return (
      <div>
        <h2>Algemeen inschrijven</h2>
        <div className="subscribe">
          <input type="number" onChange={(e) => {setHours(parseInt(e.target.value))}} placeholder="Hoeveel uren wil je werken?"/>
          <button onClick={() => join()}>Schrijf je in</button>
        </div>
        {skillList}    
      </div>
    )
}

export default WorkEvents;
