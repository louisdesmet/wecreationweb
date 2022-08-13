import React from "react";
import { createdDate, profileIcon } from "./Global";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import kassa from './img/profile/kassa.png';
import credit from './img/profile/credit.png';
import { Link } from "react-router-dom";
import Nav from "./Nav";
import { useHistory } from "react-router-dom";

function GetHistoriek(props) {

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const history = useHistory();

  const userOrders = props.orders.data ? props.orders.data.filter(order => {
    return loggedUser && order.user.id === loggedUser.id
  }) : null;

  const userTransfers = props.transfers.data ? props.transfers.data.filter(transfer => {
    return loggedUser && transfer.user.id === loggedUser.id
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
          { loggedUser ? <FontAwesomeIcon icon={profileIcon(loggedUser.icon)} className="profile-icon" color="white"/> : null}
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

export default GetHistoriek;