import React from "react";
import { Link } from "react-router-dom";
import Nav from "./Nav";
import diensten from './img/map/diensten.png';
import location from './img/nav/see.png';
function GetDiensten(props) {

  const serviceFiltered = props.businesses.data ? ( Object.values(props.businesses.data).filter(function(item) {
    return item.type === 'service';
  })) : null;


  return (
    <div className="height100">
      <Nav/>
      <div className="business-container">
        <img className="logo" src={diensten}/>
        <h2 className="title"><span>Handelaars</span></h2>
        <div className="business-flex">
          {
              serviceFiltered ? serviceFiltered.map(business =>
                  <Link to={"/get/handelaars/" + business.id + "/products"} className="business-data" key={business.id}>
                    <img className="logo" src={diensten}/>
                    <h2>{ business.name }</h2>
                    <p className="desc-title">Beschrijving</p>
                    <p className="desc">{ business.description }</p>
                    {
                      business.location ? <div>
                        <p><img src={location}/>{ business.location }</p>
                      </div> : null
                    }
                    <p className='bekijk'>Bekijk dienst</p>
                  </Link>
              ) : null
          }
        </div>
      </div>
    </div>
  );
}

export default GetDiensten;
