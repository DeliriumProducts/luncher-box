import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import Category from './Category';
import '../assets/css/Menu.css'

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: []
        };
    }

    componentDidMount() {
        fetch('http://localhost:8000/categories/')
            .then(res => res.json())
            .then(categories => {
                this.setState({
                    categories: categories.categories
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