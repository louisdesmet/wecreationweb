import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getBusinesses} from "./redux/actions";
import {useSelector} from "react-redux";
import Nav from "./Nav";
import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faGlobe } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';

export const Get = ({getBusinesses}) => {

    const [current, setCurrent] = useState();
    useEffect(() => {
        getBusinesses();
    }, []);

    function show(type) {
        setCurrent(type);
    }

    return (
        <div>
            <Nav/>
            <div className="get-table">              
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
                    <div className="list-button">
                        <FontAwesomeIcon icon={faAngleDown}  size="lg" color="white"/>
                    </div>                       
                </div>
            </div>
            
        </div>
    );
}

function Middle(props) {

    const businesses = useSelector(state => state.remoteBusinesses);
 
    const businessFiltered = businesses.data ? ( Object.values(businesses.data).filter(function(item){
        return item.type === 'business';
    })) : null;
    const serviceFiltered = businesses.data ? ( Object.values(businesses.data).filter(function(item){
        return item.type === 'service';
    })) : null;

    if(props.current === "business" && businessFiltered !== null) {
        return (
        <div className="businesses-container">
          
                <div className="headers">
                    <p>Bedrijf</p>
                    <p>Omschrijving</p>
                    <p>Locatie</p>
                </div>
           
       
                {
                    businessFiltered.map(business =>
                        <div>
                            <div key={business.id}>
                                <p>{ business.name }</p>
                                <p>{ business.description }</p>
                                <p>{ business.location }</p>              
                            </div>
                            <div className="headers">
                                <p>Product</p>
                                <p>Op voorraad</p>
                                <p>Prijs</p>
                            </div>
                            {
                                business.products.map(product =>
                                    <div key={product.id}>
                                        <p>{ product.name }</p>
                                        <p>{ product.amount }</p>
                                        <p>{ product.price }</p>
                                    </div>
                                )
                            }
                        </div>
                    )
                }
             
        </div>
        );
    } else if(props.current === "service" && serviceFiltered !== null) {
        return (
        <table className="businesses-container">
            <thead>
                <tr className="headers">
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
    }
    return null;
}


export default connect(
    null,
    {getBusinesses}
  )(Get);