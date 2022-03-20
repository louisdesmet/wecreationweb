import { faChess, faAddressCard, faBeer, faBalanceScale, faMugHot, faBurn, faAnchor, faBlind, faBowlingBall, 
    faRadiation, faBandAid, faBath, faBed, faBible, faBlender, faBong, faBox } from '@fortawesome/free-solid-svg-icons'

import regie from './img/icons/regie.png';
import montage from './img/icons/montage.png';
import mode from './img/icons/mode.png';
import dans from './img/icons/dans.png';
import camera from './img/icons/camera.png';
import administratie from './img/icons/administratie.png';
import organisatie from './img/icons/organisatie.png';
import werkkracht from './img/icons/werkkracht.png';
import decor from './img/icons/decor.png';
import kostuum from './img/icons/kostuum.png';
import muzikant from './img/icons/muzikant.png';
import agendaplanning from './img/icons/agendaplanning.png';
import dj from './img/icons/dj.png';
import animatie from './img/icons/animatie.png';
import tolk from './img/icons/tolk.png';
import presentatie from './img/icons/presentatie.png';
import socialmedia from './img/icons/socialmedia.png';
import acrobatie from './img/icons/acrobatie.png';
import acteur from './img/icons/acteur.png';
import vakman from './img/icons/vakman.png';
import geluidstechnieker from './img/icons/geluidstechnieker.png';
import conceptbedenker from './img/icons/conceptbedenker.png';
import yoga from './img/icons/yoga.png';
import projectleider from './img/icons/projectleider.png';
import horeca from './img/icons/horeca.png';
import schilderkunst from './img/icons/schilderkunst.png';


const locprod = (process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/api' : 'http://wecreationapi.test/api');
export default locprod

export const profileIcon = (icon) => {
    switch(icon) {
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

export const skillIcon = (name) => {
    switch(name) {
        case "regie": return regie;
        break;
        case "montage": return montage;
        break;
        case "mode": return mode;
        break;
        case "dans": return dans;
        break;
        case "camera": return camera;
        break;
        case "administratie": return administratie;
        break;
        case "organisatie": return organisatie;
        break;
        case "werkkracht": return werkkracht;
        break;
        case "decor": return decor;
        break;
        case "kostuum": return kostuum;
        break;
        case "muzikant": return muzikant;
        break;
        case "agendaplanning": return agendaplanning;
        break;
        case "dj": return dj;
        break;
        case "animatie": return animatie;
        break;
        case "tolk": return tolk;
        break;
        case "presentatie": return presentatie;
        break;
        case "socialmedia": return socialmedia;
        break;
        case "schilderkunst": return schilderkunst;
        break;
        case "acrobatie": return acrobatie;
        break;
        case "acteur": return acteur;
        break;
        case "vakman": return vakman;
        break;
        case "geluidstechnieker": return geluidstechnieker;
        break;
        case "conceptbedenker": return conceptbedenker;
        break;
        case "yoga": return yoga;
        break;
        case "projectleider": return projectleider;
        break;
        case "horeca": return horeca;
        break;
    }
}

export const date = (date) => {
    const jsDate = new Date(date);
    return jsDate.getDate()+'/'+(jsDate.getMonth()+1)+'/'+jsDate.getFullYear();
}

export const productImage = (image) => {
    
}