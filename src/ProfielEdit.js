import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getUsers} from "./redux/actions";
import Nav from "./Nav";
import {useSelector} from "react-redux";
import './css/Profiel.scss';
import Axios from 'axios';

export const ProfielEdit = ({getUsers}) => {

    const loggedUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        getUsers();
    }, []);

    const [desc, setDesc] = useState();
    const [age, setAge] = useState();

    const users = useSelector(state => state.remoteUsers);

    const updatedLoggedUser = users.data ? users.data.find(item => item.id === loggedUser.id) : null;

    function edit() {
        Axios.post('/users/editdata', {
            'age': age,
            'description': desc,
            'id': updatedLoggedUser.id
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        })
        .then((response) => {
            window.location.href = '/profiel';
        })
        .catch((error) => {
    
        })
    }

    return (
        <div className="height100">
            <Nav/>
            <div className="profile-edit">
                {
                    updatedLoggedUser ? <div>
                        <textarea onChange={e => setDesc(e.target.value)} defaultValue={updatedLoggedUser.description} placeholder='Description'></textarea>
                        <input onChange={e => setAge(e.target.value)} defaultValue={updatedLoggedUser.age} placeholder='Age'/>
                        <button onClick={e => edit()}>Aanpassen</button>
                    </div> : null
                }
                
            </div>
        </div>
    );
}


export default connect(
    null,
    {getUsers}
)(ProfielEdit);