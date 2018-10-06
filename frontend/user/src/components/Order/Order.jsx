import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import axios from 'axios';
import findKey from '../../utils/utils.js'
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
        this.iterate = this.iterate.bind(this);
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

    fetchProducts(products) {
        for (const product of products) {
            axios.get(`http://localhost:8000/products/${product._id}`)
                .then(result => {
                    let newProducts = this.state.products;
                    result.data.product.quantity = product.quantity;
                    newProducts.push(result.data.product);
                    this.setState({
                        products: newProducts
                    })
                });
        }
    }

    iterate(productId) {
        let index = findKey(this.state.products, productId);

        if (index !== undefined) {
            let arr = this.state.products;
            arr[index].quantity++;
            this.setState({
                products: arr
            });
        }
        // this.setState({
        //     products: []
        // });
        // localForage.getItem('products')
        //     .then((products) => {
        //         if (products) {
        //             this.fetchProducts(products);
        //         }
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     })
    }

    render() {
        return (
            <Grid id='Order-wrapper'>
                {
                    this.state.products.length > 0 && this.state.products.map(p =>
                        <Product
                            key={p._id}
                            _id={p._id}
                            name={(p.quantity > 1 ? p.quantity + 'x ' : '') + p.name}
                            desc={p.desc}
                            price={p.price}
                            img={p.img}
                            iterate={this.iterate}
                        />
                    )
                }
            </Grid >
        );
    }
}

export default Order;