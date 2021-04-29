import React, {useEffect} from "react";
import Nav from "./Nav";
import {connect, useSelector} from "react-redux";
import {getUsers} from "./redux/actions";
export const Network = ({getUsers}) => {

    const users = useSelector(state => state.remoteUsers);

    useEffect(() => {
        getUsers();
    }, []);
    
    return (
        <div className="height100">
            <Nav/>
            <div className="network">
               
                <div className="chat">
                    <div className="messages">
                        
                    </div>
                    <input type="text" placeholder="What's on your mind?"/>
                </div>
            </div>
           
        </div>
    );
}

export default connect(
    null,
    {getUsers}
  )(Network);