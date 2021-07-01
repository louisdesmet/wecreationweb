import React, {useEffect} from 'react';
import {connect} from "react-redux";
import {getProjects} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link } from 'react-router-dom';
import './css/Admin.scss';
import AdminNav from "./AdminNav";
export const AdminProjects = ({getProjects}) => {

    useEffect(() => {
        getProjects();
    }, []);

    const projects = useSelector(state => state.remoteProjects);

    const projectList = projects.data ? (
        <div className='admin-projects'>
            <div>
                <p className='bold'>Naam</p>
                <p className='bold'>Omschrijving</p>
                <p className='bold'>Credits</p>
                <p></p>
            </div>
            {
                projects.data.map(project =>
                    <div key={project.id}>
                        <p>{project.name}</p>
                        <p>{project.description}</p>
                        <p>{project.credits}</p>
                        <p><Link className='edit' to={"/admin-projects/edit/" + project.id}>Aanpassen</Link></p>
                    </div>
                )
            }
        </div>
    ) : null;


    return (
        <div className='admin'>
            <div className='admin-container'>
                <AdminNav/>
                <div className='admin-container-right'>
                    <div className='admin-container-right-title'>
                        <h2>Projecten</h2>
                        <p className='new'><Link to="/admin-projects/create">Nieuw project</Link></p>
                    </div>
                    {projectList}
                </div>
            </div>
        </div>
    );
}

export default connect(
    null,
    {getProjects}
)(AdminProjects);