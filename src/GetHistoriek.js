import React from "react";
import { createdDate, date, profileIcon } from "./Global";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import kassa from './img/profile/kassa.png';
import credit from './img/profile/credit.png';
import { Link } from "react-router-dom";
import Nav from "./Nav";
import { useHistory } from "react-router-dom";
import work from './img/nav/work.png';

function GetHistoriek(props) {

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const history = useHistory();

  const userOrders = props.orders.data.filter(order => {
    return loggedUser && order.user.id === loggedUser.id
  });

  const userTransfers = props.transfers.data.filter(transfer => {
    return loggedUser && transfer.user.id === loggedUser.id
  });

  let userWorked = [];

  props.events.data.forEach(event => {
    event.skills.forEach(skill => {
      skill.users.forEach(user => {
        if(loggedUser && user.present === 1 && user.id === loggedUser.id) {
          userWorked.push({
            event_skill_user_id: user.event_skill_user_id,
            eventId: event.id,
            eventName: event.name,
            skillId: skill.skill.id,
            skillName: skill.skill.name,
            hours: skill.hours,
            created_at: user.present_at,
            present: user.present
          });
        }
      })
    })
  });

  const combined = userOrders.concat(userTransfers, userWorked);
  const sortedCombined = combined.sort((a,b) => { return new Date(b.created_at) - new Date(a.created_at) });

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
              <p className="lastp amounttransfer">{ ticket.amount } €</p>
            </div> : typeof ticket.present !== 'undefined' ? <div key={"userWorked-"+ticket.event_skill_user_id}>
              <Link to={"/event/" + ticket.eventId + "/skill/" + ticket.skillId}><img src={work}/>{ ticket.eventName + ' - ' + ticket.skillName }</Link>
              <p className="date">{date(ticket.created_at)}</p>
              <p className="lastp">{ ticket.hours }<img src={credit}/></p>
            </div> : <div key={"order-"+ticket.id}>
              <Link to={"/orders/" + ticket.id}><img src={kassa}/>{ ticket.product.business.name + ' - ' + ticket.product.name }</Link>
              <p className="date">{createdDate(ticket.created_at)}</p>
              <p className="lastp">{ ticket.product.price }<img src={credit}/></p>
            </div>
          ) : null
        }
      </div>
    </div>
  );
}

export default GetHistoriek;