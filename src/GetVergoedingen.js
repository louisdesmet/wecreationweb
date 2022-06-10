import React from "react";
import vergoedingen from './img/nav/vergoedingen.png';
import Nav from "./Nav";

function GetVergoedingen() {
  return (
    <div className="height100">
      <Nav/>
      <div className="vergoedingen">
        <img src={vergoedingen}/>
      </div>
    </div>
  );
}

export default GetVergoedingen;