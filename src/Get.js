import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getBusinesses, getOrders} from "./redux/actions";
import {useSelector} from "react-redux";
import Nav from "./Nav";
import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faGlobe } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import Axios from 'axios';
import './css/Get.scss';
import location from './img/nav-see.png';
import accept from './img/accept.png';
export const Get = ({getBusinesses, getOrders}) => {

    const [current, setCurrent] = useState();
    useEffect(() => {
        getBusinesses();
        getOrders();

    }, []);

    function show(type) {
        setCurrent(type);
    }

    return (
        <div className="height100">
            <Nav/>
            <div className="get-table">  
                <Link className="get" to="/get/handelaars">
                    <h2>Handelaars</h2>
                    <p>Kies voor deze optie als je jouw Collectieve Credits wil omruilen voor lokale producten en cadeaus</p>
                    <div className="buttons">
                        <img src={accept}/>
                        <img src={location}/>
                    </div>
                </Link>
                <Link className="get" to="/get/diensten">
                    <h2>Diensten</h2>
                    <p>Kies voor deze optie als je jouw Collectieve Credits wil omruilen voor lokale diensten.</p>
                    <div className="buttons">
                        <img src={accept}/>
                        <img src={location}/>
                    </div>
                </Link>
                <Middle current={current}/>
                <Link className="get" to="/get/vergoedingen">
                    <h2>Vergoedingen</h2>
                    <p>Kies voor deze optie als je jouw Collectieve Credits wil omruilen voor geld op jouw bankrekening.</p>
                    <div className="buttons">
                        <img src={accept}/>
                    </div>
                </Link>
                <Link className="get" to="/get/historiek">
                    <h2>Historiek</h2>
                    <p>Kies voor deze optie als je een overzicht wil van al jouw voorgaande transacties.</p>
                    <div className="buttons">
                        <img src={accept}/>
                    </div>      
                </Link>
            </div>
            
        </div>
    );
}

function Middle(props) {

    const businesses = useSelector(state => state.remoteBusinesses);
    const orders = useSelector(state => state.remoteOrders);
 
    const businessFiltered = businesses.data ? ( Object.values(businesses.data).filter(function(item) {
        return item.type === 'business';
    })) : null;
    const serviceFiltered = businesses.data ? ( Object.values(businesses.data).filter(function(item) {
        return item.type === 'service';
    })) : null;

    const userOrders = orders.data ? orders.data.filter(order => {
        return order.user.id === JSON.parse(localStorage.getItem("user")).id
    }) : null;



    if(props.current === "business" && businessFiltered !== null) {

    } else if(props.current === "service" && serviceFiltered !== null) {

    } else if(props.current === "history" && userOrders !== null) {

    }
    return null;
}


export default connect(
    null,
    {getBusinesses, getOrders}
)(Get);