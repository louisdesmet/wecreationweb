import React, {useState} from "react";
import axios from 'axios';
import locprod from './Global';

import logo from './img/nav/logo.png';
import leftTop from './img/nav/left-top.png';
import leftBottom from './img/nav/left-bottom.png';
import rightTop from './img/nav/right-top.png';
import rightBottom from './img/nav/right-bottom.png';

import terms from './img/nav/ledencontract.pdf';

axios.defaults.baseURL = locprod;
axios.defaults.headers.common['Accept'] = 'application/json';

function Register(props) {

    const [error, setError] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeat, setRepeat] = useState("");
    const [name, setName] = useState("");
    const [checkbox, setCheckbox] = useState("");


    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    function register() {
      if(email && password && repeat && name && checkbox) {
        if(re.test(String(email).toLowerCase())) {
          if(password === repeat) {
            axios.post("/register", {
              name,
              email,
              password
            }).then(result => {
              /*localStorage.setItem('loginMessage', "Je account werd aangemaakt maar wacht nog op verificatie.");*/
              props.history.push("/login");
    
            })
          } else {
            setError("De wachtwoorden komen niet overeen.");
          }
        } else {
          setError("Je hebt geen correct email adres ingevuld.");
        }
      } else {
        setError("Gelieve alle verplichte velden in te vullen.");
      }
    }
    return (
        <div>
            <img className="left-top" src={leftTop} alt=""/>
            <img className="left-bottom" src={leftBottom} alt=""/>
            <img className="right-bottom" src={rightBottom} alt=""/>
            <img className="right-top" src={rightTop} alt=""/>
            <div className="login">
                <img className="logo" src={logo} alt=""/>
                <input onChange={e => { setName(e.target.value); }} placeholder="Naam"/>
                <input onChange={e => { setEmail(e.target.value); }} placeholder="Email"/>
                <input onChange={e => { setPassword(e.target.value); }} placeholder="Wachtwoord" type="password"/>
                <input onChange={e => { setRepeat(e.target.value); }} placeholder="Herhaal wachtwoord" type="password"/>
                <input onChange={e => { setCheckbox(e.target.value); }} type="checkbox" className="checkbox"/>
                <label>Ik ga akkoord met de <a href={terms} target="_blank">algemene voorwaarden</a></label>
                <p>{error}</p>
                <button onClick={() => register()}>Registreren</button>
            </div>
        </div>
    );
}

export default Register;
