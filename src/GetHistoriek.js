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

  const userOrders = orders.data ? orders.data.filter(order => {
    return order.user.id === JSON.parse(localStorage.getItem("user")).id
  }) : null;

  const userTransfers = transfers.data ? transfers.data.filter(transfer => {
    return transfer.user.id === JSON.parse(localStorage.getItem("user")).id
  }) : null;

  const combined = userOrders && userTransfers ? userOrders.concat(userTransfers) : null;
  const sortedCombined = combined ? combined.sort((a,b) => { return new Date(b.created_at) - new Date(a.created_at) }) : null;



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
          sortedCombined ? sortedCombined.map(ticket =>
            typeof ticket.buy !== 'undefined' ? <div key={"transfer-"+ticket.id}>
              <Link to={"/transfers/" + ticket.id}><img src={credit}/>{ "Je aanvraag tot uitbetaling voor " + ticket.amount }</Link>
              <p className="date">{createdDate(ticket.created_at)}</p>
              <p className="amounttransfer">{ ticket.amount } €</p>
            </div> : <div key={"order-"+ticket.id}>
              <Link to={"/orders/" + ticket.id}><img src={kassa}/>{ ticket.product.business.name + ' - ' + ticket.product.name }</Link>
              <p className="date">{createdDate(ticket.created_at)}</p>
              <p>{ ticket.product.price }<img src={credit}/></p>
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