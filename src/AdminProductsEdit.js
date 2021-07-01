import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getBusinesses} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link, useParams } from 'react-router-dom';
import locprod from './Global';
import './css/Admin.scss';

export const AdminProductsEdit = ({getBusinesses}) => {

    useEffect(() => {
      getBusinesses();
    }, []);

    const businesses = useSelector(state => state.remoteBusinesses);

    const { business_id, product_id } = useParams();
    const business = businesses.data ? businesses.data.find(business => business.id === parseInt(business_id)) : null;
    const product = business ? business.products.find(product => product.id === parseInt(product_id)) : null;

    const [name, setName] = useState(product.name);
    const [amount, setAmount] = useState(product.amount);
    const [price, setPrice] = useState(product.price);
    const [businessId, setBusinessId] = useState(business_id);
    
    function submit() {
        fetch(locprod + '/products/' + product.id, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
          },
          body: JSON.stringify({
            name: name,
            amount: amount,
            price: price,
            business: businessId
          })
        }).then(response => {
          window.location.href = '/admin-products';
        })
    }

    const businessList =  businesses.data ? businesses.data.map(business => <option key={business.id} value={business.id}>{business.name}</option>) : null;
    return (
      <div className='create'>
          <h2>Product aanpassen</h2>
          <input onChange={e => setName(e.target.value)} defaultValue={product.name} placeholder='Naam'/>
          <input onChange={e => setAmount(e.target.value)} defaultValue={product.amount} placeholder='In stock'/>
          <input onChange={e => setPrice(e.target.value)} defaultValue={product.price} placeholder='Prijs'/>
          <select onChange={e => setBusinessId(e.target.value)}>
              {businessList}
          </select>
          <input onClick={submit} type='submit' value='Toevoegen'/>
      </div>
    );
}

export default connect(
    null,
    {getBusinesses}
  )(AdminProductsEdit);