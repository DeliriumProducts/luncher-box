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
        this.increment = this.increment.bind(this);
        this.decrement = this.decrement.bind(this);
        this.calculateTotalSum = this.calculateTotalSum.bind(this);
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

    increment(productId) {
        let index = findKey(this.state.products, productId);

        if (index !== undefined) {
            let arr = this.state.products;
            arr[index].quantity++;
            this.setState({
                products: arr
            });
        }
    }

    decrement(productId) {
        let index = findKey(this.state.products, productId);

        if (index !== undefined) {
            let arr = this.state.products;
            if (arr[index] - 1 <= 0) {
                arr.splice(index, 1);
            } else {
                arr[index].quantity--;
            }
            this.setState({
                products: arr
            });
        }
    }

    calculateTotalSum() {
        let products = this.state.products;
        let totalSum = 0;

        for (let product of products) {
            totalSum += product.price * product.quantity;
        }

        return totalSum;
    }

    render() {
        return (
            <div>
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
                                increment={this.increment}
                                decrement={this.decrement}
                                quantity={p.quantity}
                            />
                        )
                    }
                    {this.state.products.length > 0 &&
                        <div className='OrderBar-Wrapper'>
                            Place order! Your total is: {this.calculateTotalSum().toFixed(2)}
                        </div>
                    }
                </Grid >
            </div>
        );
    }
}

export default Order;