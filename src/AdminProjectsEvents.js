import React, {useEffect} from 'react';
import {connect} from "react-redux";
import {getProjects, getAllEvents} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link } from 'react-router-dom';
import './css/Admin.scss';
import AdminNav from "./AdminNav";
export const AdminProjectsEvents = ({getProjects, getAllEvents}) => {

    useEffect(() => {
        getProjects();
        getAllEvents();
    }, []);

    const projects = useSelector(state => state.remoteProjects);
    const events = useSelector(state => state.remoteAllEvents);
    
    const eventList = events.data ? (
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
                    <div key={event.id}>
                        <p>{event.name}</p>
                        <p>{event.location}</p>
                        <p>{event.date}</p>
                        <p>{event.credits}</p> 
                        <p><Link className='edit' to={"/admin-projects-events/edit/" + event.id}>Aanpassen</Link></p>
                    </div>
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
                        <h2>Project Events</h2>
                        <p className='new'><Link to="/admin-projects-events/create">Nieuw Event</Link></p>
                    </div>
                    {eventList}
                </div>
            </div>
        </div>
    );
}

export default connect(
    null,
    {getProjects, getAllEvents}
  )(AdminProjectsEvents);