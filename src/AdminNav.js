import React from "react";

import {Link} from "react-router-dom";

function Nav() {
  
  return (
    <div className='admin-container-left'>
        <h1>Admin Paneel</h1>
        <ul>
            <li><Link to={"/admin-projects"}>Projecten</Link></li>
            <li><Link to={"/admin-projects-events"}>Project events</Link></li>
            <li><Link to={"/admin-projects-events-skills"}>Project event skills</Link></li>
            <li><Link to={"/admin-businesses"}>Handelaars</Link></li>
            <li><Link to={"/admin-products"}>Producten</Link></li>
            <li><Link to={"/admin-activities"}>Activiteiten</Link></li>
            <li><Link to={"/admin-user-verification"}>Gebruikers verificatie</Link></li>
        </ul>
    </div>
  );
}

export default Nav;
