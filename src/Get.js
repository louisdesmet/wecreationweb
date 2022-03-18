import React from 'react';
import Nav from "./Nav";
import { Link } from 'react-router-dom';
import './css/Get.scss';
import get from './img/nav/get.png';
import diensten from './img/map/diensten.png';
import vergoedingen from './img/get/vergoedingen.png';
import kassaticketjes from './img/get/kassaticketjes.png';

function Get(props) {
    return (
        <div className="height100">
            <Nav/>
            <div className="get-table">
                <Link className="get" to="/get/handelaars">
                    <img src={get}/>
                    <h2>Handelaars</h2>
                    <p>Kies voor deze optie als je jouw Collectieve Credits wil omruilen voor lokale producten en cadeaus</p>
                    <p className='bekijk'>Bekijk handelaars</p>
                </Link>
                <Link className="get" to="/get/diensten">
                    <img src={diensten}/>
                    <h2>Diensten</h2>
                    <p>Kies voor deze optie als je jouw Collectieve Credits wil omruilen voor lokale diensten.</p>
                    <p className='bekijk'>Bekijk diensten</p>
                </Link>
                <Link className="get" to="/get/vergoedingen">
                    <img src={vergoedingen}/>
                    <h2>Vergoedingen</h2>
                    <p>Kies voor deze optie als je jouw Collectieve Credits wil omruilen voor geld op jouw bankrekening.</p>
                    <p className='bekijk'>Bekijk vergoedingen</p>
                </Link>
                <Link className="get" to="/get/historiek">
                    <img src={kassaticketjes}/>
                    <h2>Kassaticketjes</h2>
                    <p>Kies voor deze optie als je een overzicht wil van al jouw voorgaande transacties.</p>  
                    <p className='bekijk'>Bekijk je kassaticketjes</p>
                </Link>
            </div>
        </div>
    );
}

export default Get;