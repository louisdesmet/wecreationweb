
import React, { useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {getBusinesses, getUsers} from "./redux/actions";
import BusinessShow from "./components/BusinessShow";
import Nav from "./Nav";
import Axios from 'axios';

export const GetProducts = ({getBusinesses, getUsers}) => {

  useEffect(() => {
    getBusinesses();
    getUsers();
  }, []);

  const businesses = useSelector(state => state.remoteBusinesses);
  const users = useSelector(state => state.remoteUsers);

  const { id } = useParams();

  const likeBusiness = (businessId) => {
    Axios.post('/like-business', {
      'business': businessId,
      'user': JSON.parse(localStorage.getItem("user")).id
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      }
    })
    .then((response) => {
        getBusinesses();
    })
    .catch((error) => {
  
    })
  }

  let business = businesses.data ? businesses.data.find(business => business.id === parseInt(id)) : null;

  return (
    <div className="height100">
      <Nav/>
      {business && users.data ? <BusinessShow business={business} users={users.data} likeBusiness={likeBusiness} isPage={true}/> : null}
    </div>
  );
}

export default connect(
  null,
  {getBusinesses, getUsers}
)(GetProducts);


