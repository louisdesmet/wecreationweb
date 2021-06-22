import React, {useEffect} from 'react';
import {connect} from "react-redux";
import {getBusinesses} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link } from 'react-router-dom';
import './css/Admin.scss';

export const AdminBusinesses = ({getBusinesses}) => {

    useEffect(() => {
        getBusinesses();
    }, []);

    const businesses = useSelector(state => state.remoteBusinesses);

    const businessList = businesses.data ? (
        <div className='admin-projects'>
            <div>
                <p className='bold'>Naam</p>
                <p className='bold'>Type</p>
                <p className='bold'>Omschrijving</p>
                <p className='bold'>Locatie</p>
                <p className='bold'>Credits</p>
                <p></p>
            </div>
            {
                businesses.data.map(business =>
                    <div key={business.id}>
                        <p>{business.name}</p>
                        <p>{business.type}</p>
                        <p>{business.description}</p>
                        <p>{business.location}</p>
                        <p>{business.credits}</p>
                        <p><Link className='edit' to={"/admin-businesses/edit/" + business.id}>Aanpassen</Link></p>
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
                        <h2>Handelaars</h2>
                        <p className='new'><Link to="/admin-businesses/create">Nieuwe handelaar</Link></p>
                    </div>
                    {businessList}
                </div>
            </div>
        </div>
    );
}

export default connect(
    null,
    {getBusinesses}
)(AdminBusinesses);