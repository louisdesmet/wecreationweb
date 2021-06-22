import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import {connect} from "react-redux";
import {getBusinesses, getOrders} from "./redux/actions";
import Nav from "./Nav";
import { useHistory } from "react-router-dom";
import Axios from "axios";

export const BusinessDashboard = ({getOrders, getBusinesses}) => {
  const history = useHistory();
  
  useEffect(() => {
    getOrders();
    getBusinesses();
  }, []);

  const orders = useSelector(state => state.remoteOrders);
  const businesses = useSelector(state => state.remoteBusinesses);

  const userBusiness = JSON.parse(localStorage.getItem("user")).roles.find(role => role.name === 'business');

  const business = businesses.data && userBusiness ? businesses.data.find(business => business.id === userBusiness.business_id) : null;

  function send(id) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("token")
    }
    Axios.post('/verify-order', {
      'order': id
    }, {
      headers: headers
    })
    .then((response) => {
      window.location.href = "/handelaar-dashboard/";
    }).catch((error) => {})
  }

  const orderList = orders.data && business ? (
    <div className="leader-events">
      {
        orders.data.map(order =>
        
          <div className="leader-event" key={order.id}>
            
          {
            (order.product.business.id === business.id && order.accepted === 0 ?
              <div key={order.id}>
                  <p>{order.user.name}</p>
                  <p>{order.product.name}</p>
                  <p>{order.product.price + ' credits'}</p>
                  <p onClick={e => send(order.id)}>Accepteren</p>
                  <p>Afwijzen</p>
              </div> 
            : null)
          }
          </div>
        )
      }
    </div>
  ) : null;

  return (
    <div className="height100">
      <Nav/>
{orderList}
    </div>
  );
 
}


export default connect(
  null,
  { getOrders, getBusinesses }
)(BusinessDashboard);
