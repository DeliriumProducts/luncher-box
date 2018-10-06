import React, { Component } from 'react';
import axios from 'axios';
import { Grid } from 'react-bootstrap';
import Category from '../Category/Category.jsx';
import './Menu.css'

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: []
        };
    }

    componentDidMount() {
        axios.get('http://localhost:8000/categories/')
            .then(result => {
                this.setState({
                    categories: result.data.categories
                })
            });
    }

    render() {
        return (
            <Grid id='Menu-wrapper'>
                {this.state.categories.length && this.state.categories.map(c =>
                    <Category
                        key={c._id}
                        name={c.name}
                        img={c.img}
                        url={`/category/${c._id}`}
                    />
                )}
            </Grid>
        );
    }
}

export default Menu;