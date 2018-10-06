import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Create';
import TrashIcon from '@material-ui/icons/DeleteOutline';
import axios from 'axios';
import './Product.css';

class Product extends Component {

    constructor(props) {
        super(props);
        this.state = {
            wasDeleted: false
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.preventDefault();
        let productId = this.props._id;
        axios.delete(`http://localhost:8000/products/${productId}`)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        wasDeleted: true
                    })
                }
            })
    }

    render() {
        if (this.state.wasDeleted) {
            return <Redirect to={`/category/${this.props._id}`} />
        }
        return (
            <div className='Product-wrapper'>
                <h2>
                    {this.props.name}
                </h2>
                <img src={this.props.img} alt={this.props.name} />
                <p>
                    {this.props.desc}
                </p>
                <p id='price'>
                    {this.props.price} / a piece
                </p>
                <p>
                    <NavLink to={`/editproduct/${this.props._id}`} >
                        <EditIcon className='icons' />
                    </NavLink>
                    <TrashIcon className='icons' onClick={this.handleClick} />
                </p>
            </div>
        );
    }
}

export default Product;