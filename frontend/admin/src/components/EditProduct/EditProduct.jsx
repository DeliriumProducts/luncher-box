import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class EditProduct extends Component {

    constructor(props) {
        super(props);
        this.state = {
            productName: null,
            productImg: null,
            productDesc: null,
            productCategory: null,
            productPrice: null
        }
        this.getProduct = this.getProduct.bind(this);
    }

    getProduct() {
       
    }

    componentDidMount() {
        let productId = this.props.match.params.id;
        axios.get(`http://localhost:8000/products/${productId}`)
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
                <label htmlFor="EditProduct-name">New name</label>
                <input type="text" name="name" id="AddItems-name" value={this.state.productName} />
                <br />
                <label htmlFor="AddItems-img">New Image</label>
                <input type="text" name="img" id="AddItems-img" value={this.state.productImg} />
                <br />
                <label htmlFor="EditProduct-description">New Description</label>
                <input type="text" name="description" id="AddItems-description" value={this.state.productDesc} />
                <br />
                <label htmlFor="AddItems-category">New Category</label>
                <input type="text" name="category" id="AddItems-category" value={this.state.productCategory} />
                <br />
                <label htmlFor="AddItems-price">New Price</label>
                <input type="number" name="price" id="AddItems-price" value={this.state.productPrice} />
                <button id="add-btn">Edit</button>
            </form>
        )
    }
}

export default EditProduct;