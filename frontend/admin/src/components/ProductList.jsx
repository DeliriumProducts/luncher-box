import React, { Component } from 'react';
import Product from './Product';
import { Grid } from 'react-bootstrap';

class ProductList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: []
        }
    }

    componentDidMount() {
        let categoryId = this.props.match.params.id;

        fetch(`http://localhost:8000/products/${categoryId}`)
            .then(res => res.json())
            .then(products => {
                this.setState({
                    products: products.products
                })
            });
    }

    render() {
        return (
            <Grid id='Dashboard-wrapper'>
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