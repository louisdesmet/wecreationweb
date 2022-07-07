import React, { useState } from "react";
import credit from './img/profile/credit.png';
import bag from './img/get/bag.png';
import coinup from './img/get/coinup.png';
import bill from './img/get/bill.png';
import Nav from "./Nav";

function GetVergoedingenVerkopen() {

  const [amount, setAmount] = useState("");

  return (
    <div className="height100">
      <Nav/>
      <div className="vergoedingen">
        <img className="top" src={credit}/>
        <h2>Verkopen collectieve credits</h2>
        <div className="line"></div>
        <div className="bottom-aankopen">
          <div className="input-div">
            <div>
              <input type="text" onChange={e => setAmount(e.target.value)}/>
            </div>
            <div>
              <img className="coin" src={coinup}/>
              <img className="bag" src={bag}/>
            </div>
          </div>
          <div className="line"></div>
          <div>
            <img className="bill" src={bill}/>
            <p className="credit">1€ / Credit</p>
          </div>
          <div className="line"></div>
          <div>
            <p className="result">{amount ? amount : "_ _"}€</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GetVergoedingenVerkopen;