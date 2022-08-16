import React from 'react';
import Nav from "./Nav";
import './css/MyInterests.scss';
import {datetime} from './Global';
import get from './img/nav/get.png';
import work from './img/nav/work.png';
import evenementen from './img/profile/badges.png';
import profile from './img/nav/profile.png';
import { Link } from 'react-router-dom';

function MyInterests(props) {

    const loggedUser = JSON.parse(localStorage.getItem("user"));

    const user = props.users.data.find(user => user.id === loggedUser.id)
    
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
                user.givenLikes.map(user =>
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


export default MyInterests;