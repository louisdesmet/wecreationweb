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


import accept from './img/accept.png';
import back from './img/back.png';
import admin from './img/admin.png';
import skillImg from './img/Skill.png';
import datum from './img/nav-agenda.png';
import location from './img/nav-see.png';

export const Profiel = ({getUsers,getProjects,getSkills}) => {

    const history = useHistory();
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    const [user, setUser] = useState("");
    const [amount, setAmount] = useState("");
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [showPrestaties, setShowPrestaties] = useState(0);
    const [showSkills, setShowSkills] = useState(0);

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

    const updatedLoggedUser = users.data ? users.data.find(item => item.id === loggedUser.id) : null;

    let hoursSum = 0;
    function totalHours(hours) {
        hoursSum += parseInt(hours);
        return hours;
    }

    const projectList = projects.data ? (       
        projects.data.map(project => 
            project.events.map(event =>
                event.users.map(user =>
                    (user.id === loggedUser.id ?
                        <div className="profile-event" key={project.id + '-' + event.id + '-' + user.id + '-' + Math.random()}>
                            <h2>{project.name}</h2>
                            <h2>{event.name}</h2>
                            <div className="profile-headers">
                                <img src={datum}/>
                                <img src={location}/>
                                <p><span>{totalHours(user.hours)}</span></p>
                            </div>
                            <div className="profile-info">
                                <p>{event.date}</p>
                                <p>{event.location}</p>
                                <p>Gepresteerde uren</p>
                            </div>
                        </div>
                        :
                        null
                    )                              
                )
            )     
        )
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

    const filteredSkillList = skills.data && selectedSkill ? skills.data.filter(skill => skill.id === selectedSkill) : null;
    let counter = 0;
    const skillList = filteredSkillList ? (      
        filteredSkillList.map(skill => 

            (skill.events.length ?
                skill.events.map(event => 
                    (event.user_id === JSON.parse(localStorage.getItem("user")).id ?

                        <div className="profile-event" key={event.id + '-' + Math.random()}>
                            <h2>{event.project.name}</h2>
                            <h2>{event.name}</h2>
                            <div className="profile-headers">
                                <img src={datum}/>
                                <img src={location}/>
                                <p><span>{totalHours(event.hours)}</span></p>
                            </div>
                            <div className="profile-info">
                                <p>{event.date}</p>
                                <p>{event.location}</p>
                                <p>Gepresteerde uren</p>
                            </div>
                        </div>
                    : null)
                )
            : null)        
        )
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

    function change(x) {
        if(x === 1) {
            setShowPrestaties(0);
            setShowSkills(1);
        } else {
            setShowSkills(0);
            setShowPrestaties(1);
        }
    }

    function reset() {
        setShowSkills(0);
        setShowPrestaties(0);
    }

    const userList =  users.data ? users.data.map(user => <option key={user.id} value={user.id}>{user.name}</option>) : null;
    return (
        <div className="height100">
            <Nav/>
            <div className="profile">
                <div className="container">
                    <div className="box">
                        <div className="profile-info-block">
                            <div className="flex">
                                <p className="profile-credits"><span>{updatedLoggedUser ? updatedLoggedUser.credits : null}</span><img src={credit} alt=""/></p>
                                <p className="profile-hours"><span>{hoursSum}</span> uur</p>
                            </div>
                            <h2>Trade met een andere gebruiker</h2>
                            <div className="trade">
                                <select onChange={e => setUser(e.target.value)} placeholder="Wie?">
                                    <option>Wie?</option>
                                    {userList}
                                </select>
                                <input type="text" placeholder="Hoeveel?" onChange={e => setAmount(e.target.value)}/>
                                <img onClick={() => trade()} src={accept} alt=""/>
                            </div>
                        </div>
                    </div>
                    <div className="box">
                        <div className="profile-icon-block">
                            <FontAwesomeIcon icon={findIcon()} className="profile-icon" color="white"/>
                            <h2 className="profile-name">{loggedUser.name}</h2>
                            <p>7. Collectief verteller</p>
                            <p>Actief Sinds {date(loggedUser.created_at)}</p>
                        </div>
                    </div>
                    <div className="box">
                        <div className="admin">
                            <img src={admin} alt=""/>
                            <p>Privacy</p>
                            <p className="logout" onClick={() => logout()}>Afmelden</p>
                        </div>
                    </div>
                </div>
                {
                    showSkills === 0 && showPrestaties === 0 ? <div className="icons">
                        <div>
                            <img src={skillImg} onClick={() => change(1)}/>
                            <h2>Skills</h2>
                        </div>
                        <div>
                            <img src={labour} onClick={() => change(2)}/>
                            <h2>Prestaties</h2>
                        </div>
                    </div> : null
                }
                
                
                {
                    showPrestaties ? <div className="prestaties">
                        <div className="icon">
                            <img className="icon-1" src={back} onClick={() => reset()}/>
                            <img className="icon-2" src={labour}/>
                        </div>
                        <div className="profile-event-container">
                            {projectList}
                        </div>
                        
                    </div> : null
                }
                
                {
                    showSkills ? <div className="skills">
                        <div className="icon">
                            <img className="icon-1" src={back} onClick={() => reset()}/>
                            <img className="icon-2" src={skillImg}/>
                        </div>
                        <div className="profile-skill-container">
                            {
                                skills.data ? skills.data.map(skill =>
                                    (skill.events.length >= 1 ? <div><img key={skill.id} src={iconFind(skill.name)} onClick={() => setSelectedSkill(skill.id)}/><span>{skill.events.length}</span></div> : null)
                                ) : null
                            }

                        </div>
                    </div> : null
                }
                
                {
                    showSkills ? <div className="skill-details">
                        {skillList}
                    </div> : null
                }
                
            </div>
        </div>
    );
}


export default connect(
    null,
    {getProjects, getUsers, getSkills}
)(Profiel);