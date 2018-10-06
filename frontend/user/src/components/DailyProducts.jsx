import React, { Component } from 'react';
import '../assets/css/DailyProducts.css';
import { Grid } from 'react-bootstrap';
import Product from './Product';

class DailyProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: []
        };
    }

    componentDidMount() {
        fetch('http://localhost:8000/products/5b98d453cea786602f88a002')
            .then(res => res.json())
            .then(products => {
                this.setState({
                    products: products.products
                })
            });
    }

    render() {
        return (
            <div>
                <Grid id='Daily-wrapper'>
                    {this.state.products.length && this.state.products.map(p =>
                        <Product
                            key={p._id}
                            name={p.name}
                            price={p.price}
                            img={p.img}
                            url={`/category/${p._id}`}
                        />
                    )}
                </Grid>
            </div>
        );
    }
}

export default DailyProducts;