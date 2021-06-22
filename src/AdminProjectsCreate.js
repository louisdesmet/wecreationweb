import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getUsers} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link } from 'react-router-dom';
import locprod from './Global';
import './css/Admin.scss';

export const AdminProjectsCreate = ({getUsers}) => {

    useEffect(() => {
      getUsers();
    }, []);

    const users = useSelector(state => state.remoteUsers);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [credits, setCredits] = useState("");
    const [leader, setLeader] = useState("");
    
    function submit() {
        fetch(locprod + '/projects', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
          },
          body: JSON.stringify({
            name: name,
            description: description,
            credits: credits,
            leader: leader
          })
        }).then(response => {
          window.location.href = '/admin-projects';
        })
    }

    const userList =  users.data ? users.data.map(user => <option key={user.id} value={user.id}>{user.name}</option>) : null;

    return (
      <div className='create'>
          <h2>Project aanmaken</h2>
          <input onChange={e => setName(e.target.value)} placeholder='Naam'/>
          <input onChange={e => setDescription(e.target.value)} placeholder='Description'/>
          <input onChange={e => setCredits(e.target.value)} placeholder='Credits'/>
          <select onChange={e => setLeader(e.target.value)}>
              {userList}
          </select>
          <input onClick={submit} type='submit' value='Toevoegen'/>
      </div>
    );
}

export default connect(
    null,
    {getUsers}
  )(AdminProjectsCreate);