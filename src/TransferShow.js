import React from 'react';
import { useParams } from 'react-router-dom';
import Nav from './Nav';
import './css/OrderShow.scss';

import profile from './img/eventshow/profile-purple.png';

import { useNavigate } from 'react-router-dom';

function TransferShow(props) {

  const history = useNavigate();

  const { id } = useParams();
  const transfer = props.transfers.data.find(transfer => transfer.id === parseInt(id));

  return (
    <div className="height100">
      <Nav/>
      {
        transfer ? <div className="order-details">
          <div className='back' onClick={e =>  history(-1)}>
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
                <p>{transfer.accepted ? 'Je aanvraag werd aanvaard door collectief verhalen.' : 'Je aanvraag is in behandeling door collectief verhalen.'}</p>
              </div>
            </div>
          </div>
        </div> : null
      }
      
    </div>
  );
}

export default TransferShow;