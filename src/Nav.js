import React from "react";
import work from './img/work.PNG';
import see from './img/see.PNG';
import get from './img/get.PNG';
import logo from './img/logo.PNG';
import profiel from './img/profiel.PNG';
import agenda from './img/agenda.PNG';
import netwerk from './img/netwerk.PNG';
import {
  Link
} from "react-router-dom";
function Nav() {


  
  return (

    <div className='nav'>
        <div className='blue'><Link to="/work"><img src={work} alt=""/></Link></div>
        <div className='red'><Link to="/see"><img src={see} alt=""/></Link></div>
        <div className='blue'><Link to="/get"><img src={get} alt=""/></Link></div>
        <div><Link to="/home"><img src={logo} alt=""/></Link></div>
        <div className='red'><Link to="/profiel"><img src={profiel} alt=""/></Link></div>
        <div className='blue'><Link to="/agenda"><img src={agenda} alt=""/></Link></div>
        <div className='red'><Link to="/netwerk"><img src={netwerk} alt=""/></Link></div>
    </div>
  );
}

export default Nav;
