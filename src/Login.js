import React, {useState} from "react";
import axios from 'axios';
import { Link, Redirect } from "react-router-dom";
import locprod from './Global';

import './css/Login.scss';
import loginlogo from './img/nav/loginlogo.PNG';
import leftTop from './img/nav/left-top.png';
import leftBottom from './img/nav/left-bottom.png';
import rightTop from './img/nav/right-top.png';
import rightBottom from './img/nav/right-bottom.png';
import registreren from './img/nav/registreren.PNG';

axios.defaults.baseURL = locprod;
axios.defaults.headers.common['Accept'] = 'application/json';

function Login(props) {
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onFormSubmit = e => {
      e.preventDefault();
      axios.post("/login", {
        email,
        password
      }).then(result => {
        if(result.data.token.access_token) {
          localStorage.setItem('token', result.data.token.access_token);
          localStorage.setItem('user', JSON.stringify(result.data.user[0]));
          /*localStorage.removeItem("loginMessage");*/
        }
      }).catch(e => {
        setError("Email en paswoord combinatie niet gevonden.")
      });
    }

    return (
        <div>
            {
              /*localStorage.getItem("loginMessage") ? <div className="login-message">{localStorage.getItem("loginMessage")}</div> : null*/
            }
            <img className="left-top" src={leftTop} alt=""/>
            <img className="left-bottom" src={leftBottom} alt=""/>
            <img className="right-bottom" src={rightBottom} alt=""/>
            <img className="right-top" src={rightTop} alt=""/>
            <div className="login">
                <img className="logo" src={loginlogo} alt=""/>
                <form onSubmit={onFormSubmit}>
                  <input onChange={e => { setEmail(e.target.value); }} placeholder="Email"/>
                  <input onChange={e => { setPassword(e.target.value); }} placeholder="Password" type="password"/>
                  {error}
                  <button type="submit">Aanmelden</button>
                </form>            
                <Link to="/register" className="register"><img src={registreren} alt=""/></Link>
            </div>  
        </div>
    );
}

export default Login;
