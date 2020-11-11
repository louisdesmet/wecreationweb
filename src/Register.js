import React, {useState} from "react";
import loginlogo from './img/loginlogo.PNG';
import loginrood from './img/loginrood.PNG';
import loginblauw from './img/loginblauw.PNG';

import axios from 'axios';
import { Redirect } from "react-router-dom";
axios.defaults.baseURL = '142.93.239.42/api';
axios.defaults.headers.common['Accept'] = 'application/json';

function Register(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    function register() {
        axios.post("/register", {
          name,
          email,
          password
        }).then(result => {
          props.history.push("/login");
        }).catch(e => {
          console.log(e);
        });
      }
    return (
        <div>
            <img className="loginrood" src={loginrood} alt=""/>
            <img className="loginblauw" src={loginblauw} alt=""/>
            <div className="login">
                <img className="logo" src={loginlogo} alt=""/>
                <input onChange={e => { setName(e.target.value); }} placeholder="Naam"/>
                <input onChange={e => { setEmail(e.target.value); }} placeholder="Email"/>
                <input onChange={e => { setPassword(e.target.value); }} placeholder="Password" type="password"/>
                <button onClick={() => register()}>Registreren</button>
            </div>
        </div>
    );
}

export default Register;
