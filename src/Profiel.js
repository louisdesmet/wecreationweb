import React, {useEffect} from 'react';
import {connect} from "react-redux";
import {getProjects} from "./redux/actions";
import credit from './img/credit.PNG';
import Nav from "./Nav";
import {useSelector} from "react-redux";
export const Profiel = ({props,getProjects}) => {

    const loggedUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        getProjects();
    }, []);

    const projects = useSelector(state => state.remoteProjects);

    /*const projectList = projects.data ? (
        <div>
          {
            projects.data.map(project =>
                {
                    project.events.map(event =>
                        {
                            event.users.map(user =>
                                (user.id === loggedUser.id ? 
                                    <div></div>
                                )
                            )
                        }
                    )
                }
            )
          }
        </div>
    ) : null;*/
  


    let clonedEvents = [];

    if(projects.data) {
       
        Object.values(projects.data).forEach(project => {
            project.events.forEach(event => {
                event.users.forEach(user => {
                    if(user.id === loggedUser.id) {
                        clonedEvents.push(user);
                    }
                })
            })
        });
    }


    function logout() {
        localStorage.setItem('token', null);
        localStorage.setItem('user', null);
        props.history.push("/login");
    }

    return (
        <div>
           <Nav/>
           <div className="profiel">
            <p className="title">{loggedUser.name}</p>
            <p>Huidig saldo: <img src={credit} alt=""/>{loggedUser.credits}</p>
            <p onClick={() => logout()}>logout</p>
           </div>
        
        </div>
    );
}


export default connect(
    null,
    {getProjects}
)(Profiel);