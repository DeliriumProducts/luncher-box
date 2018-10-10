import React, { Component } from 'react';
import { backend } from '../../config.js'
import { NavLink, Redirect } from 'react-router-dom';
import axios from 'axios';
import EditIcon from '@material-ui/icons/Create';
import TrashIcon from '@material-ui/icons/DeleteOutline';
import './Category.css';

class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wasDeleted: false
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.preventDefault();
        let categoriesId = this.props._id;
        axios.delete(`${backend}/categories/${categoriesId}`, { withCredentials: true })
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
            return <Redirect to={`/dashboard`} />
        }
        return (
            <div className='Category-wrapper'>
                <NavLink to={this.props.url}>
                    <h2>
                        {this.props.name}
                    </h2>
                    <img src={this.props.img} alt={this.props.name} />
                </NavLink>
                <div>
                    <NavLink to={`/editcategory/${this.props._id}`} >
                        <EditIcon className='icons' />
                    </NavLink>
                    <TrashIcon className='icons' onClick={this.handleClick} />
                </div>
            </div>
        );
    }
}

export default Category;