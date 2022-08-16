import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import Nav from './Nav';

import './css/MyEvents.scss';

import work from './img/nav/work.png';
import agenda from './img/nav/agenda.png';
import time from './img/eventshow/time.png';
import see from './img/nav/see.png';
import team from './img/profile/team.png';

import edit from './img/eventshow/edit.png';

function MyEvents(props) {

    props.events.data && props.events.data.forEach(event => {
        event.totalRequests = 0;
        event.skills.forEach(skill => {
            if(event.totalPostions) {
                event.totalPostions += skill.amount;
            } else {
                event.totalPostions = skill.amount;
            }
            skill.users.forEach(user => {
                if(user.accepted) {
                    if(event.totalFilled) {
                        event.totalFilled++;
                    } else {
                        event.totalFilled = 1;
                    }
                }
                
                if(!user.accepted) {
                    if(event.totalRequests) {
                        event.totalRequests++;
                    } else {
                        event.totalRequests = 1;
                    }
                }

            });
        });
    });

    const futureEvents = props.events.data.filter(event => {
        return JSON.parse(localStorage.getItem("user")).id === event.project.leader.id && new Date(event.date) > new Date();
    });

    const futureGroup = futureEvents ? futureEvents.reduce((acc, item) => {
        if (!acc[item.project.id]) {
            acc[item.project.id] = [];
        }
        acc[item.project.id].push(item);
        return acc;
    }, {}) : null

    const pastEvents = props.events.data.filter(event => {
        return JSON.parse(localStorage.getItem("user")).id === event.project.leader.id && new Date(event.date) < new Date();
    });

    const pastGroup = pastEvents ? pastEvents.reduce((acc, item) => {
        if (!acc[item.project.id]) {
            acc[item.project.id] = [];
        }
        acc[item.project.id].push(item);
        return acc;
    }, {}) : null
    
    function date(date) {
        const jsDate = new Date(date);
        return jsDate.getDate()+'-'+(jsDate.getMonth()+1)+'-'+jsDate.getFullYear();
    }

    function Collapsible(props) {

        const [open, setOpen] = useState(false);

        return (
            <>
                <div className='project'>
                    <p className='project-name' onClick={e => setOpen(!open)}><img className='project-picture' src={(process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/' : 'http://wecreationapi.test/') + "projects/" + props.events[0].project.picture}/>{props.events[0].project.name}</p>
                    <p className='projectteam'><img src={team} alt=""/><span>{props.events.reduce((accumulator, event, index) => accumulator + event.totalRequests, 0)}</span></p>
                    
                </div>
                {
                    open && <div>
                        {
                            props.events.map(event => 
                                <div className="event" key={event.id}>
                                    <p><img src={work} alt=""/>{event.name}</p>
                                    <p><img src={agenda} alt=""/>{date(event.date)}</p>
                                    <p><img src={time} alt=""/>{event.time}</p>
                                    <p><img src={see} alt=""/>{event.location}</p>
                                    <p className='team'><img src={team} alt=""/>{event.totalRequests ? <span>{event.totalRequests}</span> : null}{ (event.totalFilled ? event.totalFilled : 0) + " / " + (event.totalPostions ? event.totalPostions : 0)}</p>
                                    <div><Link to={"/event-leader-board/" + event.id}><img src={edit} alt=""/></Link></div>
                                </div>
                            )
                        }
                    </div>
                }
            </>
        );
    }

    return (
        <div className="height100">
            <Nav/>
            <div className="event-container">
                <h2><img src={work} alt=""/>Lopende events</h2>
                {
                    futureGroup ? Object.values(futureGroup).map((events, index) => 
                        <Collapsible  key={index} events={events}/>
                    ) : null
                }
                <h2><img src={work} alt=""/>Afgelopen events</h2>
                {
                    pastGroup ? Object.values(pastGroup).map((events, index) => 
                        <Collapsible  key={index} events={events}/>
                    ) : null
                }
            </div>
      </div>
    );
}

export default MyEvents;