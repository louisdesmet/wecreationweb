import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getTransfers, getUsers} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link, useParams } from 'react-router-dom';
import Nav from './Nav';
import './css/OrderShow.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { profileIcon } from './Global';
import profile from './img/eventshow/profile-purple.png';
import location from './img/nav/see.png';
import get from './img/nav/get.png';
import credit from './img/profile/credit.png';
import { useHistory } from 'react-router-dom';

export const TransferShow = ({getTransfers, getUsers}) => {

  const history = useHistory();

  useEffect(() => {
    getTransfers();
    getUsers();
  }, []);

  const transfers = useSelector(state => state.remoteTransfers);
  const users = useSelector(state => state.remoteUsers);

  const { id } = useParams();
  const transfer = transfers.data ? transfers.data.find(transfer => transfer.id === parseInt(id)) : null;

 /* if(users.data && order) {
    users.data.forEach(user => {
      user.roles.forEach(role => {
        if(role.business_id === order.product.business.id) {
          order.leader = user
        }
      })
    })
  }*/

  return (
    <div className="height100">
      <Nav/>
      {
        transfer ? <div className="order-details">
          <div className='back' onClick={e =>  history.goBack()}>
            <span>&#10508;</span>
            <b>BACK</b>
          </div>
          <h2 className='titeltransfer'><span>Je wil {transfer.amount} credits omruilen voor {transfer.amount} euro</span></h2>
          <div className='product-container'>
            <div className='user-info'>
              <div>
                <p>Aangevraagd door:</p>
                <img src={profile}/>
                <p>{transfer.user.name}</p>
                <p>{transfer.user.email}</p>
              </div>
              <div>
                <p>{transfer.accepted ? 'Je aanvraag werd aanvaard.' : 'Je aanvraag is in behandeling.'}</p>
              </div>
            </div>
          </div>
        </div> : null
      }
      
    </div>
  );
}

export default connect(
    null,
    {getTransfers, getUsers}
  )(TransferShow);