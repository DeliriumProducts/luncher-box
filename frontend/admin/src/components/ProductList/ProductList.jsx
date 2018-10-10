import React, { Component } from 'react';
import { backend } from '../../config.js';
import Product from '../Product/Product.jsx';
import { Grid } from 'react-bootstrap';
import axios from 'axios';

class ProductList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: []
        }
    }

    componentDidMount() {
        let categoryId = this.props.match.params.id;
        axios.get(`${backend}/products/category/${categoryId}`, { withCredentials: true })
            .then(response => {
                this.setState({
                    products: response.data.products
                })
            });
    }

    render() {
        return (
            <Grid id='Dashboard-wrapper'>
                {this.state.products.length && this.state.products.map(p => {
                    return <Product
                        key={p._id}
                        _id={p._id}
                        name={p.name}
                        desc={p.desc}
                        price={p.price}
                        img={p.img}
                    />
                }
                )}
            </Grid>
        );
    }
}

export default ProductList;