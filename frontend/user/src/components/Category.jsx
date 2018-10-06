import React, { Component } from 'react';
import '../assets/css/Category.css';
import { NavLink } from 'react-router-dom';

class Category extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='Category-wrapper'>
                <NavLink to={this.props.url}>
                    <h2>
                        {this.props.name}
                    </h2>
                    <img src={this.props.img} alt={this.props.name} />
                </NavLink>
            </div>
        );
    }
}

export default Category;