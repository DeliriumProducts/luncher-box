import axios from 'axios';
import { backend } from '../../config.js';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './EditProduct.css';

class EditProduct extends Component {

    constructor(props) {
        super(props);
        this.state = {
            productName: null,
            productImg: null,
            productDesc: null,
            productCategory: null,
            productPrice: null,
            hasFinished: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        let productId = this.props.match.params.id;

        const data = {
            name: e.target.elements.name.value,
            category: e.target.elements.category.value,
            desc: e.target.elements.description.value,
            price: e.target.elements.price.value,
            img: e.target.elements.img.value,
        }

        axios.put(`${backend}/products/${productId}`, data, { withCredentials: true })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        hasFinished: true
                    })
                }
            })
        this.setState({
            hasFinished: true
        })
    }

    handleChange(field) {
        return (e) => {
            this.setState({
                [field]: e.target.value
            })
        }
    }

    componentDidMount() {
        let productId = this.props.match.params.id;

        axios.get(`${backend}/products/${productId}`, { withCredentials: true })
            .then(result => {
                this.setState({
                    productName: result.data.product.name,
                    productImg: result.data.product.img,
                    productDesc: result.data.product.desc,
                    productCategory: result.data.product.category,
                    productPrice: result.data.product.price
                })
            })
    }

    render() {
        if (!this.props.isAuthenticated) {
            return <Redirect to='/signin' />
        }

        if (this.state.hasFinished) {
            return <Redirect to='/dashboard' />
        }

        return (
            <form className="EditProduct-form-wrapper" onSubmit={this.handleSubmit}>
                <label htmlFor="EditProduct-name">Name</label>
                <input type="text" name="name" id="AddItems-name" onChange={this.handleChange('productName')} value={this.state.productName} />
                <br />
                <label htmlFor="AddItems-img">Image</label>
                <input type="text" name="img" id="AddItems-img" onChange={this.handleChange('productImg')} value={this.state.productImg} />
                <br />
                <label htmlFor="EditProduct-description">Description</label>
                <input type="text" name="description" id="AddItems-description" onChange={this.handleChange('productDesc')} value={this.state.productDesc} />
                <br />
                <label htmlFor="AddItems-category">Category</label>
                <input type="text" name="category" id="AddItems-category" onChange={this.handleChange('productCategory')} value={this.state.productCategory} />
                <br />
                <label htmlFor="AddItems-price">Price</label>
                <input type="number" name="price" id="AddItems-price" onChange={this.handleChange('productPrice')} value={this.state.productPrice} />
                <button id="add-btn">Edit Product</button>
            </form>
        )
    }
}

export default EditProduct;