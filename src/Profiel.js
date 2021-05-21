import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getProjects, getUsers} from "./redux/actions";
import credit from './img/profile-credit.png';
import Nav from "./Nav";
import {useSelector} from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChess, faAddressCard, faBeer, faBalanceScale, faMugHot, faBurn, faAnchor, faBlind, faBowlingBall, 
    faRadiation, faBandAid, faBath, faBed, faBible, faBlender, faBong, faBox } from '@fortawesome/free-solid-svg-icons'

import profileDefault from './img/profile-default.jpg';
import { useHistory } from "react-router-dom";
import Axios from 'axios';

export const Profiel = ({getUsers,getProjects}) => {
    const history = useHistory();
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    const [user, setUser] = useState("");
    const [amount, setAmount] = useState("");
    function date(date) {
        const jsDate = new Date(date);
        return jsDate.getDate()+'/'+(jsDate.getMonth()+1)+'/'+jsDate.getFullYear();
    }

    useEffect(() => {
        getProjects();
        getUsers();
    }, []);

    const projects = useSelector(state => state.remoteProjects);
    const users = useSelector(state => state.remoteUsers);

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
        history.push("/login");
    }

    function trade() {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
        Axios.post('/trade', {
            'loggedUser': loggedUser.id,
            'user_id': user,
            'amount': amount
        }, {
            headers: headers
        })
        .then((response) => {
            window.location.href = "/profiel";
        
        })
        .catch((error) => {
    
        })
    }

    function findIcon() {
        switch(JSON.parse(localStorage.getItem("user")).icon) {
            case "faChess": return faChess;
            break;
            case "faAddressCard": return faAddressCard;
            break;
            case "faBeer": return faBeer;
            break;
            case "faBalanceScale": return faBalanceScale;
            break;
            case "faMugHot": return faMugHot;
            break;
            case "faBurn": return faBurn;
            break;
            case "faAnchor": return faAnchor;
            break;
            case "faBlind": return faBlind;
            break;
            case "faBowlingBall": return faBowlingBall;
            break;
            case "faRadiation": return faRadiation;
            break;
            case "faBandAid": return faBandAid;
            break;
            case "faBath": return faBath;
            break;
            case "faBed": return faBed;
            break;
            case "faBible": return faBible;
            break;
            case "faBlender": return faBlender;
            break;
            case "faBong": return faBong;
            break;
            case "faBox": return faBox;
            break;
          }
    }

    const userList =  users.data ? users.data.map(user => <option key={user.id} value={user.id}>{user.name}</option>) : null;
    return (
        <div className="height100">
            <Nav/>
            <div className="profile-section-1">
                <div className="profile-default">
                    <FontAwesomeIcon icon={findIcon()} className="profile-icon" color="white"/>
                    <p>Actief Sinds {date(loggedUser.created_at)}</p>
                </div>
                <div>
                    <p className="profile-name">{loggedUser.name}</p>
                    <p>7. Collectief verteller</p>
                    <p className="profile-credits"><span>{loggedUser.credits}</span><img src={credit} alt=""/></p>
                    <p className="profile-hours"><span>{hoursSum}</span> uur</p>
                    <p className="logout" onClick={() => logout()}>Afmelden</p>
                </div>
                <div className="trade">
                    <h2>Trade met andere gebruiker</h2>
                    <input type="text" placeholder="Hoeveel wil je versturen?" onChange={e => setAmount(e.target.value)}/>
                    <select onChange={e => setUser(e.target.value)}>
                        {userList}
                    </select>
                    <button onClick={() => trade()}>Trade</button>
                </div>
            </div>
            
            {projectList}
        
        </div>
    );
}


export default connect(
    null,
    {getProjects, getUsers}
)(Profiel);