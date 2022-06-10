import React, {useState} from "react";
import axios from 'axios';
import locprod from './Global';

import './css/Login.scss';
import logo from './img/nav/logo.png';
import leftTop from './img/nav/left-top.png';
import leftBottom from './img/nav/left-bottom.png';
import rightTop from './img/nav/right-top.png';
import rightBottom from './img/nav/right-bottom.png';
import { useParams } from "react-router-dom";

axios.defaults.baseURL = locprod;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

function ResetPassword(props) {

    const { token, email } = useParams();

    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const onFormSubmit = e => {
      e.preventDefault();
      let replacedEmail = email.replace("%40", "@");
      if(password === password2) {
        axios.post("/reset_password_with_token", {
          password,
          token,
          replacedEmail
        }).then(result => {
          window.location.href = '/login';
        }).catch(e => {});
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
              <form onSubmit={onFormSubmit}>
                <input onChange={e => { setPassword(e.target.value); }} placeholder="Nieuw wachtwoord"/>
                <input onChange={e => { setPassword2(e.target.value); }} placeholder="Herhaal nieuw wachtwoord"/>
                <button type="submit">Wachtwoord aanpassen</button>
              </form>
          </div>
        </div>
    );
}

export default ResetPassword;
