import React, {useEffect, useState} from 'react';
import {connect, useSelector} from "react-redux";
import { getProjects } from './redux/actions';
import { useParams } from 'react-router-dom';
import locprod from './Global';
import './css/EventCreate.scss';
import Nav from './Nav';
import { useHistory } from 'react-router';

import work from './img/nav/work.png';


export const ProjectCreate = ({getProjects}) => {

  const routerHistory = useHistory();

  useEffect(() => {
    getProjects();
  }, []);

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("Uitvoerende kunst");
  const [file, setFile] = useState(null);

  const { id } = useParams();

  const projects = useSelector(state => state.remoteProjects);

  const project = id && projects.data ? projects.data.find(project => project.id === parseInt(id)) : null;

  const formData = new FormData();
  const imageHandler = (event) => {
    setFile(event.target.files[0]);
  }

  function submit(e) {
    e.preventDefault();
    if(name && desc) {
      formData.append('name', name);
      formData.append('desc', desc);
      formData.append('type', type);
      formData.append('leader', JSON.parse(localStorage.getItem("user")).id);
      if(file) {
        formData.append('image', file);
      }
      
      if(project) {
        fetch(locprod + '/projects/' + project.id, {
          method: 'PUT',
          body: JSON.stringify({
            name: name,
            desc: desc,
            type: type,
            leader: JSON.parse(localStorage.getItem("user")).id
          }),
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem("token")
          },
        }).then(response => routerHistory.push('/work'))
        .catch(error => {
        
        });
      } else {
        fetch(locprod + '/projects', {
          method: 'POST',
          body: formData,
          headers: {
              'Accept': 'multipart/form-data',
              'Authorization': 'Bearer ' + localStorage.getItem("token")
          },
        }).then(response => routerHistory.push('/work'))
        .catch(error => {
        
        });
      }
      
      
    }
  }

  return (
    <div className="height100">
      <Nav/>
      <div className="event-create">
        {
          project ? <h2 className="event-title"><span>{project.name}</span></h2> : null
        }
        <h2><img src={work} alt=""/>Project beschrijving</h2>
        <input defaultValue={project && project.name ? project.name : ""} className='naam' onChange={e => setName(e.target.value)} placeholder='Naam'/>
        <textarea defaultValue={project && project.description ? project.description : ""} onChange={e => setDesc(e.target.value)} placeholder='Omschrijving'></textarea>
        <select className='type' onChange={e => setType(e.target.value)}>
          <option value="Uitvoerende kunst">Uitvoerende kunst</option>
          <option value="Audiovisueel">Audiovisueel</option>
          <option value="Sociaal">Sociaal</option>
          <option value="Cultureel">Cultureel</option>
          <option value="Wetenschappelijk">Wetenschappelijk</option>
          <option value="Zorg">Zorg</option>
          <option value="Overige">Overige</option>
        </select>
        <label>Afbeelding</label>
        {
          project && project.image ? <img className="event-logo"  src={(process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/' : 'http://wecreationapi.test/') + "projects/" + project.image}/> : null
        }
        <input type="file" name="image" accept="application/image" multiple={false} onChange={imageHandler}/>
        <button onClick={e => submit(e)}>Project aanmaken</button>
      </div>
    </div>
  );
}

export default connect(
    null,
    {getProjects}
)(ProjectCreate);