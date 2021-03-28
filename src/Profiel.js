import React, {useEffect} from 'react';
import {connect} from "react-redux";
import {getProjects} from "./redux/actions";
import credit from './img/profile-credit.png';
import Nav from "./Nav";
import {useSelector} from "react-redux";

import profileTitle from './img/profiel-title.png';
import profileDefault from './img/profile-default.jpg';

export const Profiel = ({props,getProjects}) => {

    const loggedUser = JSON.parse(localStorage.getItem("user"));

    function date(date) {
        const jsDate = new Date(date);
        return jsDate.getDate()+'/'+(jsDate.getMonth()+1)+'/'+jsDate.getFullYear();
    }

    useEffect(() => {
        getProjects();
    }, []);

    const projects = useSelector(state => state.remoteProjects);

    let hoursSum = 0;
    function totalHours(hours) {
        hoursSum += parseInt(hours);
        return hours;
    } 

    const projectList = projects.data ? (
        <div>
            <div className="profile-history-headers">
                <p>Project naam</p>
                <p>Event naam</p>
                <p>Datum</p>
                <p>Locatie</p>
                <p>Skill</p>
                <p>Gepresteerde uren</p>
            </div>
            {
                projects.data.map(project =>
                    <div className="profile-history" key={project.id}>
                        {
                        project.events.map(event =>
                            <div key={event.id}>
                                {
                                event.users.map(user =>
                                    (user.id === loggedUser.id ?
                                        <div key={user.id}>
                                            <p>{project.name}</p>
                                            <p>{event.name}</p>
                                            <p>{event.date}</p>
                                            <p>{event.location}</p>
                                            <p>{event.skill}</p>
                                            <p>{totalHours(user.hours)}</p>
                                        </div>
                                        :
                                        null
                                    )                              
                                )
                                }
                            </div>
                        )
                        }
                    </div>
                )
            }
        </div>
    ) : null;
  
    let clonedEvents = [];

    if(projects.data) {
       
        Object.values(projects.data).forEach(project => {
            project.events.forEach(event => {
                event.users.forEach(user => {
                    if(user.id === loggedUser.id) {
                        clonedEvents.push(user);
                    }
                })
            })
        });
    }


    function logout() {
        localStorage.setItem('token', null);
        localStorage.setItem('user', null);
        props.history.push("/login");
    }

    return (
        <div>
            <Nav/>
            <img className="profile-title" src={profileTitle} alt=""/>
            <div className="profile-section-1">
                <div className="profile-default">
                    <img src={profileDefault} alt=""/>
                    <p>Actief Sinds {date(loggedUser.created_at)}</p>
                </div>         
                <div>
                    <p className="profile-name">{loggedUser.name}</p>
                    <p>7. Collectief verteller</p>
                    <p className="profile-credits"><span>{loggedUser.credits}</span><img src={credit} alt=""/></p>
                    <p className="profile-hours"><span>{hoursSum}</span><p>uur</p></p>
                    <p className="logout" onClick={() => logout()}>Afmelden</p>
                </div>
            </div>
            {projectList}
        
        </div>
    );
}


export default connect(
    null,
    {getProjects}
)(Profiel);