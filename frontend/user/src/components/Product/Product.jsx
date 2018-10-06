import React, { Component } from 'react';
import './Product.css';
import AddIcon from '@material-ui/icons/Add';
import localForage from 'localforage';

class Product extends Component {
    constructor(props) {
        super(props);
        this.addItem = this.addItem.bind(this);
    }

    addItem() {
        localForage.getItem('products')
            .then((products) => {
                if (products) {
                    products.push(this.props.id);
                    localForage.setItem('products', products)
                } else {
                    localForage.setItem('products', [this.props.id]);
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
                    {this.props.price}
                </p>
                <div id='addicon' onClick={this.addItem}>
                    <AddIcon />
                </div>
            </div>
        );
    }
}

export default Product;