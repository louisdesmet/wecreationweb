import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getProjects, getSkills, getUsers} from "./redux/actions";
import credit from './img/profile-credit.png';
import Nav from "./Nav";
import {useSelector} from "react-redux";
import './css/Profiel.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChess, faAddressCard, faBeer, faBalanceScale, faMugHot, faBurn, faAnchor, faBlind, faBowlingBall, 
    faRadiation, faBandAid, faBath, faBed, faBible, faBlender, faBong, faBox } from '@fortawesome/free-solid-svg-icons'
import { useHistory } from "react-router-dom";
import Axios from 'axios';

import regie from './img/Regie.png';
import montage from './img/Montage.png';
import mode from './img/Mode.png';
import dans from './img/Dans.png';
import camera from './img/Camera.png';
import labour from './img/labour.png';

export const Profiel = ({getUsers,getProjects,getSkills}) => {

    const history = useHistory();
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    const [user, setUser] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");

    function date(date) {
        const jsDate = new Date(date);
        return jsDate.getDate()+'/'+(jsDate.getMonth()+1)+'/'+jsDate.getFullYear();
    }

    useEffect(() => {
        getProjects();
        getUsers();
        getSkills();
    }, []);

    const projects = useSelector(state => state.remoteProjects);
    const users = useSelector(state => state.remoteUsers);
    const skills = useSelector(state => state.remoteSkills);

    let hoursSum = 0;
    function totalHours(hours) {
        hoursSum += parseInt(hours);
        return hours;
    }

    const projectList = projects.data ? (
        <div>
            <img className="generalSkillImg" src={labour} width="50px" onClick={() => showWork("algemeen")}/>
            {
                (category === "algemeen" ? 
                    <div>
                        <div className="profile-history-headers">
                            <p>Project naam</p>
                            <p>Event naam</p>
                            <p>Datum</p>
                            <p>Locatie</p>
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
                : null)
            } 
        </div>
    ) : null;

    function iconFind(name) {
        switch(name) {
          case "regie": return regie;
          break;
          case "montage": return montage;
          break;
          case "mode": return mode;
          break;
          case "dans": return dans;
          break;
          case "camera": return camera;
          break;
        }
    }

    function showWork(name) {
        setCategory(name);
    }

    const skillList = skills.data ? (      
        <div className="profile-history-skills">
            {
                skills.data.map(skill => 
                    (skill.events.length ? 
                        <div>
                            <img className="skillImg" src={iconFind(skill.name)} width="50px" onClick={() => showWork(skill.name)}/>
                            {
                                (category === skill.name ? skill.events.map(event => 
                                    (event.user_id === JSON.parse(localStorage.getItem("user")).id ? 
                                        <div>
                                            <div className="bold">
                                                <p>Project naam</p>
                                                <p>Event naam</p>
                                                <p>Datum</p>
                                                <p>Locatie</p>
                                                <p>Gepresteerde uren</p>
                                            </div>
                                            <div key={event.id}>    
                                                <p>{event.project.name}</p>
                                                <p>{event.name}</p>
                                                <p>{event.date}</p>
                                                <p>{event.location}</p>
                                                <p>{event.hours}</p>
                                            </div>
                                        </div>
                                    : null)
                                ) : null)
                            }
                        </div>
                    : null)        
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
            {skillList}
        
        </div>
    );
}


export default connect(
    null,
    {getProjects, getUsers, getSkills}
)(Profiel);