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
        let categoryId = this.props.match.params.id;

        const data = {
            name: e.target.elements.name.value,
            img: e.target.elements.img.value
        }

        axios.put(`http://localhost:8000/categories/${categoryId}`, data)
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
        let categoryId = this.props.match.params.id;

        axios.get(`http://localhost:8000/categories/${categoryId}`)
            .then(result => {
                this.setState({
                    categoryName: result.data.category.name,
                    categoryImg: result.data.category.img,
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
                <input type="text" name="name" id="AddItems-name" onChange={this.handleChange('categoryName')} value={this.state.categoryName} />
                <br />
                <label htmlFor="AddCategory-img">Image</label>
                <input type="text" name="img" id="AddItems-img" onChange={this.handleChange('categoryImg')}value={this.state.categoryImg} />
                <br />
                <button id="add-btn">Edit Category</button>
            </form>
        )
    }
}

export default EditCategory;