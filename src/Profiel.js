import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getProjects, getSkills, getUsers} from "./redux/actions";
import Nav from "./Nav";
import {useSelector} from "react-redux";
import './css/Profiel.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChess, faAddressCard, faBeer, faBalanceScale, faMugHot, faBurn, faAnchor, faBlind, faBowlingBall, 
    faRadiation, faBandAid, faBath, faBed, faBible, faBlender, faBong, faBox } from '@fortawesome/free-solid-svg-icons'
import { Link, useHistory } from "react-router-dom";
import Axios from 'axios';

import regie from './img/Regie.png';
import montage from './img/Montage.png';
import mode from './img/Mode.png';
import dans from './img/Dans.png';
import camera from './img/Camera.png';
import labour from './img/labour.png';


import back from './img/back.png';
import admin from './img/admin.png';
import skillImg from './img/Skill.png';
import datum from './img/nav-agenda.png';


import work from './img/nav-work.png';

import agenda from './img/profile/agenda.png';
import handel from './img/profile/handel.png';
import kassa from './img/profile/kassa.png';

import credits from './img/profile/credits.png';
import edit from './img/profile/edit.png';

import navAgenda from './img/nav/agenda.png';
import master from './img/profile/master.png';
import see from './img/nav/see.png';
import credit from './img/profile/credit.png';
import team from './img/profile/team.png';
import leader from './img/profile/leader.png';

import desc from './img/profile/desc.png';
import data from './img/profile/data.png';
import get from './img/nav/get.png';

import free from './img/profile/free.png';
import skill from './img/profile/skill.png';
import badges from './img/profile/badges.png';



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

    return (
        <div className="height100">
            <Nav/>
            <div className="profile">
                <div className="container">
                    <div className="left">
                        <Link to={"/home"}><img src={handel} alt=""/>Mijn handelszaak</Link>
                        <Link to={"/home"}><img src={kassa} alt=""/>Mijn kassatickets</Link>
                        <Link to={"/home"}><img src={agenda} alt=""/>Mijn projecten</Link>
                        <Link to={"/home"}><img src={agenda} alt=""/>Mijn events</Link>
                    </div>
                    <div className="middle">
                        <FontAwesomeIcon icon={findIcon()} className="profile-icon" color="white"/>
                        <h2 className="profile-name">{loggedUser.name}</h2>
                        
                        <p className="profile-credits"><img src={credits} alt=""/>{updatedLoggedUser ? updatedLoggedUser.credits : null} cc</p>
                        <div className="line"></div>
                    </div>
                    <div className="right">
                        <img className="profile-edit" src={edit} alt=""/>
                    </div>
                </div>
                <div className="profile-container">
                    <div className="left">
                        <div>
                            <img src={navAgenda} alt=""/>
                            <h2>Lopende projecten</h2>
                        </div>
                        <div>
                            <img src={master} alt=""/>
                            <h2>Master in</h2>
                        </div>
                        <div>
                            <img src={see} alt=""/>
                            <h2>Fix the grid</h2>
                        </div>
                        <div>
                            <img src={credit} alt=""/>
                            <h2>Verdiende credits</h2>
                        </div>
                        <div>
                            <img src={team} alt=""/>
                            <h2>Bekende teamgenoten</h2>
                        </div>
                        <div>
                            <img src={leader} alt=""/>
                            <h2>Projectleider van</h2>
                        </div>
                    </div>
                    <div className="right">
                        <h2><img src={desc} alt=""/>Profielbeschrijving</h2>
                        <p>wezen. Lorem Ipsum is de standaard proeftekst in deze bedrijfstak sinds de 16e eeuw,
                        toen een onbekende drukker een zethaak met letters nam en ze door elkaar husselde
                        om een font-catalogus te maken. Het heeft niet alleen vijf eeuwen overleefd maar 
                        is ook, vrijwel onveranderd, ove</p>
                        <h2><img src={data} alt=""/>Profielgegevens</h2>
                        <p>28 jaar</p>
                        <p>Actief Sinds {date(loggedUser.created_at)}</p>
                        <p className="email">{loggedUser.email}</p>
                        <h2><img src={get} alt=""/>Handelszaak</h2>
                        <p>Fix the grid</p>
                        <p>webdesign en grafische vormgeving</p>
                        <p className="email">www.fixthegrid.be</p>
                        <p>BE045 1574 215 154</p>
                    </div>
                </div>
                <div className="profile-below-container">
                    <div className="left">
                        <h2><img src={free} alt=""/>Vrijwillige uren</h2>
                        <h2><img src={skill} alt=""/>Skill uren</h2>
                    </div>
                    <div className="right">
                        <h2><img src={badges} alt=""/>Behaalde badges</h2>
                    </div>
                </div>

            </div>
        </div>
    );
}


export default connect(
    null,
    {getProjects, getUsers, getSkills}
)(Profiel);