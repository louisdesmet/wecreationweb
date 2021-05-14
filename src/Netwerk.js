import React, {useEffect, useState} from "react";
import Nav from "./Nav";
import {connect, useSelector} from "react-redux";
import {getMessages} from "./redux/actions";
import axios from "axios";
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

    const messageList = (messages.data ? messages.data.map(message =>
        <div key={message.id}>{message.user.name + ': ' + message.message}<span>{ date(message.created_at) }</span></div>
    ) : null);
    
    return (
        <div className="height100">
            <Nav/>
            <div className="network">
               
                <div className="chat">
                    <div className="messages">
                        {messageList}
                    </div>
                    <input onChange={(e) => setMessage(e.target.value)} type="text" placeholder="What's on your mind?"/>
                    <input onClick={send} type="submit" value="verzenden"/>
                </div>
            </div>
           
        </div>
    );
}

export default connect(
    null,
    {getMessages}
  )(Network);