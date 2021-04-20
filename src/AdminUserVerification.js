import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getUsers} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link } from 'react-router-dom';

export const AdminUserVerification = ({getUsers}) => {

    useEffect(() => {
      getUsers();
    }, []);

    const users = useSelector(state => state.remoteUsers);
    const locprod = (process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/api' : 'http://api.test/api');

    function accept(id) {
        fetch(locprod + '/users/' + id, {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
            body: JSON.stringify({
              email_verified_at: new Date().toJSON().slice(0, 19).replace('T', ' ')
            })
          }).then(response => {
            window.location.href = '/admin-user-verification';
          })
    }

    const userList = users.data ? (
        <div className='admin-projects'>
            <div>
                <p className='bold'>Naam</p>
                <p className='bold'>Email</p>
                <p></p>
            </div>
            {
                users.data.map(user =>
                    (!user.email_verified_at ? <div key={user.id}>
                        <p>{user.name}</p>
                        <p>{user.email}</p>
                        <p onClick={e => accept(user.id)}>Aanvaarden</p>
                    </div> : null)
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
                    {userList}
                </div>
            </div>
        </div>
    );
}

export default connect(
    null,
    {getUsers}
  )(AdminUserVerification);