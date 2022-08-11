import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getProjects, getAllEvents, getUsers} from "./redux/actions";
import Nav from "./Nav";
import {useSelector} from "react-redux";
import './css/Profiel.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ToastContainer, toast } from 'react-toastify';
import { Link, useHistory, useParams } from "react-router-dom";

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
import free from './img/profile/free.png';
import skill from './img/profile/skill.png';
import badges from './img/profile/badges.png';
import like from './img/eventshow/like.png';
import logoutImg from './img/profile/logout.png';
import starter from './img/profile/starter.png';
import beginner from './img/profile/beginner.png';
import pro from './img/profile/pro.png';
import legend from './img/profile/legend.png';
import { badgeIcon, date, profileIcon, skillIcon } from './Global';
import Axios from 'axios';

export const Profiel = ({getUsers,getProjects,getAllEvents}) => {

    const notify = () => toast("Welkom op wecreation, je bent nu op je profiel.");

    const history = useHistory();
    const { id } = useParams();

    const [leaderClicked, setLeaderClicked] = useState(false);
    const [eventsClicked, setEventsClicked] = useState(false);
    const [teamClicked, setTeamClicked] = useState(false);
    const [liked, setLiked] = useState(false);

    const loggedUser = JSON.parse(localStorage.getItem("user"));
    
    useEffect(() => {
        getUsers();
        getProjects();
        getAllEvents();
    }, []);

    const users = useSelector(state => state.remoteUsers);
    const events = useSelector(state => state.remoteAllEvents);
    const projects = useSelector(state => state.remoteProjects);

    let updatedLoggedUser = null;

    if(id && users.data) {
        updatedLoggedUser = users.data.find(item => item.id === parseInt(id));
    } else if(users.data) {
        updatedLoggedUser = users.data.find(item => item.id === loggedUser.id);
    }

    let userHours = [];
    let userHoursTotal = [];

    if(events.data) {
        events.data.forEach(event => {
            event.skills.forEach(skill => {
                skill.users.forEach(user => {
                    if(user.id === (id ? parseInt(id) : loggedUser.id) && user.present === 1) {
                        if(userHours.find(userHour => userHour.id === skill.skill.id && userHour.paid === skill.paid)) {
                            userHours.find(userHour => userHour.id === skill.skill.id && userHour.paid === skill.paid).hours += skill.hours;
                        } else {
                            userHours.push({id: skill.skill.id, name: skill.skill.name, icon: skill.skill.icon, hours: skill.hours, paid: skill.paid});
                        }
                        if(userHoursTotal.find(userHour => userHour.id === skill.skill.id)) {
                            userHoursTotal.find(userHour => userHour.id === skill.skill.id).hours += skill.hours;
                        } else {
                            userHoursTotal.push({id: skill.skill.id, name: skill.skill.name, icon: skill.skill.icon, hours: skill.hours, paid: skill.paid});
                        }
                    }
                })
            })
        })
    }

    const freeUserHours = userHours ? userHours.filter(userHour => userHour.paid === 0) : null
    const paidUserHours = userHours ? userHours.filter(userHour => userHour.paid === 1) : null

    function findIcon(icon) {
        let decidedIcon = null;
        if(icon) {
            decidedIcon = icon
        } else {
            decidedIcon = updatedLoggedUser.icon
        }
        return profileIcon(decidedIcon);
    }

    function logout() {
        localStorage.setItem('token', null);
        localStorage.setItem('user', null);
        history.push("/login");
    }

    const leaderList = projects.data && updatedLoggedUser ? projects.data.map(project =>
        updatedLoggedUser.id === project.leader.id ? <Link key={project.id} className="projects" to={"/projects/" + project.id}><img src={(process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/' : 'http://wecreationapi.test/') + "projects/" + project.picture}/>{project.name}</Link> : null
    ) : null

    const eventsList = events.data && updatedLoggedUser ? events.data.map(event =>
        updatedLoggedUser.id === event.project.leader.id ? <Link key={event.id} className="projects" to={"/events/" + event.id}><img src={(process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/' : 'http://wecreationapi.test/') + "events/" + event.image}/>{event.name}</Link> : null
    ) : null;

    let teamList = [];

    if(events.data && updatedLoggedUser) {
        events.data.forEach(event => {
            event.skills.forEach(skill => {
                skill.users.forEach(user => {
                    if(user.id === updatedLoggedUser.id) {
                        event.team = 1;
                    }
                })
            })
        })

        events.data.forEach(event => {
            event.team && event.skills.forEach(skill => {
                skill.users.forEach(user => {
                    if(!teamList.find(item => item.id === user.id)) {
                        if(user.id !== updatedLoggedUser.id) {
                            teamList.push({id: user.id, name: user.name, icon: user.icon})
                        }
                    }
                })
            })
        })
    }
    
    if(parseInt(localStorage.getItem('firstLogin'))) {
        notify();
        localStorage.setItem('firstLogin', 0);
    }

    const calculateLevel = (skill) => {
        if(skill.hours > 150) {
            return <img src={badgeIcon(skill.name, "legend")}/>
        } else if(skill.hours > 75) {
            return <img src={badgeIcon(skill.name, "pro")}/>
        } else if(skill.hours > 25) {
            return <img src={badgeIcon(skill.name, "beginner")}/>
        } else {
            return <img src={badgeIcon(skill.name, "starter")}/>
        }
    }

    const likeUser = (user) => {
        Axios.post('/like-user', {
          'liker': JSON.parse(localStorage.getItem("user")),
          'user': user.id
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
          }
        })
        .then((response) => {
            getUsers();
        })
        .catch((error) => {

        })
      }

    return (
        <div className="height100">
            <Nav/>
            <div className="profile">
                <div className="container">
                    <div className="left">
                    {
                        !id ? <div>
                            <Link to={updatedLoggedUser && updatedLoggedUser.roles.find(role => role.id === 3) ? "/handelaar/create/" +  updatedLoggedUser.roles.find(role => role.id === 3).business_id : "/handelaar/create"}><img src={handel} alt=""/>Mijn handelszaak</Link>
                            <Link to={updatedLoggedUser && updatedLoggedUser.roles.find(role => role.id === 4) ? "/dienst/create/" +  updatedLoggedUser.roles.find(role => role.id === 4).business_id : "/dienst/create"}><img src={handel} alt=""/>Mijn diensten</Link>
                            <Link to={"/get/historiek"}><img src={kassa} alt=""/>Mijn kassatickets</Link>
                            <Link to={"/my-events"}><img src={agenda} alt=""/>Mijn projecten</Link>
                            <Link to={"/my-interests"}><img src={like} alt=""/>Mijn interesses</Link>
                            <a className="logout" onClick={() => logout()}><img src={logoutImg} alt=""/>Afmelden</a>
                        </div> : null
                    }
                    </div>
                    <div className="middle">
                        {
                            updatedLoggedUser ? updatedLoggedUser.image ?   <img className="profile-image"  src={(process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/' : 'http://wecreationapi.test/') + "users/" + updatedLoggedUser.image}/> : <FontAwesomeIcon icon={findIcon(null)} className="profile-icon" color="white"/> : null
                        }
                        <h2 className="profile-name">{updatedLoggedUser ? updatedLoggedUser.name : null}</h2>
                        {
                            !id ? <p className="profile-credits"><img src={credits} alt=""/>{updatedLoggedUser ? updatedLoggedUser.credits : null} cc</p> : null
                        }
                        
                        <div className="line"></div>
                    </div>
                    <div className="right">
                        {
                            !id ? <Link to={"/profiel/edit"}><img className="profile-edit" src={edit} alt=""/></Link> : updatedLoggedUser ? <div className={updatedLoggedUser.receivedLikes && updatedLoggedUser.receivedLikes.find(user => user.id === loggedUser.id) || liked ? "like liked" : "like"} onClick={e => updatedLoggedUser.receivedLikes && updatedLoggedUser.receivedLikes.find(user => user.id === loggedUser.id) ? null : likeUser(updatedLoggedUser)}>
                                <span>{liked ? updatedLoggedUser.receivedLikes.length + 1 : updatedLoggedUser.receivedLikes.length}</span>
                                <img src={like}/>
                            </div> : null
                        }
                    </div>
                </div>
                <div className="profile-container">
                    <div className="left">
                        <div>
                            <img src={credit} alt=""/>
                            <h2>Verdiende credits</h2>
                        </div>
                        <div>
                            <img src={master} alt=""/>
                            <h2>Master in</h2>
                        </div>
                        <div>
                            <img src={see} alt=""/>
                            <h2>Geen adres ingesteld</h2>
                        </div>
                        <div onClick={e => setEventsClicked(!eventsClicked)}>
                            <img src={navAgenda} alt=""/>
                            <h2>Lopende events</h2>
                            {eventsClicked ? eventsList : null}
                        </div>
                        <div onClick={e => setTeamClicked(!teamClicked)}>
                        <img src={team} alt=""/>
                            <h2>Bekende teamgenoten</h2>
                            {teamClicked ? teamList.map(user => 
                                <Link className="projects" to={"/profiel/" + user.id}><FontAwesomeIcon className="teamIcon" icon={findIcon(user.icon)} color="white"/>{user.name}</Link>                      
                            ) : null}
                        </div>
                        <div onClick={e => setLeaderClicked(!leaderClicked)}>
                            <img src={leader} alt=""/>
                            <h2>Projectleider van</h2>
                            {leaderClicked ? leaderList : null}
                        </div>
                    </div>
                    <div className="right">
                        <h2><img src={desc} alt=""/>Profielbeschrijving</h2>
                        <p>{updatedLoggedUser ? updatedLoggedUser.description : null}</p>
                        <h2><img src={data} alt=""/>Profielgegevens</h2>
                        {
                            updatedLoggedUser && updatedLoggedUser.age ? <p>{updatedLoggedUser.age} jaar</p> : null
                        }
                        <p>Actief Sinds {updatedLoggedUser ? date(updatedLoggedUser.created_at) : null}</p>
                        <p className="email">{updatedLoggedUser ? updatedLoggedUser.email : null}</p>
                        {
                        /*<h2><img src={get} alt=""/>Handelszaak</h2>
                        <p>Fix the grid</p>
                        <p>webdesign en grafische vormgeving</p>
                        <p className="email">www.fixthegrid.be</p>
                        <p>BE045 1574 215 154</p>*/
                        }
                    </div>
                </div>
                <div className="profile-below-container">
                    <div className="left">
                        <h2><img src={free} alt=""/>Vrijwillige uren</h2>
                        {
                            freeUserHours ? freeUserHours.map(userHour =>
                                <div className='skill' key={userHour.id}>
                                    <div className='nameAndIcon'>
                                        <img src={skillIcon(userHour.icon)}/>
                                        <p>{userHour.name}</p>
                                    </div>
                                    <p>{userHour.hours}u</p>
                                    <div className='progress'>
                                        <img style={{ left: userHour.hours / 10 * 2 + '%' }} src={userHour.hours > 150 ? legend : userHour.hours > 75 ? pro : userHour.hours > 25 ? beginner : starter}/>
                                    </div>
                                </div>
                            ) : null
                        }
                        <h2><img src={skill} alt=""/>Skill uren</h2>
                        {
                            paidUserHours ? paidUserHours.map(userHour =>
                                <div className='skill' key={userHour.id}>
                                    <div className='nameAndIcon'>
                                        <img src={skillIcon(userHour.icon)}/>
                                        <p>{userHour.name}</p>
                                    </div>
                                    <p>{userHour.hours}u</p>
                                    <div className='progress'>
                                        <img style={{ left: userHour.hours / 10 * 2 + '%' }} src={userHour.hours > 150 ? legend : userHour.hours > 75 ? pro : userHour.hours > 25 ? beginner : starter}/>
                                    </div>
                                </div>
                            ) : null
                        }
                    </div>
                    <div className="right">
                        <h2><img src={badges} alt=""/>Behaalde badges</h2>
                        <div className="badges">
                            {
                                userHoursTotal.map(skill => 
                                    <div key={skill.id}>
                                        {calculateLevel(skill)}
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}


export default connect(
    null,
    {getProjects, getUsers, getAllEvents}
)(Profiel);