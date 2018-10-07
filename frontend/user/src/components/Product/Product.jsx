import React, { Component } from 'react';
import findKey from '../../utils/utils.js';
import './Product.css';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import localForage from 'localforage';

class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quantity: 0
        };

        this.addItem = this.addItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
    }

    componentDidMount() {
        if (this.props.quantity) {
            this.setState({
                quantity: this.props.quantity
            });
        }
    }

    addItem() {
        localForage.getItem('products')
            .then((products) => {
                if (products) {
                    let index = findKey(products, this.props._id);
                    if (index !== undefined) {
                        products[index].quantity++;
                        if (this.props.increment) {
                            this.props.increment(this.props._id);
                        }
                        this.setState({
                            quantity: products[index].quantity
                        });
                    } else {
                        products.push({
                            _id: this.props._id,
                            price: this.props.price,
                            quantity: 1
                        });
                        this.setState({
                            quantity: 1
                        });
                    }
                    localForage.setItem('products', products)
                } else {
                    localForage.setItem('products', [{
                        _id: this.props._id,
                        price: this.props.price,
                        quantity: 1
                    }]);
                }
            })
            .catch((err) => {
                console.log(err);
            })

    }

    removeItem() {
        localForage.getItem('products')
            .then((products) => {
                if (products) {
                    let index = findKey(products, this.props._id);
                    if (index !== undefined) {
                        if (products[index].quantity - 1 < 1) {
                            products.splice(index, 1);
                        } else {
                            products[index].quantity--;
                            this.setState({
                                quantity: products[index].quantity
                            });
                        }
                        if (this.props.decrement) {
                            this.props.decrement(this.props._id);
                        }
                    }
                    localForage.setItem('products', products)
                }
            })
            .catch((err) => {
                console.log(err);
            })

    }

    render() {
        return (
            <div className='Product-wrapper'>
                <h2>
                    {this.props.name}
                </h2>
                <img src={this.props.img} alt={this.props.name} />
                <p>
                    {this.props.desc}
                </p>
                <p id='price' >
                    {this.props.price} / a piece
                </p>
                <div id='addicon' onClick={this.addItem}>
                    <AddIcon />
                </div>
                {
                    this.state.quantity > 0 && this.props.quantity &&
                    <div id='removeicon' onClick={this.removeItem}>
                        <RemoveIcon />
                    </div>
                }
            </div>
        );
    }
}

export default Product;