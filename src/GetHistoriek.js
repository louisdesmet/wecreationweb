import React, { useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { createdDate, profileIcon } from "./Global";
import {getOrders, getTransfers} from "./redux/actions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import kassa from './img/profile/kassa.png';
import credit from './img/profile/credit.png';
import { Link } from "react-router-dom";
import Nav from "./Nav";
import { useHistory } from "react-router-dom";

export const GetHistoriek = ({getOrders, getTransfers}) => {

  const history = useHistory();
  
  useEffect(() => {
    getOrders();
    getTransfers();
  }, []);

  const orders = useSelector(state => state.remoteOrders);
  const transfers = useSelector(state => state.remoteTransfers);
  console.log(transfers);

  const userOrders = orders.data ? orders.data.filter(order => {
    return order.user.id === JSON.parse(localStorage.getItem("user")).id
  }) : null;

  const userTransfers = transfers.data ? transfers.data.filter(transfer => {
    return transfer.user.id === JSON.parse(localStorage.getItem("user")).id
  }) : null;

  return (
    <div className="height100">
      <Nav/>
      <div className="historiek">
        <div className='back' onClick={e =>  history.goBack()}>
            <span>&#10508;</span>
            <b>BACK</b>
        </div>
        <div className="profile-icon-cont">
          <FontAwesomeIcon icon={profileIcon(JSON.parse(localStorage.getItem("user")).icon)} className="profile-icon" color="white"/>
        </div>
        <h2><span>Kassaticketjes</span></h2>
        {
          userTransfers ? userTransfers.map(transfer =>
            <div key={transfer.id}>
              <Link to={"/transfers/" + transfer.id}><img src={credit}/>{ "Je aanvraag tot uitbetaling voor " + transfer.amount }</Link>
              <p className="date">{createdDate(transfer.created_at)}</p>
              <p className="amounttransfer">{ transfer.amount } €</p>
            </div>
          ) : null
        }
        {
          userOrders ? userOrders.map(order =>
            <div key={order.id}>
              <Link to={"/orders/" + order.id}><img src={kassa}/>{ order.product.business.name + ' - ' + order.product.name }</Link>
              <p className="date">{createdDate(order.created_at)}</p>
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
  {getOrders, getTransfers}
)(GetHistoriek);