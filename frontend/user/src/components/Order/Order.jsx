import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import axios from 'axios';
import localForage from 'localforage';
import Product from '../Product/Product.jsx';
import './Order.css';

class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: []
        }

        this.fetchProducts = this.fetchProducts.bind(this);
    }

    componentDidMount() {
        localForage.getItem('products')
            .then((products) => {
                if (products) {
                    this.fetchProducts(products);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    fetchProducts(productIds) {
        for (const productId of productIds) {
            axios.get(`http://localhost:8000/products/${productId}`)
                .then(result => {
                    let products = this.state.products;
                    products.push(result.data.product);
                    this.setState({
                        products: products
                    })
                });
        }
    }

    render() {
        return (
            <Grid id='Order-wrapper'>
                {
                    this.state.products.length > 0 && this.state.products.map(p =>
                        <Product
                            key={p._id}
                            id={p._id}
                            name={p.name}
                            desc={p.desc}
                            price={p.price}
                            img={p.img}
                        />
                    )
                }
            </Grid >
        );
    }
}

export default Order;