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
                <div className="businesses get">
                    <h2>Handelaars</h2>
                    <p>Kies voor deze optie als je jouw Collectieve Credits wil omruilen voor lokale producten en cadeaus</p>
                    <div className="flex-buttons">
                        <div className="list-button" onClick={() => show("business")}>
                            <FontAwesomeIcon icon={faAngleDown}  size="lg" color="white"/>
                        </div>
                        <Link to="/see" className="globe-button">
                            <FontAwesomeIcon icon={faGlobe}  size="lg" color="white"/>
                        </Link>
                    </div>
                </div>          
                <div className="services get">
                    <h2>Diensten</h2>
                    <p>Kies voor deze optie als je jouw Collectieve Credits wil omruilen voor lokale diensten.</p>
                    <div className="flex-buttons">
                        <div className="list-button" onClick={() => show("service")}>
                            <FontAwesomeIcon icon={faAngleDown}  size="lg" color="white"/>
                        </div>
                        <Link to="/see" className="globe-button">
                            <FontAwesomeIcon icon={faGlobe}  size="lg" color="white"/>
                        </Link>
                    </div> 
                </div>
                <Middle current={current}/>
                <div className="payout get">
                    <h2>Vergoedingen</h2>
                    <p>Kies voor deze optie als je jouw Collectieve Credits wil omruilen voor geld op jouw bankrekening.</p>
                    <div className="list-button">
                        <FontAwesomeIcon icon={faAngleDown}  size="lg" color="white"/>
                    </div>
                </div>
                <div className="history get">
                    <h2>Historiek</h2>
                    <p>Kies voor deze optie als je een overzicht wil van al jouw voorgaande transacties.</p>
                    <div className="list-button" onClick={() => show("history")}>
                        <FontAwesomeIcon icon={faAngleDown}  size="lg" color="white"/>
                    </div>                       
                </div>
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

    function buy(product) {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
        Axios.post('/orders', {
            product: product.id,
            user: JSON.parse(localStorage.getItem("user")).id
          }, {
            headers: headers
          })
          .then((response) => {
            window.location.href = '/orders/' + response.data.id;
          })
          .catch((error) => {
            
          })
    }

    if(props.current === "business" && businessFiltered !== null) {
        return (
        <div className="businesses-container">
          
                <div className="headers">
                    <p>Bedrijf</p>
                    <p>Omschrijving</p>
                    <p>Locatie</p>
                </div>
           
                <div className="business-body">
                    {
                        businessFiltered.map(business =>
                            <div className="business-data">
                                <div className="business-data-inner" key={business.id}>
                                    <p>{ business.name }</p>
                                    <p>{ business.description }</p>
                                    <p>{ business.location }</p>              
                                </div>
                                {
                                    Object.keys(business.products).length !== 0 ? <div className="headers prod-head">
                                        <p>Product</p>
                                        <p>Op voorraad</p>
                                        <p>Prijs</p>
                                        <p></p>
                                    </div> : null
                                }
                                
                                <div className="products">
                                    {
                                        business.products.map(product =>
                                            <div className="product" key={product.id}>
                                                <p>{ product.name }</p>
                                                <p>{ product.amount }</p>
                                                <p>{ product.price }</p>
                                                <p onClick={() => buy(product)}><span className="product-buy">Aankopen</span></p>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
                
             
        </div>
        );
    } else if(props.current === "service" && serviceFiltered !== null) {
        return (
        <table className="businesses-container">
            <thead>
                <tr>
                    <th>Bedrijf</th>
                    <th>Omschrijving</th>
                    <th>Locatie</th>
                </tr>
            </thead>
            <tbody>
                {
                    serviceFiltered.map(business =>
                        <tr key={business.id}>
                            <td>{ business.name }</td>
                            <td>{ business.description }</td>
                            <td>{ business.location }</td>
                        </tr>
                    )
                }
            </tbody>          
        </table>
        );
    } else if(props.current === "history" && userOrders !== null) {
        return (
            <table className="businesses-container">
                <thead>
                    <tr>
                        <th>Product naam</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        userOrders.map(order =>
                         
                            (order.accepted === 1 ? <tr key={order.id}>
                                <td>{ order.product.name }</td>
                                <td>{ order.product.price }</td>
                            </tr> : null)
                           
                        )
                    }
                </tbody>          
            </table>
        );
    }
    return null;
}


export default connect(
    null,
    {getBusinesses, getOrders}
  )(Get);