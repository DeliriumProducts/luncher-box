import axios from 'axios';
import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import { backend } from '../../config.js';
import Product from '../Product/Product.jsx';

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
                {this.state.products.length > 0 && this.state.products.map(p => {
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