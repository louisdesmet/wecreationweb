import React from "react";
import credit from './img/credit.PNG';
import Nav from "./Nav";
function Profiel() {

    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div>
           <Nav/>
           <div className="profiel">
            <p className="title">{user.name}</p>
            <p>Huidig saldo: <img src={credit} alt=""/>{user.credits}</p>
           </div>
        </div>
    );
}

export default Profiel;