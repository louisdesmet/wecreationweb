import React, {useEffect} from 'react';
import {connect} from "react-redux";
import {getActivities} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link } from 'react-router-dom';

export const AdminActivities = ({getActivities}) => {

    useEffect(() => {
        getActivities();
    }, []);

    const activities = useSelector(state => state.remoteActivities);

    const activityList = activities.data ? (
        <div className='admin-projects'>
            <div>
                <p className='bold'>Naam</p>
                <p className='bold'>Locatie</p>
                <p className='bold'>Date</p>
                <p></p>
            </div>
            {
                activities.data.map(activity =>
                    <div key={activity.id}>
                        <p>{activity.name}</p>
                        <p>{activity.location}</p>
                        <p>{activity.date}</p>
                        <p><Link className='edit' to={"/admin-activities/edit/" + activity.id}>Aanpassen</Link></p>
                    </div>
                )
            }
        </div>
    ) : null;


    return (
        <div className='admin'>
            <div className='admin-container'>
                <div className='admin-container-left'>
                <h1>Admin Paneel</h1>
                    <ul>
                        <li><Link to={"/admin-projects"}>Projecten</Link></li>
                        <li><Link to={"/admin-projects-events"}>Project events</Link></li>
                        <li><Link to={"/admin-businesses"}>Handelaars</Link></li>
                        <li><Link to={"/admin-activities"}>Activiteiten</Link></li>
                        <li><Link to={"/admin-user-verification"}>Gebruikers verificatie</Link></li>
                    </ul>
                </div>
                <div className='admin-container-right'>
                    <div className='admin-container-right-title'>
                        <h2>Activiteiten</h2>
                        <p className='new'><Link to="/admin-activities/create">Nieuwe activiteit</Link></p>
                    </div>
                    {activityList}
                </div>
            </div>
        </div>
    );
}

export default connect(
    null,
    {getActivities}
)(AdminActivities);