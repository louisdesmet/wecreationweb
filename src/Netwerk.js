import React, {useEffect, useState} from "react";
import Nav from "./Nav";
import {connect, useSelector} from "react-redux";
import {getMessages} from "./redux/actions";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChess, faAddressCard, faBeer, faBalanceScale, faMugHot, faBurn, faAnchor, faBlind, faBowlingBall, 
    faRadiation, faBandAid, faBath, faBed, faBible, faBlender, faBong, faBox } from '@fortawesome/free-solid-svg-icons'

export const Network = ({getMessages}) => {

    const messages = useSelector(state => state.remoteMessages);
    const [message, setMessage] = useState("");

    useEffect(() => {
        getMessages();
    }, []);

    function send() {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
        axios.post('/messages', {
            message: message,
            user: JSON.parse(localStorage.getItem("user")).id
           
          }, {
            headers: headers
          })
          .then((response) => {
            window.location.href = '/netwerk';
          })
          .catch((error) => {
            
          })
    }

    function date(date) {
        const jsDate = new Date(date);
        return jsDate.getDate()+'-'+(jsDate.getMonth()+1)+'-'+jsDate.getFullYear()+' '+jsDate.getHours()+':'+jsDate.getMinutes();
    }

    function findIcon() {
        switch(JSON.parse(localStorage.getItem("user")).icon) {
            case "faChess": return faChess;
            break;
            case "faAddressCard": return faAddressCard;
            break;
            case "faBeer": return faBeer;
            break;
            case "faBalanceScale": return faBalanceScale;
            break;
            case "faMugHot": return faMugHot;
            break;
            case "faBurn": return faBurn;
            break;
            case "faAnchor": return faAnchor;
            break;
            case "faBlind": return faBlind;
            break;
            case "faBowlingBall": return faBowlingBall;
            break;
            case "faRadiation": return faRadiation;
            break;
            case "faBandAid": return faBandAid;
            break;
            case "faBath": return faBath;
            break;
            case "faBed": return faBed;
            break;
            case "faBible": return faBible;
            break;
            case "faBlender": return faBlender;
            break;
            case "faBong": return faBong;
            break;
            case "faBox": return faBox;
            break;
          }
    }

    const messageList = (messages.data ? messages.data.map(message =>
        <div className="message" key={message.id}>
            <div className="netwerk-profile-icon"><FontAwesomeIcon icon={findIcon()} color="#0084FF"/></div>
            <div>
                <p className="message-name">{message.user.name}</p> 
                <p>{message.message}</p>
            </div>
            
            <div className="message-date">{ date(message.created_at) }</div>
        </div>
    ) : null);
    
    return (
        <div className="height100">
            <Nav/>
            <div className="network">
                <div className="chat">
                    <div className="messages">
                        {messageList}
                    </div>
                    <div className="network-inputs">
                        <input onChange={(e) => setMessage(e.target.value)} type="text" placeholder="What's on your mind?"/>
                        <input className="network-submit" onClick={send} type="submit" value="Verzenden"/>
                    </div>
                </div>
            </div>
           
        </div>
    );
}

export default connect(
    null,
    {getMessages}
  )(Network);