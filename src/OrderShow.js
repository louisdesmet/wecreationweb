import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getOrders, getUsers} from "./redux/actions";
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

export const OrderShow = ({getOrders, getUsers}) => {

  const history = useHistory();

  useEffect(() => {
    getOrders();
    getUsers();
  }, []);

  const orders = useSelector(state => state.remoteOrders);
  const users = useSelector(state => state.remoteUsers);

  const { id } = useParams();
  const order = orders.data ? orders.data.find(order => order.id === parseInt(id)) : null;

  if(users.data && order) {
    users.data.forEach(user => {
      user.roles.forEach(role => {
        if(role.business_id === order.product.business.id) {
          order.leader = user
        }
      })
    })
  }

  return (
    <div className="height100">
      <Nav/>
      {
        order ? <div className="order-details">
          <div className='back' onClick={e =>  history.goBack()}>
            <span>&#10508;</span>
            <b>BACK</b>
          </div>
          {order.leader ? <FontAwesomeIcon icon={profileIcon(order.leader.icon)} className="profile-icon" color="white"/> : null}
          <h2><span>{order.product.name} - Kassaticket</span></h2>
          <div className="business-info">
            <div className="left">
              <div>
                <img src={profile}/>
                <h3>Handelaar</h3>
                <p>{order.leader ? order.leader.name : null}</p>
              </div>
              <div>
                <img src={location}/>
                <p>{order.product.business.location}</p>
              </div>
            </div>
            <div className="right">
              <h3><img src={get} alt=""/>Beschrijving</h3>
              <p>{order.product.business.description}</p>
            </div>
          </div>
          <div className='product-container'>
            <div className='product-info'>
              <p>Aankoop</p>
              <p>Aankoopprijs</p>
            </div>
            <div className='product-info2'>
              <p className='first-p'>1 x</p>
              <div>
                <img src={(process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/' : 'http://wecreationapi.test/') + "products/" + order.product.picture}/>
                <p className='name'>{order.product.name}</p>
                <p>{order.product.description}</p>
              </div>
              <p>= {order.product.price}<img src={credit}/></p>
            </div>
            <div className='user-info'>
              <p>Aangekocht door:</p>
              <img src={profile}/>
              <p>{order.user.name}</p>
            </div>
          </div>
        </div> : null
      }
      
    </div>
  );
}

export default connect(
    null,
    {getOrders, getUsers}
  )(OrderShow);