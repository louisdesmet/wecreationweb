import React, { useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { date, profileIcon } from "./Global";
import {getOrders} from "./redux/actions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import kassa from './img/profile/kassa.png';
import credit from './img/profile/credit.png';
import { Link } from "react-router-dom";
import Nav from "./Nav";

export const GetHistoriek = ({getOrders}) => {
  useEffect(() => {
    getOrders();
  }, []);

  const orders = useSelector(state => state.remoteOrders);

  const userOrders = orders.data ? orders.data.filter(order => {
    return order.user.id === JSON.parse(localStorage.getItem("user")).id
  }) : null;

  return (
    <div className="height100">
      <Nav/>
      <div className="historiek">
        <FontAwesomeIcon icon={profileIcon(JSON.parse(localStorage.getItem("user")).icon)} className="profile-icon" color="white"/>
        <h2><span>Kassaticketjes</span></h2>
        {
          userOrders ? userOrders.map(order =>
            <div key={order.id}>
              <Link to={"/orders/" + order.id}><img src={kassa}/>{ order.product.business.name + ' - ' + order.product.name }</Link>
              <p className="date">{date(order.created_at)}</p>
              <p>{ order.product.price }<img src={credit}/></p>
            </div>
          ) : null
        }
      </div>
    </div>
  );
}

export default connect(
  null,
  {getOrders}
)(GetHistoriek);