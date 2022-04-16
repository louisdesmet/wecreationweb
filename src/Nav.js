import React from "react";
import work from './img/nav/work.png';
import see from './img/nav/see.png';
import get from './img/nav/get.png';
import random from './img/nav/random.png';
import profiel from './img/nav/profile.png';
import agenda from './img/nav/agenda.png';
import netwerk from './img/nav/network.png';
import {Link} from "react-router-dom";
import './css/Nav.scss';
function Nav() {
  
  return (

    <div className='nav'>
        <div className="innernav">
            <div><Link to="/work"><img src={work} alt=""/></Link></div>
            <div><Link to="/see"><img src={see} alt=""/></Link></div>
            <div><Link to="/get"><img src={get} alt=""/></Link></div>
            <div><Link to="/home"><img src={random} alt=""/></Link></div>
            <div><Link to="/profiel"><img src={profiel} alt=""/></Link></div>
            <div><Link to="/agenda"><img src={agenda} alt=""/></Link></div>
            <div><Link to="/netwerk"><img src={netwerk} alt=""/></Link></div>
        </div>
    </div>
  );
}

export default Nav;
