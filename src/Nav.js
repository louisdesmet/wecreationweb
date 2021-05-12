import React from "react";
import work from './img/nav-work.png';
import see from './img/nav-see.png';
import get from './img/nav-get.png';
import logo from './img/nav-random.png';
import profiel from './img/nav-profiel.png';
import agenda from './img/nav-agenda.png';
import netwerk from './img/nav-netwerk.png';
import {
  Link
} from "react-router-dom";
function Nav() {
  
  return (

    <div className='nav'>
        <div><Link to="/work"><img src={work} alt=""/></Link></div>
        <div><Link to="/see"><img src={see} alt=""/></Link></div>
        <div><Link to="/get"><img src={get} alt=""/></Link></div>
        <div><Link to="/home"><img src={logo} alt=""/></Link></div>
        <div><Link to="/profiel"><img src={profiel} alt=""/></Link></div>
        <div><Link to="/agenda"><img src={agenda} alt=""/></Link></div>
        <div><Link to="/netwerk"><img src={netwerk} alt=""/></Link></div>
    </div>
  );
}

export default Nav;
