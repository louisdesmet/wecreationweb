import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getOrders} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link, useParams } from 'react-router-dom';
import Nav from './Nav';
import './css/OrderShow.scss';

export const OrderShow = ({getOrders}) => {

    useEffect(() => {
      getOrders();
    }, []);

    const orders = useSelector(state => state.remoteOrders);

    const { id } = useParams();
    const order = orders.data ? orders.data.find(order => order.id === parseInt(id)) : null;

    return (
      <div className="height100">
        <Nav/>
        <div className="order-details">
          <h1>{order ? 'Je hebt een product gekocht bij ' + order.product.business.name : null}</h1>
          <p>{order ? order.product.business.description : null}</p>
          <p>{order ? order.product.business.location : null}</p>
          <h2>{order ? order.product.name : null}</h2>
          <p>{order ? 'Dit product kost ' + order.product.price + ' credits.' : null}</p>
          <p>{order ? 'Besteld door '  + order.user.name : null}</p>
        </div>
      </div>
    );
}

export default connect(
    null,
    {getOrders}
  )(OrderShow);