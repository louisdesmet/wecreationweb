import React, {useEffect} from 'react';
import {connect} from "react-redux";
import {getBusinesses} from "./redux/actions";
import {useSelector} from "react-redux";
import { Link } from 'react-router-dom';
import './css/Admin.scss';
import AdminNav from "./AdminNav";
export const AdminProducts = ({getBusinesses}) => {

    useEffect(() => {
        getBusinesses();
    }, []);

    const businesses = useSelector(state => state.remoteBusinesses);

    const businessList = businesses.data ? (
        <div className='admin-projects'>
            <div>
                <p className='bold'>Naam</p>
                <p className='bold'>In stock</p>
                <p className='bold'>Prijs</p>
                <p></p>
            </div>
            {

                businesses.data.map(business => 
                 
                    business.products.map(product => 
                        
                        <div key={product.id}>
                            {console.log('yo')}
                            <p>{product.name}</p>
                            <p>{product.amount}</p>
                            <p>{product.price}</p>
                            <p><Link className='edit' to={"/admin-products/edit/" + business.id + "/" + product.id}>Aanpassen</Link></p>
                        </div>
                    )
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
                        <h2>Producten</h2>
                        <p className='new'><Link to="/admin-products/create">Nieuw product</Link></p>
                    </div>
                    {businessList}
                </div>
            </div>
        </div>
    );
}

export default connect(
    null,
    {getBusinesses}
)(AdminProducts);