import React from "react";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import './css/BusinessDashboard.scss';

function BusinessDashboard(props) {

  const history = useNavigate();

  const user = props.users.data.find(user => user.id === JSON.parse(localStorage.getItem("user")).id);

  const userBusiness = user.roles.find(role => role.name === 'business');

  const business = props.businesses.data.find(business => business.id === userBusiness.business_id);

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

  const orderList = (
    <div className="leader-events">
      <h2><span>Handelaars dashboard</span></h2>
      {
        props.orders.data.map(order =>  
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
  );

  return (
    <div className="height100">
      <Nav/>
      {orderList}
    </div>
  );
 
}


export default BusinessDashboard;
