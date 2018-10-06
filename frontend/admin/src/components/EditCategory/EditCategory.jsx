import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './EditCategory.css';
import axios from 'axios';

class EditCategory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categoryName: null,
            productImg: null,
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
            img: e.target.elements.img.value
        }

        axios.put(`http://localhost:8000/products/${productId}`, data)
            .then(response => {
                if (response.status === 200) {
                    console.log('Product created.');
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

        axios.get(`http://localhost:8000/categories/${productId}`)
            .then(result => {
                this.setState({
                    categoryName: result.data.product.name,
                    categoryImg: result.data.product.img,
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
            <form className="EditCategory-form-wrapper" onSubmit={this.handleSubmit}>
                <label htmlFor="EditCategory-name">Name</label>
                <input type="text" name="name" id="AddItems-name" onChange={this.handleChange('productName')} value={this.state.productName} />
                <br />
                <label htmlFor="AddCategory-img">Image</label>
                <input type="text" name="img" id="AddItems-img" value={this.state.productImg} />
                <br />
                <button id="add-btn">Edit Category</button>
            </form>
        )
    }
}

export default EditCategory;