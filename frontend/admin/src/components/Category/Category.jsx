import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Create';
import './Category.css';

class Category extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false
        }
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
                <div>
                    <NavLink to={`/editcategory/${this.props._id}`} >
                        <EditIcon className='icons' />
                    </NavLink>
                </div>
            </div>
        );
    }
}

export default Category;