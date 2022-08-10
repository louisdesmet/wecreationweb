import React, { useState } from "react";
import credit from './img/profile/credit.png';
import bag from './img/get/bag.png';
import coindown from './img/get/coindown.png';
import bill from './img/get/bill.png';
import Nav from "./Nav";
import { Link } from 'react-router-dom';
import Axios from 'axios';

function GetVergoedingenAankopen() {

  const [amount, setAmount] = useState("");



  return (
    <div className="height100">
      <Nav />
      <div className="vergoedingen">
        <img className="top" src={credit} />
        <h2>Aankopen collectieve credits</h2>
        <div className="line"></div>
        <div className="bottom-aankopen">
          <div className="input-div">
            <div>
              <input type="number" min="1" onChange={e => setAmount(e.target.value)} />
            </div>
            <div>
              <img className="coin" src={coindown} />
              <img className="bag" src={bag} />
            </div>
          </div>
          <div className="line"></div>
          <div>
            <img className="bill" src={bill} />
            <p className="credit">1€ / Credit</p>
          </div>
          <div className="line"></div>
          <div>
            <p className="result">{amount ? amount : "_ _"}€</p>
            <button className="buybutton">Aankopen</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GetVergoedingenAankopen;