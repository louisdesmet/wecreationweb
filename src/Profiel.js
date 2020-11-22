import React from "react";
import credit from './img/credit.PNG';
import Nav from "./Nav";
function Profiel(props) {

    const user = JSON.parse(localStorage.getItem("user"));

    function logout() {
        localStorage.setItem('token', null);
        localStorage.setItem('user', null);
        props.history.push("/login");
    }

    return (
        <div>
           <Nav/>
           <div className="profiel">
            <p className="title">{user.name}</p>
            <p>Huidig saldo: <img src={credit} alt=""/>{user.credits}</p>
            <p onClick={() => logout()}>logout</p>
           </div>
        </div>
    );
}

export default Profiel;