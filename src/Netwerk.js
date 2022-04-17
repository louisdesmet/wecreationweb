import React, {useEffect, useState} from "react";
import Nav from "./Nav";
import {connect, useSelector, useStore} from "react-redux";
import {getMessages, getUsers, getAllEvents, getGroups} from "./redux/actions";
import Select from 'react-select';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChess, faAddressCard, faBeer, faBalanceScale, faMugHot, faBurn, faAnchor, faBlind, faBowlingBall, 
    faRadiation, faBandAid, faBath, faBed, faBible, faBlender, faBong, faBox } from '@fortawesome/free-solid-svg-icons';
import { datetime, profileIcon } from './Global';
import './css/Netwerk.scss';

import profiel from './img/nav/profile.png';
import sendImg from './img/get/send.png';

export const Network = ({getMessages, getUsers, getAllEvents, getGroups}) => {

    const loggedUser = JSON.parse(localStorage.getItem("user"));

    const [message, setMessage] = useState("");
    const [firstMessagesUser, setFirstMessagesUser] = useState(null);
    const [latestMessages, setLatestMessages] = useState([]);
    const [messageList, setMessageList] = useState(null);
    const [messagesAmount, setMessagesAmount] = useState(0);
    const [finished, setFinished] = useState(false);
    const [switchedView, setSwitchedView] = useState(false);

    const [dmsActive, setDmsActive] = useState(true);
    const [groupchatsActive, setGroupchatsActive] = useState(false);
    const [threadsActive, setThreadsActive] = useState(false);

    const [groupMessageList, setGroupMessageList] = useState(null);
    const [groupMessageEventGroup, setGroupMessageEventGroup] = useState(null);

    const [showLatestDms, setShowLatestDms] = useState(true);
    const [showLatestGroupchats, setShowLatestGroupchats] = useState(false);

    const [showThreads, setShowThreads] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);

    const [latestGroupId, setLatestGroupId] = useState(null);
    const [latestThreadId, setLatestThreadId] = useState(null);
    
    const [latestThreadMessagesAmount, setLatestThreadMessagesAmount] = useState(null);
    const [latestGroupMessagesAmount, setLatestGroupMessagesAmount] = useState(null);

    const [threadMessageList, setThreadMessageList] = useState(null);

    useEffect(() => {
        getMessages();
        getUsers();
        getAllEvents();
        getGroups();
    }, []);

    const messages = useSelector(state => state.remoteMessages);
    const users = useSelector(state => state.remoteUsers);
    const events = useSelector(state => state.remoteAllEvents);
    const groups = useSelector(state => state.remoteGroups);

    let notifications = messages.data && messages.data.length ? messages.data.filter(message => message.notification && message.recipient.id === loggedUser.id) : null;

    let threadGroups = groups.data ? groups.data.filter(group => !group.event) : null;
    let eventGroups = groups.data ? groups.data.filter(group => group.event) : null;

    let latestMessagesThreadGroup = [];
    let latestMessagesEventGroup = [];

    if(threadGroups) {
        threadGroups.forEach(group => {
            if(group.messages.length) {
                latestMessagesThreadGroup.push(group.messages.reduce((a, b) => (a.created_at > b.created_at ? a : b)));
            } else {
                latestMessagesThreadGroup.push({
                    group: group
                })
            }
        })
        latestMessagesThreadGroup.sort((a,b) => { return new Date(b.created_at) - new Date(a.created_at) });
    }

    let allowedEventGroups = [];
    if(events.data) {
        events.data.forEach(event => { event.skills.forEach(skill => { skill.users.forEach(user => {
            if(user.id === loggedUser.id && !allowedEventGroups.includes(event.group.id)) {
                allowedEventGroups.push(event.group.id);
            }
        })})})
    }

    if(eventGroups && allowedEventGroups.length) {
        eventGroups.forEach(group => {
            if(allowedEventGroups.includes(group.id) && group.messages.length) {
                latestMessagesEventGroup.push(group.messages.reduce((a, b) => (a.created_at > b.created_at ? a : b)));
            } else {
                latestMessagesEventGroup.push({
                    group: group
                })
            }
        })
        latestMessagesEventGroup.sort((a,b) => { return new Date(b.created_at) - new Date(a.created_at) });
    }

    let dmsFrom = [];
    let dmsTo = [];
    let dmsPerPerson = {};

    if(messages.data && messages.data.length && messagesAmount === 0) {
        setMessagesAmount(messages.data.length);
    }

    if(messages.data && messages.data.length && (!finished || messages.data.length !== messagesAmount || switchedView || !messageList)) {

        dmsFrom = messages.data.filter(message => message.recipient && message.user && message.recipient.id === loggedUser.id);
        dmsTo = messages.data.filter(message => message.recipient && message.user && message.user.id === loggedUser.id);

        dmsFrom.forEach(dm => {
            if(dmsPerPerson[dm.user.id]) {
                dmsPerPerson[dm.user.id].push(dm);
            } else {
                dmsPerPerson[dm.user.id] = [];
                dmsPerPerson[dm.user.id].push(dm);
            }
        });

        dmsTo.forEach(dm => {
            if(dmsPerPerson[dm.recipient.id]) {
                dmsPerPerson[dm.recipient.id].push(dm);
            } else {
                dmsPerPerson[dm.recipient.id] = [];
                dmsPerPerson[dm.recipient.id].push(dm);
            }
        });

        let tempLatestMessages = [];

        for (let [key, value] of Object.entries(dmsPerPerson)) {
            tempLatestMessages.push(value.reduce((a, b) => (a.created_at > b.created_at ? a : b)));
        }

        tempLatestMessages.sort((a,b) => { return new Date(b.created_at) - new Date(a.created_at) });
        
        if(tempLatestMessages.length) {
            setLatestMessages(tempLatestMessages);
        }
        

        if(latestMessages && latestMessages.length && !firstMessagesUser) {
            setFirstMessagesUser(loggedUser.id === latestMessages[0].user.id ? latestMessages[0].recipient : latestMessages[0].user);
        }

        if(firstMessagesUser) {

            if(dmsPerPerson[firstMessagesUser.id]) {
                dmsPerPerson[firstMessagesUser.id].sort((a,b) => {
                    return new Date(a.created_at) - new Date(b.created_at);
                })
            }

            setMessageList(dmsPerPerson[firstMessagesUser.id] ? dmsPerPerson[firstMessagesUser.id].reverse().map(dm =>
                <div className={loggedUser.id === dm.user.id ? "message message-right" : "message"} key={dm.id}>
                    <div className={loggedUser.id === dm.user.id ? "hidden" : "netwerk-profile-icon"}><FontAwesomeIcon icon={profileIcon(dm.user.icon)} color="white"/></div>
                    <div>
                        <p title={ datetime(dm.created_at) }>{dm.message}</p>
                    </div>
                </div>
            ) : []);

            setSwitchedView(false);
            setMessagesAmount(messages.data.length);
            setFinished(true);
            
        }
    
    }

    if(messages.data && latestGroupId && latestGroupMessagesAmount && messages.data.length !== messagesAmount && eventGroups.find(group => group.id === parseInt(latestGroupId)).messages.length !== latestGroupMessagesAmount) {
        setGroupMessageList(eventGroups.find(group => group.id === parseInt(latestGroupId)).messages.slice().reverse().map(message =>
            <div className={loggedUser.id === message.user.id ? "message message-right" : "message"} key={message.id}>
                <div className={loggedUser.id === message.user.id ? "hidden" : "netwerk-profile-icon"}><FontAwesomeIcon icon={profileIcon(message.user.icon)} color="white"/></div>
                <div>
                    <p className="message-name">{message.user.name}</p>
                    <p title={ datetime(message.created_at) }>{message.message}</p>
                </div>
            </div>
        ));
        setMessagesAmount(messages.data.length);
        setLatestGroupMessagesAmount(eventGroups.find(group => group.id === parseInt(latestGroupId)).messages.length);
    }

    if(messages.data && latestThreadId && (latestThreadMessagesAmount || latestThreadMessagesAmount === 0) && messages.data.length !== messagesAmount && threadGroups.find(group => group.id === parseInt(latestThreadId)).messages.length !== latestThreadMessagesAmount) {
        setThreadMessageList(threadGroups.find(group => group.id === parseInt(latestThreadId)).messages.slice().reverse().map(message =>
            <div className={loggedUser.id === message.user.id ? "message message-right" : "message"} key={message.id}>
                <div className={loggedUser.id === message.user.id ? "hidden" : "netwerk-profile-icon"}><FontAwesomeIcon icon={profileIcon(message.user.icon)} color="white"/></div>
                <div>
                    <p className="message-name">{message.user.name}</p>
                    <p title={ datetime(message.created_at) }>{message.message}</p>
                </div>
            </div>
        ));
        setMessagesAmount(messages.data.length);
        setLatestThreadMessagesAmount(threadGroups.find(group => group.id === parseInt(latestThreadId)).messages.length);
    }


    function switchView(dm) {
        dm.user.id === loggedUser.id ? setFirstMessagesUser(dm.recipient) : setFirstMessagesUser(dm.user);
        setSwitchedView(true);
        setDmsActive(true);
        setGroupchatsActive(false);
        setThreadsActive(false);
    }

    function switchViewGroupchat(groupchat) {
        setDmsActive(false);
        setGroupchatsActive(true);
        setThreadsActive(false);
        setGroupMessageEventGroup(groupchat.group);
        setGroupMessageList(eventGroups.find(group => group.id === groupchat.group.id).messages.slice().reverse().map(message =>
            <div className={loggedUser.id === message.user.id ? "message message-right" : "message"} key={message.id}>
                <div className={loggedUser.id === message.user.id ? "hidden" : "netwerk-profile-icon"}><FontAwesomeIcon icon={profileIcon(message.user.icon)} color="white"/></div>
                <div>
                    <p className="message-name">{message.user.name}</p>
                    <p title={ datetime(message.created_at) }>{message.message}</p>
                </div>
            </div>
        ));
    }

    function switchViewThread(groupchat) {
        setDmsActive(false);
        setGroupchatsActive(false);
        setThreadsActive(true);
        setGroupMessageEventGroup(groupchat.group);
        setThreadMessageList(threadGroups.find(group => group.id === groupchat.group.id).messages.slice().reverse().map(message =>
            <div className={loggedUser.id === message.user.id ? "message message-right" : "message"} key={message.id}>
                <div className={loggedUser.id === message.user.id ? "hidden" : "netwerk-profile-icon"}><FontAwesomeIcon icon={profileIcon(message.user.icon)} color="white"/></div>
                <div>
                    <p className="message-name">{message.user.name}</p>
                    <p title={ datetime(message.created_at) }>{message.message}</p>
                </div>
            </div>
        ));
    }

    function searchUser(user) {
        setFirstMessagesUser(user);
        setMessageList(null);
        setDmsActive(true);
        setGroupchatsActive(false);
    }

    function switchToDm() {
        setShowLatestDms(true);
        setShowLatestGroupchats(false);
    }

    function switchToGroup() {
        setShowLatestDms(false);
        setShowLatestGroupchats(true);
    }

    function switchToThreads() {
        setShowThreads(true);
        setShowNotifications(false);
    }

    function switchToNotifications() {
        setShowThreads(false);
        setShowNotifications(true);
    }

    function send(recipient) {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
        if(dmsActive) {
            axios.post('/messages', {
                message: message,
                user: loggedUser.id,
                recipient: recipient
            }, { headers: headers }).then((response) => {
                getMessages();
                setFinished(false);
            }).catch((error) => {})
        } else if(groupchatsActive) {
            axios.post('/messages', {
                message: message,
                user: loggedUser.id,
                group: recipient
            }, { headers: headers }).then((response) => {
                setLatestGroupId(recipient);
                setLatestGroupMessagesAmount(eventGroups.find(group => group.id === recipient).messages.length);
                getGroups();
                getMessages();
            }).catch((error) => {})
        } else {
            axios.post('/messages', {
                message: message,
                user: loggedUser.id,
                group: recipient
            }, { headers: headers }).then((response) => {
                setLatestThreadId(recipient);
                setLatestThreadMessagesAmount(threadGroups.find(group => group.id === recipient).messages.length);
                getGroups();
                getMessages();
            }).catch((error) => {})
        }
    }
    
    return (
        <div className="height100">
            <Nav/>
            <div className="network">
                <div className={showThreads ? "threads-button active" : "threads-button"} onClick={e => switchToThreads()}>#</div>
                <div className={showNotifications ? "notifications-button active" : "notifications-button"} onClick={e => switchToNotifications()} dangerouslySetInnerHTML={{__html: '<3'}}></div>
                <div className="dms">
                    {
                        users.data ? <Select placeholder="Zoeken" onChange={e => searchUser(e.value)} className="search" options={users.data.map(user => {
                            return { value: user, label: user.name }
                        })}/> : null
                    }
                    <div className="messageSwitch">
                        <div className={showLatestDms ? "active" : ""} onClick={e => switchToDm()}>DM's</div>
                        <div className={showLatestGroupchats ? "active" : ""} onClick={e => switchToGroup()}>Group chats</div>
                    </div>
                    {
                        showLatestGroupchats && latestMessagesEventGroup.map(groupchat =>
                            <div className="message" key={groupchat.group.id} onClick={e => switchViewGroupchat(groupchat)}>
                                <div className="netwerk-profile-icon"><img src={ require('./img/project/' + groupchat.group.event.project.picture) }/></div>
                                <div>
                                    <p className="message-name">{groupchat.group.event.name}</p>
                                    <p>{groupchat.user ? groupchat.user.name : null}</p>
                                    {
                                        groupchat.created_at && groupchat.message && <p title={ datetime(groupchat.created_at) }>{groupchat.message}</p>
                                    }
                                </div>
                            </div>
                        )
                    }
                    {
                        showLatestDms && latestMessages.map(dm =>
                            <div className="message" key={dm.id} onClick={e => switchView(dm)}>
                                <div className="netwerk-profile-icon"><FontAwesomeIcon icon={profileIcon(dm.user.id === loggedUser.id ? dm.recipient.icon : dm.user.icon)} color="#F7931E"/></div>
                                <div>
                                    <p className="message-name">{dm.user.id === loggedUser.id ? dm.recipient.name : dm.user.name}</p>
                                    <p title={ datetime(dm.created_at) }>{dm.message}</p>
                                </div>
                            </div>
                        )
                    }
                    {

                    }
                </div>
                <div className="chat">
                    {
                        dmsActive && firstMessagesUser ? <h2 className="person"><FontAwesomeIcon icon={profileIcon(firstMessagesUser.icon)} color="white"/>{firstMessagesUser.name}</h2> : null
                    }
                    {
                        groupchatsActive && groupMessageEventGroup ? <h2 className="person"><img src={ require('./img/project/' + groupMessageEventGroup.event.project.picture) }/>{groupMessageEventGroup.event.name}</h2> : null
                    }
                    {
                        threadsActive && groupMessageEventGroup ? <h2 className="person">#{groupMessageEventGroup.name}</h2> : null
                    }
                    <div className="messages">
                        {
                            dmsActive ? messageList : groupchatsActive ? groupMessageList : threadMessageList
                        }
                    </div>
                    <div className="network-inputs">
                        <input onChange={(e) => setMessage(e.target.value)} type="text" placeholder="What's on your mind?"/>
                        <img src={sendImg} onClick={e => send(dmsActive ? firstMessagesUser.id : groupMessageEventGroup.id)}/>
                    </div>
                </div>
                <div className="threads">
                    {
                        showThreads ? <div>
                            <h2>Threads</h2>
                            {
                                latestMessagesThreadGroup.map(message =>
                                    <div className="message" key={message.group.id} onClick={e => switchViewThread(message)}>
                                        <div>
                                            <p className="message-name">#{message.group.name}</p>
                                            {
                                                message.user && message.created_at && message.message && <p title={ datetime(message.created_at) }>{message.user.name + ': ' + message.message}</p>
                                            }
                                        </div>
                                    </div>
                                )
                            }
                        </div> : null
                    }
                   
                    {
                        showNotifications ? <div>
                            <h2>Notifications</h2>
                            {
                                notifications && notifications.length ? notifications.map(notification => 
                                    <div className="message" key={notification.id}>
                                        <div>
                                            {
                                                notification.created_at && notification.message && <p title={ datetime(notification.created_at) }>{notification.message}</p>
                                            }
                                        </div>
                                    </div>
                                ) : null
                            }
                        </div> : null
                    }
                    
                </div>
            </div>
        </div>
    );
}

export default connect(
    null,
    {getMessages, getUsers, getAllEvents, getGroups}
  )(Network);