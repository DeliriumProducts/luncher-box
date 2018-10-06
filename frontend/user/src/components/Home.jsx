import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom';
import { Grid } from 'react-bootstrap';
import DailyProducts from './DailyProducts';
import Menu from './Menu';
import Order from './Order';
import HomeTopBar from './HomeTopBar';
import ProductList from './ProductList';

class Home extends Component {


    render() {
        return (
            <div>
                <HomeTopBar />
                <Redirect to='/daily' />
                <Route path='/category/:id' component={ProductList} />
                <Route path='/menu' component={Menu} />
                <Route path='/order' component={Order} />
                <Route path='/daily' component={DailyProducts} />
            </div>
        );
    }
}

export default Home;