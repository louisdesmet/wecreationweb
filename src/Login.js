import React, {useState} from "react";
import loginlogo from './img/loginlogo.PNG';
import loginrood from './img/loginrood.PNG';
import loginblauw from './img/loginblauw.PNG';
import registreren from './img/registreren.PNG';

import axios from 'axios';
import { Link, Redirect } from "react-router-dom";
axios.defaults.baseURL = 'https://api.wecreation.be/api';
axios.defaults.headers.common['Accept'] = 'application/json';

function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


  


    function login() {
        axios.post("/login", {
          email,
          password
        }).then(result => {
          if(result.data.token.access_token) {
            localStorage.setItem('token', result.data.token.access_token);
            localStorage.setItem('user', JSON.stringify(result.data.user));
            props.history.push("/home");
          }
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
                <input onChange={e => { setEmail(e.target.value); }} placeholder="Email"/>
                <input onChange={e => { setPassword(e.target.value); }} placeholder="Password" type="password"/>
                <button onClick={() => login()}>Aanmelden</button>
                <Link to="/register" className="register"><img src={registreren} alt=""/></Link>
            </div>  
        </div>
 
    );
}

export default Login;
