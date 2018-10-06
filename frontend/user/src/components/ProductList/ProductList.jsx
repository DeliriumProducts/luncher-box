import React, { Component } from 'react';
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
        axios.get(`http://localhost:8000/products/category/${categoryId}`)
            .then(result => {
                this.setState({
                    products: result.data.products
                })
            });
    }

    render() {
        return (
            <Grid id='Menu-wrapper'>
                {this.state.products.length && this.state.products.map(p => {
                    return <Product
                        key={p._id}
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