import React, { useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {getBusinesses} from "./redux/actions";
export const GetDiensten = ({getBusinesses}) => {

  useEffect(() => {
    getBusinesses();
  }, []);

  const businesses = useSelector(state => state.remoteBusinesses);

  const serviceFiltered = businesses.data ? ( Object.values(businesses.data).filter(function(item) {
    return item.type === 'service';
  })) : null;


  return (
    <div className="business-container">
      <h2 className="title">Diensten</h2>
      <div className="business-flex">
        {
            serviceFiltered ? serviceFiltered.map(business =>
                <Link to={"/get/handelaars/" + business.id + "/products"} className="business-data" key={business.id}>
                  <h2>{ business.name }</h2>
                  <p>{ business.description }</p>
                  <p>{ business.location }</p>
                </Link>
            ) : null
        }
      </div>
    </div>
  );
}

export default connect(
  null,
  {getBusinesses}
)(GetDiensten);
