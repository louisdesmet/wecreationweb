import React from "react";
import credit from './img/profile/credit.png';
import bag from './img/get/bag.png';
import coinup from './img/get/coinup.png';
import coindown from './img/get/coindown.png';
import Nav from "./Nav";
import { Link } from "react-router-dom";

function GetVergoedingen() {
  return (
    <div className="height100">
      <Nav/>
      <div className="vergoedingen">
        <img className="top" src={credit}/>
        <h2>Collectieve credits</h2>
        <div className="line"></div>
        <div className="bottom">
          <div>
            <img className="coin" src={coinup}/>
            <img className="bag" src={bag}/>
            <Link to={"/get/vergoedingen/aankopen"}>Aankopen</Link>
          </div>
          <div>
            <img className="coin" src={coindown}/>
            <img className="bag" src={bag}/>
            <Link to={"/get/vergoedingen/verkopen"}>Verkopen</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GetVergoedingen;