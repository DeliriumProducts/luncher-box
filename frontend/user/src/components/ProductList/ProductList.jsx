import axios from 'axios';
import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import Product from '../Product/Product';

class ProductList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: []
        }
    }

    componentDidMount() {
        let categoryId = this.props.match.params.id;
        axios.get(`/products/category/${categoryId}`)
            .then(result => {
                this.setState({
                    products: result.data.products
                })
            });
    }

    render() {
        return (
            <Grid id='Menu-wrapper'>
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
        );
    }
}

export default ProductList;