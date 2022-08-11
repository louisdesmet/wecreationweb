import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import {connect} from "react-redux";
import {getBusinesses, getOrders, getUsers} from "./redux/actions";
import Nav from "./Nav";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import './css/BusinessDashboard.scss';

export const BusinessDashboard = ({getOrders, getBusinesses, getUsers}) => {
  const history = useHistory();
  
  useEffect(() => {
    getOrders();
    getBusinesses();
    getUsers();
  }, []);

  const orders = useSelector(state => state.remoteOrders);
  const businesses = useSelector(state => state.remoteBusinesses);
  const users = useSelector(state => state.remoteUsers);

  const user = users.data ? users.data.find(user => user.id === JSON.parse(localStorage.getItem("user")).id) : null;

  const userBusiness = user ? user.roles.find(role => role.name === 'business') : null;

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
      <h2><span>Handelaars dashboard</span></h2>
      {
        orders.data.map(order =>  
          <> 
            {
              
              (order.product.business.id === business.id  && order.accepted === 0 ?
                <div className="leader-event" key={order.id}>
                    <p>{order.user.name}</p>
                    <p>{order.product.name}</p>
                    <p>{order.product.price + ' credits'}</p>
                    <p onClick={e => send(order.id)}>Accepteren</p>
                    <p>Afwijzen</p>
                </div> 
              : null)
            }
          </>
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
  { getOrders, getBusinesses, getUsers }
)(BusinessDashboard);
