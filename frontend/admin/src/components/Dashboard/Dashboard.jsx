import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import { NavLink, Redirect } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
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

        fetch('http://localhost:8000/categories/')
            .then(res => res.json())
            .then(categories => {
                this.setState({
                    categories: categories.categories
                })
            });
    }

    render() {
        if (!this.props.isAuthenticated) {
            return <Redirect to='/signin' />
        }
        return (
            <Grid id='Dashboard-wrapper'>
                {this.state.categories.length && this.state.categories.map(p =>
                    <Category
                        key={p._id}
                        name={p.name}
                        img={p.img}
                        url={`/category/${p._id}`}
                    />
                )}
                <br />
                <div id="icon-wrapper" >
                    <NavLink to='/addItems'>
                        <AddIcon id="add-icon" />
                    </NavLink>
                </div>
            </Grid>
        );
    }
}

export default Dashboard;