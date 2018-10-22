import axios from 'axios';
import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import Product from '../Product/Product.jsx';
import './DailyProducts.css';

class DailyProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: []
        };
    }

    componentDidMount() {
        axios.get(`/products/category/5b98d453cea786602f88a002`)
            .then(result => {
                this.setState({
                    products: result.data.products
                })
            });
    }

    render() {
        return (
            <div>
                <Grid id='Daily-wrapper'>
                    {this.state.products.length > 0 && this.state.products.map(p =>
                        <Product
                            key={p._id}
                            _id={p._id}
                            name={p.name}
                            desc={p.desc}
                            price={p.price}
                            img={p.img}
                        />
                    )}
                </Grid>
            </div>
        );
    }
}

export default DailyProducts;