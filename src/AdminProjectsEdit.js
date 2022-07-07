import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getUsers, getProjects} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link, useParams } from 'react-router-dom';
import locprod from './Global';
import './css/Admin.scss';

export const AdminProjectsEdit = ({getUsers, getProjects}) => {

    useEffect(() => {
      getUsers();
      getProjects();
    }, []);

    const projects = useSelector(state => state.remoteProjects);

    const { id } = useParams();
    const project = projects.data ? projects.data.find(project => project.id === parseInt(id)) : null;

    const users = useSelector(state => state.remoteUsers);

    const [name, setName] = useState(project.name);
    const [description, setDescription] = useState(project.description);
    const [credits, setCredits] = useState(project.credits);
    const [leader, setLeader] = useState(project.leader_id);
    
    function submit() {
        fetch(locprod + '/projects/' + project.id, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
          },
          body: JSON.stringify({
            name: name,
            description: description,
            credits: credits,
            leader: leader,
            type: "Overige"
          })
        }).then(response => {
          window.location.href = '/admin-projects';
        })
    }

    const userList =  users.data ? users.data.map(user => <option key={user.id} value={user.id}>{user.name}</option>) : null;

    return (
      <div className='create'>
          <h2>Project aanmaken</h2>
          <input onChange={e => setName(e.target.value)} defaultValue={project.name} placeholder='Naam'/>
          <input onChange={e => setDescription(e.target.value)} defaultValue={project.description} placeholder='Description'/>
          <input onChange={e => setCredits(e.target.value)} defaultValue={project.credits} placeholder='Credits'/>
          <select onChange={e => setLeader(e.target.value)} defaultValue={project.leader.id}>
              {userList}
          </select>
          <input onClick={submit} type='submit' value='Toevoegen'/>
      </div>
    );
}

export default connect(
    null,
    {getUsers, getProjects}
  )(AdminProjectsEdit);