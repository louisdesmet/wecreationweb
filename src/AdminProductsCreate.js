import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getBusinesses} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link } from 'react-router-dom';
import './css/Admin.scss';

import locprod from './Global';

export const AdminProductsCreate = ({getBusinesses}) => {

    useEffect(() => {
      getBusinesses();
    }, []);

    const businesses = useSelector(state => state.remoteBusinesses);

    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [price, setPrice] = useState("");
    const [business, setBusiness] = useState("");
    
    function submit() {
        fetch(locprod + '/products', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
          },
          body: JSON.stringify({
            name: name,
            amount: amount,
            price: price,
            business: business
          })
        }).then(response => {
          window.location.href = '/admin-products';
        })
    }

    const businessList =  businesses.data ? businesses.data.map(business => <option key={business.id} value={business.id}>{business.name}</option>) : null;

    return (
      <div className='create'>
          <h2>Product aanmaken</h2>
          <input onChange={e => setName(e.target.value)} placeholder='Naam'/>
          <input onChange={e => setAmount(e.target.value)} placeholder='In stock'/>
          <input onChange={e => setPrice(e.target.value)} placeholder='Prijs'/>
          <select onChange={e => setBusiness(e.target.value)}>
              {businessList}
          </select>
          <input onClick={submit} type='submit' value='Toevoegen'/>
      </div>
    );
}

export default connect(
    null,
    {getBusinesses}
  )(AdminProductsCreate);