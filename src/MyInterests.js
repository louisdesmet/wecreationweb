import React, {useEffect} from 'react';
import {connect} from "react-redux";
import {getUsers} from "./redux/actions";
import Nav from "./Nav";
import {useSelector} from "react-redux";
import './css/MyInterests.scss';
import {datetime} from './Global';
import get from './img/nav/get.png';
import work from './img/nav/work.png';
import evenementen from './img/profile/badges.png';
import profile from './img/nav/profile.png';
import { Link } from 'react-router-dom';
export const Profiel = ({getUsers}) => {

    const loggedUser = JSON.parse(localStorage.getItem("user"));
    
    useEffect(() => {
        getUsers();
    }, []);

    const users = useSelector(state => state.remoteUsers);

    console.log(users.data);
    const user = users.data ? users.data.find(user => user.id === loggedUser.id) : null
    
    const eventList = user ? (
        <div className='list'>
            {
                user.events.map(event =>
                    <Link to={"events/" + event.id} className='item' key={event.id}>
                        <div>
                            <img src={work}/>
                            <p>{event.name}</p>
                        </div>
                        <p>{datetime(event.liked_at)}</p>
                    </Link>
                )
            }
        </div>
    ) : null;

    const activityList = user ? (
        <div className='list'>
            {
                user.activities.map(activity =>
                    <Link to={"activities/" + activity.id} className='item' key={activity.id}>
                        <div>
                            <img src={evenementen}/>
                            <p>{activity.name}</p>
                        </div>
                        <p>{datetime(activity.liked_at)}</p>
                    </Link>
                )
            }
        </div>
    ) : null;

    const businessList = user ? (
        <div className='list'>
            {
                user.businesses.map(business =>
                    <Link to={"get/handelaars/" + business.id + "/products"} className='item' key={business.id}>
                        <div>
                            <img src={get}/>
                            <p>{business.name}</p>
                        </div>
                        <p>{datetime(business.liked_at)}</p>
                    </Link>
                )
            }
        </div>
    ) : null;

    const userList = user ? (
        <div className='list'>
            {
                user.users.map(user =>
                    <Link to={"profiel/" + user.id} className='item' key={user.id}>
                        <div>
                            <img src={profile}/>
                            <p>{user.name}</p>
                        </div>
                        <p>{datetime(user.liked_at)}</p>
                    </Link>
                )
            }
        </div>
    ) : null;

    return (
        <div className="height100">
            <Nav/>
            <div className='interest-container'>
                <h2>Mijn interesses</h2>
                {eventList}
                {activityList}
                {businessList}
                {userList}
            </div>
        </div>
    );
}


export default connect(
    null,
    {getUsers}
)(Profiel);