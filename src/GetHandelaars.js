import Axios from "axios";
import React, { useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {getBusinesses} from "./redux/actions";
import Nav from "./Nav";
import get from './img/nav/get.png';
import location from './img/nav/see.png';

export const GetHandelaars = ({getBusinesses}) => {

  useEffect(() => {
    getBusinesses();
  }, []);

  const businesses = useSelector(state => state.remoteBusinesses);

  const businessFiltered = businesses.data ? ( Object.values(businesses.data).filter(function(item) {
    return item.type === 'business';
  })) : null;

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

  return (
    <div className="height100">
      <Nav/>
      <div className="business-container">
        <img className="logo" src={get}/>
        <h2 className="title"><span>Handelaars</span></h2>
          <div className="business-flex">
            {
                businessFiltered ? businessFiltered.map(business =>
                    <Link to={"/get/handelaars/" + business.id + "/products"} className="business-data" key={business.id}>
                      <img className="logo" src={get}/>
                      <h2>{ business.name }</h2>
                      <p className="desc-title">Beschrijving</p>
                      <p className="desc">{ business.description }</p>
                      <div>
                        <p><img src={location}/>{ business.location }</p>
                      </div>
                      <p className='bekijk'>Bekijk handelaar</p>
                      
                    </Link>
                ) : null
            }
          </div>
      </div>
    </div>
  );
}

export default connect(
  null,
  {getBusinesses}
)(GetHandelaars);