
import Axios from "axios";
import React, { useState } from "react";
import { profileIcon } from '../Global.js'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import profile from '../img/eventshow/profile-purple.png';
import team from '../img/profile/team.png';
import location from '../img/nav/see.png';
import accept from '../img/eventshow/accept.png';
import decline from '../img/eventshow/decline.png';
import get from '../img/nav/get.png';
import like from '../img/eventshow/like.png';
import credits from '../img/profile/credits.png';
import { Avatar, CardHeader, Divider, List, ListItem, ListItemAvatar, ListItemText, Popover, Typography } from "@mui/material";

let icon = L.icon({
    iconUrl: get,
    iconSize: [50, 50],
    popupAnchor: [0, -20],
});
function BusinessShow(props) {

    const [anchorEl, setAnchorEl] = React.useState(null);

    const history = useNavigate();

    const notifyCredits = (user, product) => toast("Je hebt " + user.credits + " credits en  het product " + product.name + " kost " + product.price + " credits");
    const notifyStock = (product) => toast("Het product " + product.name + " is uitverkocht.");
    const notifyRegister = () => toast("Voor deze actie heb je een account nodig.");

    const loggedUser = JSON.parse(localStorage.getItem("user"));

    const [product, setProduct] = useState(null);
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const openLiked = Boolean(anchorEl);
  

    let position = [props.business.lat, props.business.lng];

    const businessMarkers = <Marker key={props.business.id} position={[props.business.lat, props.business.lng]} icon={icon}></Marker>;

    props.users.forEach(user => {
        user.roles.forEach(role => {
            if (role.business_id === props.business.id) {
                props.business.leader = user
            }
        })
    })

    function areYouSureBox(product) {
        if(loggedUser) {
            let user = props.users.find(user => user.id === loggedUser.id);
            if (parseInt(user.credits) >= product.price && (product.amount > 0 || props.business.type === 'service')) {
                handleClickOpen();
                setProduct(product);
            } else {
                if (product.amount > 0) {
                    notifyCredits(user, product)
                } else {
                    notifyStock(product)
                }
            }
        } else {
            notifyRegister();
        }
    }

    function buy(product) {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
        Axios.post('/orders', {
            product: product.id,
            user: JSON.parse(localStorage.getItem("user")).id,
            business_user: props.business.leader.id,
            business_type: props.business.type

        }, {
            headers: headers
        })
        .then((response) => {
            window.location.href = '/orders/' + response.data.id;
        })
        .catch((error) => {

        })
    }

    function likeBusiness() {
        if(loggedUser) {
            if(!props.business.users.find(user => loggedUser && user.id === loggedUser.id)) {
            props.likeBusiness(props.business.id);
            }
        } else {
            notifyRegister();
        }
    }

    return (
        <div className="products-container">
            <div className="top-items">
                <div className="groupchat">
                    {
                        props.isPage ? <div className='back' onClick={e => history(-1)}>
                            <span>&#10508;</span>
                            <b>BACK</b>
                        </div> : null
                    }
                </div>
                <div>
                    {
                        props.business.image ? <img className="business-logo" src={(process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/' : 'http://wecreationapi.test/') + "businesses/" + props.business.image} /> : null
                    }
                </div>
                <Typography 
                    className={props.business.users && props.business.users.find(user => loggedUser && user.id === loggedUser.id) || props.liked ? "like liked" : "like"} 
                    onClick={e => likeBusiness()}
                    aria-owns={openLiked ? 'mouse-over-popover' : undefined}
                    aria-haspopup="true"
                    onMouseEnter={handlePopoverOpen}
                    onMouseLeave={handlePopoverClose}
                >
                    <span>{props.liked ? props.business.users.length + 1 : props.business.users.length}</span>
                    <img className={props.business.users && props.business.users.find(user => loggedUser && user.id === loggedUser.id) || props.liked ? "liked" : ""} src={like}/>
                    <p className={props.business.users && props.business.users.find(user => loggedUser && user.id === loggedUser.id) || props.liked ? "liked" : ""}>Interesse!</p>
                </Typography>
                <Popover
                    id="mouse-over-popover"
                    sx={{
                        pointerEvents: 'none',
                    }}
                    open={openLiked}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    onClose={handlePopoverClose}
                    disableRestoreFocus
                >
                    <List>
                        {
                        props.business.users.map((user, i, row) =>
                            <>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar alt="" src={(process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/' : 'http://wecreationapi.test/') + 'users/' + user.image} />
                                </ListItemAvatar>
                                <ListItemText primary={user.name} />
                            </ListItem>
                            { i + 1 !== row.length && <Divider /> }
                            </>
                        )
                        }
                    </List>
                </Popover>
            </div>
            <h2><span>{props.business.name}</span></h2>
            <div className="business-info">
                <div className="left">
                    <h3><img src={get} alt="" />Beschrijving</h3>
                    <p className="desc">{props.business.description}</p>
                    <h2><span>Producten</span></h2>
                    <div className="products">
                        {
                            props.business.products.map(product =>
                                <div className="product" key={product.id}>
                                    <img src={(process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/' : 'http://wecreationapi.test/') + "products/" + product.picture} />
                                    <h4>{product.name}</h4>
                                    <p className="product-desc">{product.description}</p>
                                    <p>{product.price}<img className='credits' src={credits} /></p>
                                    <button onClick={e => areYouSureBox(product)}><span className="product-buy">Kopen</span></button>
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className="right">
                    <div>
                        <img src={profile} />
                        <h3>Handelaar</h3>
                        <p>{props.business.leader.name}</p>

                    </div>
                    <div>
                        <img src={team} />
                        <p className="message" onClick={e => window.location.href = "/netwerk/dm/" + props.business.leader.id}>Stuur een bericht</p>
                    </div>
                    <div>
                        <img src={location} />
                        <p>{props.business.location}</p>
                    </div>

                </div>
                
                {
                    product ? 
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                        <CardHeader
                            avatar={
                            <Avatar
                                alt="Remy Sharp"
                                src={credits}
                            />
                            }
                            title="Aankoop"
                            titleTypographyProps={{variant:'h5' }}
                        />
                        </DialogTitle>
                        <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Weet je zeker dat je een {product.name} wilt aankopen voor {product.price} credits
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>

                        <Button onClick={handleClose}><Avatar src={decline}/></Button>
                        <Button onClick={e => buy(product)} autoFocus>
                            <Avatar src={accept}/>
                        </Button>
                        </DialogActions>
                    </Dialog>
                    : null
                }
            </div>
            <MapContainer className="map" center={position} zoom={13}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {businessMarkers}
            </MapContainer>
            <ToastContainer />
        </div>
    );
}

export default BusinessShow;
