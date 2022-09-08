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

    const user = props.users.data.find(user => user.id === loggedUser.id);

    if(user) {
        user.activities.forEach(function (element) {
            element.type = "activity";
        });
        user.events.forEach(function (element) {
            element.type = "event";
        });
        user.givenLikes.forEach(function (element) {
            element.type = "user";
        });
    }

    const allItems = user.events.concat(user.activities).concat(user.businesses).concat(user.givenLikes);
 
    const sortedAllItems = allItems.sort((a,b) => { return new Date(b.liked_at) - new Date(a.liked_at) });

    const eventList = sortedAllItems ? (
        <div className='list'>
            {
                sortedAllItems.map(event =>
                    <Link to={
                        event.type === "event" ?
                            "events/" + event.id :
                        event.type === "activity" ?
                            "activities/" + event.id :
                        event.type === "business" ?
                            "get/handelaars/" + event.id + "/products" :
                        event.type === "user" ?
                            "profiel/" + event.id :
                        null
                    } 
                    className='item'
                    key={event.type + event.id}
                    >
                        <div>
                            <img src={event.type === "event" ?
                                work :
                            event.type === "activity" ?
                                evenementen :
                            event.type === "business" ?
                                get :
                            event.type === "user" ?
                                profile :
                            null}/>
                            <p>{event.name}</p>
                        </div>
                        <p>{datetime(event.liked_at)}</p>
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
            
            </div>
        </div>
    );
}


export default MyInterests;