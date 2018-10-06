import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import './AddItems.css';

class AddItems extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isProduct: true,
            hasFinished: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange() {

        this.setState({
            isProduct: !this.state.isProduct
        })
        console.log(this.state.isProduct);
    }

    handleSubmit(e) {
        e.preventDefault();

        if (this.state.isProduct) {
            const data = {
                name: e.target.elements.name.value,
                category: e.target.elements.category.value,
                desc: e.target.elements.description.value,
                price: e.target.elements.price.value,
                img: e.target.elements.img.value,
            }

            axios.post('http://localhost:8000/products', data)
                .then(response => {
                    if (response.status === 200) {
                        console.log('Product created.');
                        this.setState({
                            hasFinished: true
                        })
                    }
                })

        } else {
            const data = {
                name: e.target.elements.name.value,
                img: e.target.elements.img.value,
            }
            axios.post('http://localhost:8000/categories', data)
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            hasFinished: true
                        })
                    }
                })
        }
    }

    render() {
        if (!this.props.isAuthenticated) {
            return <Redirect to='/signin' />
        }

        if (this.state.hasFinished) {
            return <Redirect to='/dashboard' />
        }

        return (
            <form className="AddItems-form-wrapper" onSubmit={this.handleSubmit}>
                <p id="AddItems-text"> Add new </p>
                <br />
                <label htmlFor="category">Category</label>
                <input type="radio" id="radio-category" name="type" checked={this.state.isProduct === false} onChange={this.handleChange} value="category" />
                <br />
                <label htmlFor="product">Product</label>
                <input type="radio" id="radio-product" name="type" checked={this.state.isProduct === true} onChange={this.handleChange} value="product" />
                <br />
                <br />
                <label htmlFor="AddItems-name">Name</label>
                <input type="text" name="name" id="AddItems-name" />
                <br />
                <label htmlFor="AddItems-img">Image</label>
                <input type="text" name="img" id="AddItems-img" />
                <br />
                {this.state.isProduct && <label htmlFor="AddItems-description">Description</label>}
                {this.state.isProduct && <input type="text" name="description" id="AddItems-description" />}
                <br />
                {this.state.isProduct && <label htmlFor="AddItems-category">Category</label>}
                {this.state.isProduct && <input type="text" name="category" id="AddItems-category" />}
                <br />
                {this.state.isProduct && <label htmlFor="AddItems-price">Price</label>}
                {this.state.isProduct && <input type="number" name="price" id="AddItems-price" />}
                <button id="add-btn">Add</button>
            </form>
        )
    }
}

export default AddItems;