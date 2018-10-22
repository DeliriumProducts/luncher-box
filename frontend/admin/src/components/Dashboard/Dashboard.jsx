import AddIcon from '@material-ui/icons/Add';
import axios from 'axios';
import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import { backend } from '../../config.js';
import { NavLink, Redirect } from 'react-router-dom';
import Category from '../Category/Category.jsx';
import './Dashboard.css';


class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: []
        }
    }

    componentDidMount() {

        if (!this.props.isAuthenticated) {
            return;
        }

        axios.get(`${backend}/categories`, { withCredentials: true })
            .then(response => {
                this.setState({
                    categories: response.data.categories
                })
            });
    }

    render() {
        if (!this.props.isAuthenticated) {
            return <Redirect to='/login' />
        }
        return (
            <Grid id='Dashboard-wrapper'>
                {this.state.categories.length > 0 && this.state.categories.map(p =>
                    <Category
                        key={p._id}
                        _id={p._id}
                        name={p.name}
                        img={p.img}
                        url={`/category/${p._id}`}
                    />
                )}
                <br />
                <div id="icon-wrapper" >
                    <NavLink to='/additems'>
                        <AddIcon id="add-icon" />
                    </NavLink>
                </div>
            </Grid>
        );
    }
}

export default Dashboard;