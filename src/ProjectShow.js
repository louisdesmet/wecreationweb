import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Nav from './Nav';
import accept from './img/eventshow/accept.png';
import credit from './img/profile/credit.png';
import profiel from './img/eventshow/profile-purple.png';
import datum from './img/nav/agenda.png';
import location from './img/nav/see.png';
import navGet from './img/nav/get.png';
import decline from './img/eventshow/decline.png';
import update from './img/eventshow/update.png';
import werkkracht from './img/icons/beginner/werkkracht.png';
import './css/ProjectShow.scss';
import locprod, { profileIcon, skillIcon } from './Global';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';

function ProjectShow(props) {

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const history = useNavigate();

  const { id } = useParams();

  const [teamOpen, setTeamOpen] = useState(false);
  const [skillOpen, setSkillOpen] = useState(false);
  const project = props.projects.data.find(project => project.id === parseInt(id));

  function date(date) {
    const jsDate = new Date(date);
    return jsDate.getDate()+'-'+(jsDate.getMonth()+1)+'-'+jsDate.getFullYear();
  }

  var sorted = project ? project.events.sort((a,b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  }) : null;
  const reversed = sorted ? sorted.slice().reverse() : null;

  let totalHoursPaid = 0;
  let totalHoursFree = 0;
  let team = [];

  let skillList = [];

  if(project) { 
    project.events.forEach(event => {
      event.skills.forEach(skill => {
        skill.users.forEach(user => {
          if(user.present) {

            if(skillList.find(list => list.icon === skill.skill.icon)) {
              skillList.find(list => list.icon === skill.skill.icon).hours += skill.hours;
            } else {
              skillList.push({icon: skill.skill.icon, hours: skill.hours});
            }
            
            if(skill.paid) {
              totalHoursPaid += skill.hours
            } else {
              totalHoursFree += skill.hours
            }

            if(!team.find(item => item.id === user.id)) {
              team.push({id: user.id, name: user.name, icon: user.icon})
            }

          }
        })
      })
    })
  }
  



  function deleteEvent(e, id) { 
    e.preventDefault();
    fetch(locprod + '/events/' + id, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      }
    }).then(response => {
      window.location.href = '/projects/' + project.id;
    })
  }

  function editEvent(e, event) {
    e.preventDefault();
    window.location.href = "/event/create/" + project.id + "/" + event.id;
  }



  return (
    <div className="project-details height100">
        <Nav/>
        {project ?
          <div className='project-panel'>
            <div className="column-1">
              <div className='back' onClick={e =>  history(-1)}>
                <span>&#10508;</span>
                <b>BACK</b>
              </div>
              <h2 className='title'>{project.name}</h2>
              <div className='line'></div>
              <p className="desc">{project.description}</p>
              <div className="project-headers">
                <img src={accept}/>
                <img src={credit}/>
                <img src={profiel}/>
              </div>
              <div className="project-info">
                  <p>{project.type}</p>
                  <p>{project.credits} cc</p>
                  <p>{project.leader.name}</p>
              </div>
              
              <p>{"Er werden al " + (totalHoursPaid + totalHoursFree) + " uren gepresteerd waarvan " + totalHoursPaid + " betaald en " + totalHoursFree + " vrijwillig"}</p>
              <h2 onClick={e =>  setSkillOpen(!skillOpen)} className='teamtitle'>Skills</h2>
              {
              skillOpen ? 
              <List className='skillList'>
                {
                  skillList.sort(function(a, b) {
                    return b.hours - a.hours;
                  }).map(skill => 
                    <ListItem key={skill.icon}>
                      <ListItemAvatar>
                          <img src={skillIcon(skill.icon)}/>
                      </ListItemAvatar>
                      <ListItemText primary={skill.hours + " uren " + skill.icon} />
                    </ListItem>
                  )
                }
              </List>
              : null
              }
              <h2 onClick={e =>  setTeamOpen(!teamOpen)} className='teamtitle'>Team</h2>
              {
                teamOpen ? <List className='team'>
                  {
                    team.map(user => 
                      <ListItem button onClick={e => history("/profiel/" + user.id)} key={user.id}>
                        <ListItemAvatar>
                          <FontAwesomeIcon className="teamIcon" icon={profileIcon(user.icon)} color="white"/>
                        </ListItemAvatar>
                        <ListItemText primary={user.name} />
                      </ListItem>
                    )
                  }
                </List>
                : null
              }
             
              {loggedUser && loggedUser.id === project.leader.id ? <Link to={"/event/create/" + project.id} className='new-event'>Nieuw event</Link> : null}
            </div>
            <div className="column-2">
              {
                reversed.map(event =>
                  <Link to={"/events/" + event.id} className={"project-panel-event" + (new Date(event.date) < new Date() ? " project-panel-event-past" : "")} key={event.id}>
                    {
                      loggedUser && loggedUser.id === project.leader.id ? <div className='leader-buttons'>
                      <img className="delete" onClick={e => deleteEvent(e, event.id)} src={decline} alt=""/>
                      <img className="edit" onClick={e => editEvent(e, event)} src={update} alt=""/>
                      </div> : <div className='placebox'></div>
                    }
                    <img className="event-logo"  src={(process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/' : 'http://wecreationapi.test/') + "events/" + event.image}/>
                    <h2>{event.name}</h2>
                    {event.completed_at ? <p className='completed'><img src={accept}/>Afgerond</p> : null}
                    <p className="mt-15">{event.description}</p>
                    <div className='flex-container'>
                      <img src={datum}/>
                      <img src={location}/>
                      <img src={werkkracht}/>
                      <img src={navGet}/>
                    </div>
                    <div className='flex-container'>
                      <p>{date(event.date)}</p>
                      <p>{event.location}</p>
                      <p>{
                        event.skills.reduce((acc, obj) => { return acc + obj.amount; }, 0)
                      } plaatsen</p>
                      <p>{
                        event.skills.reduce((acc, obj) => { return acc + obj.credits; }, 0)
                      } cc</p>
                    </div>
                  </Link>
                )
              }
            </div>
          </div>
          :
          null
        }
    </div>
  );
}

export default ProjectShow;