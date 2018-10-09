import React, { Component } from 'react';
import axios from 'axios';
import './DailyProducts.css';
import { Grid } from 'react-bootstrap';
import Product from '../Product/Product.jsx';

class DailyProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: []
        };
    }

    componentDidMount() {
        axios.get('http://localhost:8000/products/category/5b98d453cea786602f88a002')
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
                    {this.state.products.length && this.state.products.map(p =>
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