import React, {useEffect} from 'react';
import {connect} from "react-redux";
import {getSkills, getAllEvents} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link } from 'react-router-dom';
import './css/Admin.scss';
import AdminNav from "./AdminNav";
export const AdminProjectsEventsSkills = ({getProjects, getAllEvents}) => {

    useEffect(() => {
        getSkills();
        getAllEvents();
    }, []);

    const skills = useSelector(state => state.remoteSkills);
    const events = useSelector(state => state.remoteAllEvents);
    console.log(events.data);
    const eventList = events.data && skills.data ? (
        <div className='admin-projects'>
            <div>
                <p className='bold'>Naam</p>
                <p className='bold'>location</p>
                <p className='bold'>date</p>
                <p className='bold'>credits</p>
                <p></p>
            </div>
            {
                events.data.map(event => 
                    event.skill ? <div key={event.id}>
                        <p>{event.name}</p>
                        {JSON.parse(event.skill).map(item =>
                           <p>{skills.data.find(skill => item.id === skill.id).name}{item.hours}</p>
                        )}
                        <p><Link className='edit' to={"/admin-projects-events-skills/edit/" + event.id}>Aanpassen</Link></p>
                    </div> : null
                )
            }
        </div>
    ) : null;

    return (
        <div className='admin'>
            <div className='admin-container'>
                <AdminNav/>
                <div className='admin-container-right'>
                    <div className='admin-container-right-title'>
                        <h2>Project Event Skills</h2>
                        <p className='new'><Link to="/admin-projects-events/create">Voeg skill aan event</Link></p>
                    </div>
                    {eventList}
                </div>
            </div>
        </div>
    );
}

export default connect(
    null,
    {getSkills, getAllEvents}
)(AdminProjectsEventsSkills);