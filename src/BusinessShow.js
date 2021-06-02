import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getBusinesses} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link, useParams } from 'react-router-dom';
import Nav from './Nav';

export const BusinessShow = ({getBusinesses}) => {

    useEffect(() => {
      getBusinesses();
    }, []);

    const businesses = useSelector(state => state.remoteBusinesses);

    const { id } = useParams();
    const business = businesses.data ? businesses.data.find(business => business.id === parseInt(id)) : null;

    function date(date) {
      const jsDate = new Date(date);
      return jsDate.getDate()+'-'+(jsDate.getMonth()+1)+'-'+jsDate.getFullYear();
    }


    return (
      <div className="event-details height100">
          <Nav/>
          <h2>Business details</h2>

          {business ? 
            <div className='event-panel'>
              <div className="event-headers">
                <p>Naam</p>
                <p>Type</p>
                <p>Omschrijving</p>
                <p>Locatie</p>
                <p>Credits</p>
              </div>
              <div className="event mb-70">
                  <p>{business.name}</p>
                  <p>{business.type}</p>
                  <p>{business.description}</p>
                  <p>{business.location}</p>
                  <p>{business.credits}</p>
              </div>
            </div>
            :
            null
          }
    
      </div>
    );
}

export default connect(
    null,
    {getBusinesses}
  )(BusinessShow);