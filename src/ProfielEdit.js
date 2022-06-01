import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getUsers} from "./redux/actions";
import Nav from "./Nav";
import {useSelector} from "react-redux";
import './css/Profiel.scss';
import Axios from 'axios';
import locprod from './Global';
import { useHistory } from 'react-router-dom';

export const ProfielEdit = ({getUsers}) => {

    const history = useHistory();

    const loggedUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        getUsers();
    }, []);

    const [desc, setDesc] = useState();
    const [age, setAge] = useState();
    const [file, setFile] = useState(null);
    const [imageId, setImageId] = useState("profileImage");
    const [imageURI, setImageURI] = useState(null);

    const users = useSelector(state => state.remoteUsers);

    const updatedLoggedUser = users.data ? users.data.find(item => item.id === loggedUser.id) : null;

    function edit() {

        formData.append('age', age ? age : updatedLoggedUser.age);
        formData.append('description', desc ? desc : updatedLoggedUser.description);
        formData.append('id', updatedLoggedUser.id);
  
        if(file) {
          formData.append('image', file);
        }
        
        fetch(locprod + '/users/editdata', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'multipart/form-data',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
          },
        }).then(response => {
            history.goBack();
        })
        .catch(error => {
        
        });
    }

    const formData = new FormData();
    const imageHandler = (e) => {
        if(e.target.files && e.target.files[0]){
        let reader = new FileReader();
        reader.onload = function(ev) {
            setImageURI(ev.target.result)
        };
        reader.readAsDataURL(e.target.files[0]);
        }
        setFile(e.target.files[0]);
    }

    function buildImgTag() {
        let imgTag = null;
        if (imageURI !== null)
          imgTag = (
            <img className="thumbnail" src={imageURI}></img>
          );
        return imgTag;
      }
    
      const imgTag = buildImgTag();

    return (
        <div className="height100">
            <Nav/>
            <div className="profile-edit">
                {
                    updatedLoggedUser ? <div>
                        <label>Profielbeschrijving</label>
                        <textarea onChange={e => setDesc(e.target.value)} defaultValue={updatedLoggedUser.description} placeholder='Description'></textarea>
                        <label>Leeftijd</label>
                        <input onChange={e => setAge(e.target.value)} defaultValue={updatedLoggedUser.age} placeholder='Age'/>
                        <label htmlFor={imageId}>Afbeelding: (optioneel)</label>
                        <input id={imageId} type="file" name="image" accept="application/image" multiple={false} onChange={imageHandler}/>
                        {imgTag}
                        <button onClick={e => edit()}>Aanpassen</button>
                    </div> : null
                }
                
            </div>
        </div>
    );
}


export default connect(
    null,
    {getUsers}
)(ProfielEdit);