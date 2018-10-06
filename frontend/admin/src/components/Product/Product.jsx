import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './Product.css';
import EditIcon from '@material-ui/icons/Create';


class Product extends Component {

    render() {
        return (
            <div className='Product-wrapper'>
                <h2>
                    {this.props.name}
                </h2>
                <img src={this.props.img} alt={this.props.name} />
                <div>
                    {this.props.desc}
                </div>
                <div id='price' >
                    {this.props.price}
                </div>
                <div id='editproduct'>
                    <NavLink to={`/editproduct/${this.props.id}`} >
                        <EditIcon />
                    </NavLink>
                </div>
            </div>
        );
    }
}

export default Product;