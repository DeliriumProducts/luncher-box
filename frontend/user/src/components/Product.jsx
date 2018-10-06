import React, { Component } from 'react';
import '../assets/css/Product.css';
import AddIcon from '@material-ui/icons/Add'

class Product extends Component {
    constructor(props) {
        super(props);
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
                <p id='addicon'>
                    <AddIcon />
                </p>
            </div>
        );
    }
}

export default Product;