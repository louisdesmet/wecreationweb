
import React from "react";
import { useParams } from "react-router-dom";
import BusinessShow from "./components/BusinessShow";
import Nav from "./Nav";
import Axios from 'axios';

function GetProducts(props) {

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
        //getBusinesses();
    })
    .catch((error) => {
  
    })
  }

  let business = props.businesses.data ? props.businesses.data.find(business => business.id === parseInt(id)) : null;

  return (
    <div className="height100">
      <Nav/>
      {business && props.users.data ? <BusinessShow business={business} users={props.users.data} likeBusiness={likeBusiness} isPage={true}/> : null}
    </div>
  );
}

export default GetProducts;


