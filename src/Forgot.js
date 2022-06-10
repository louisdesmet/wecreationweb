import React, {useState} from "react";
import axios from 'axios';
import locprod from './Global';

import './css/Login.scss';
import logo from './img/nav/logo.png';
import leftTop from './img/nav/left-top.png';
import leftBottom from './img/nav/left-bottom.png';
import rightTop from './img/nav/right-top.png';
import rightBottom from './img/nav/right-bottom.png';

axios.defaults.baseURL = locprod;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

function Forgot(props) {
    
    const [email, setEmail] = useState("");

    const onFormSubmit = e => {
      e.preventDefault();
      axios.post("/reset_password_without_token", {
        email
      }).then(result => {
        window.location.href = '/login'
      }).catch(e => {});
    }

    return (
        <div>
            <img className="left-top" src={leftTop} alt=""/>
            <img className="left-bottom" src={leftBottom} alt=""/>
            <img className="right-bottom" src={rightBottom} alt=""/>
            <img className="right-top" src={rightTop} alt=""/>
            <div className="login">
                <img className="logo" src={logo} alt=""/>
                <form onSubmit={onFormSubmit}>
                  <input onChange={e => { setEmail(e.target.value); }} placeholder="Email"/>
                  <button type="submit">Mail versturen</button>
                </form>
            </div>  
        </div>
    );
}

export default Forgot;
