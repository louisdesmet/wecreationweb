import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getProjects, getAllEvents, getUsers} from "./redux/actions";
import Nav from "./Nav";
import {useSelector} from "react-redux";
import './css/Profiel.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChess, faAddressCard, faBeer, faBalanceScale, faMugHot, faBurn, faAnchor, faBlind, faBowlingBall, 
    faRadiation, faBandAid, faBath, faBed, faBible, faBlender, faBong, faBox } from '@fortawesome/free-solid-svg-icons'
import { Link, useHistory } from "react-router-dom";

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

import regie from './img/icons/regie.png';
import montage from './img/icons/montage.png';
import mode from './img/icons/mode.png';
import dans from './img/icons/dans.png';
import camera from './img/icons/camera.png';
import administratie from './img/icons/administratie.png';
import organisatie from './img/icons/organisatie.png';
import werkkracht from './img/icons/werkkracht.png';
import decor from './img/icons/decor.png';
import kostuum from './img/icons/kostuum.png';
import muzikant from './img/icons/muzikant.png';
import agendaplanning from './img/icons/agendaplanning.png';
import dj from './img/icons/dj.png';
import animatie from './img/icons/animatie.png';
import tolk from './img/icons/tolk.png';
import presentatie from './img/icons/presentatie.png';
import socialmedia from './img/icons/socialmedia.png';
import acrobatie from './img/icons/acrobatie.png';
import acteur from './img/icons/acteur.png';
import vakman from './img/icons/vakman.png';
import geluidstechnieker from './img/icons/geluidstechnieker.png';
import conceptbedenker from './img/icons/conceptbedenker.png';
import yoga from './img/icons/yoga.png';
import projectleider from './img/icons/projectleider.png';
import horeca from './img/icons/horeca.png';
import schilderkunst from './img/icons/schilderkunst.png';

export const Profiel = ({getUsers,getProjects,getAllEvents}) => {

    const loggedUser = JSON.parse(localStorage.getItem("user"));

    function date(date) {
        const jsDate = new Date(date);
        return jsDate.getDate()+'/'+(jsDate.getMonth()+1)+'/'+jsDate.getFullYear();
    }

    useEffect(() => {
        getProjects();
        getUsers();
        getAllEvents();
    }, []);

    const users = useSelector(state => state.remoteUsers);
    const events = useSelector(state => state.remoteAllEvents);

    const updatedLoggedUser = users.data ? users.data.find(item => item.id === loggedUser.id) : null;

    let userHours = [];

    function findSkillIcon(name) {
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
          case "administratie": return administratie;
          break;
          case "organisatie": return organisatie;
          break;
          case "werkkracht": return werkkracht;
          break;
          case "decor": return decor;
          break;
          case "kostuum": return kostuum;
          break;
          case "muzikant": return muzikant;
          break;
          case "agendaplanning": return agendaplanning;
          break;
          case "dj": return dj;
          break;
          case "animatie": return animatie;
          break;
          case "tolk": return tolk;
          break;
          case "presentatie": return presentatie;
          break;
          case "socialmedia": return socialmedia;
          break;
          case "schilderkunst": return schilderkunst;
          break;
          case "acrobatie": return acrobatie;
          break;
          case "acteur": return acteur;
          break;
          case "vakman": return vakman;
          break;
          case "geluidstechnieker": return geluidstechnieker;
          break;
          case "conceptbedenker": return conceptbedenker;
          break;
          case "yoga": return yoga;
          break;
          case "projectleider": return projectleider;
          break;
          case "horeca": return horeca;
          break;
        }
      }

    if(events.data) {
        events.data.forEach(event => {
            event.skills.forEach(skill => {
                skill.users.forEach(user => {
                    if(user.id === loggedUser.id && user.accepted === 1) {
                        if(userHours.find(userHour => userHour.id === skill.skill.id && userHour.paid === skill.paid)) {
                            let temp = userHours.find(userHour => userHour.id === skill.skill.id && userHour.paid === skill.paid);
                            temp.hours = temp.hours + skill.hours;
                        } else {
                            userHours.push({id: skill.skill.id, name: skill.skill.name, icon: skill.skill.icon, hours: skill.hours, paid: skill.paid});
                        }
                        
                    }
                })
            })
        })
    }

    const freeUserHours = userHours ? userHours.filter(userHour => userHour.paid === 0) : null
    const paidUserHours = userHours ? userHours.filter(userHour => userHour.paid === 1) : null

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
                        <Link to={"/work"}><img src={agenda} alt=""/>Mijn projecten</Link>
                        <Link to={"/my-events"}><img src={agenda} alt=""/>Mijn events</Link>
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
                        {
                            freeUserHours ? freeUserHours.map(userHour =>
                                <div className='skill' key={userHour.id}>
                                    <div>
                                        <img src={findSkillIcon(userHour.icon)}/>
                                        <p>{userHour.name}</p>
                                    </div>
                                    <p>{userHour.hours}u</p>
                                </div>
                            ) : null
                        }
                        <h2><img src={skill} alt=""/>Skill uren</h2>
                        {
                            paidUserHours ? paidUserHours.map(userHour =>
                                <div className='skill' key={userHour.id}>
                                    <div>
                                        <img src={findSkillIcon(userHour.icon)}/>
                                        <p>{userHour.name}</p>
                                    </div>
                                    <p>{userHour.hours}u</p>
                                </div>
                            ) : null
                        }
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
    {getProjects, getUsers, getAllEvents}
)(Profiel);