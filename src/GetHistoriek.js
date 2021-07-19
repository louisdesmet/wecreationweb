import React, { useEffect } from "react";
import { connect, useSelector } from "react-redux";
import {getOrders} from "./redux/actions";

export const GetHistoriek = ({getOrders}) => {
  useEffect(() => {
    getOrders();
  }, []);

  const orders = useSelector(state => state.remoteOrders);

  const userOrders = orders.data ? orders.data.filter(order => {
    return order.user.id === JSON.parse(localStorage.getItem("user")).id
  }) : null;

  return (
    <table className="businesses-container">
      <thead>
          <tr>
              <th>Product naam</th>
              <th>Price</th>
          </tr>
      </thead>
      <tbody>
          {
              userOrders ? userOrders.map(order =>
              
                  (order.accepted === 1 ? <tr key={order.id}>
                      <td>{ order.product.name }</td>
                      <td>{ order.product.price }</td>
                  </tr> : null)
                
              ) : null
          }
      </tbody>          
  </table>
  );
}

export default connect(
  null,
  {getOrders}
)(GetHistoriek);