import React, {useState} from "react";
import loginlogo from './img/loginlogo.PNG';
import loginrood from './img/loginrood.PNG';
import loginblauw from './img/loginblauw.PNG';
import registreren from './img/registreren.PNG';
import './css/Login.scss';
import axios from 'axios';
import { Link, Redirect } from "react-router-dom";
import locprod from './Global';
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
          props.history.push("/home");
        }
      }).catch(e => {
        setError("Email en paswoord combinatie niet gevonden.")
      });
    }

    return (
        <div>
            <img className="loginrood" src={loginrood} alt=""/>
            <img className="loginblauw" src={loginblauw} alt=""/>
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
