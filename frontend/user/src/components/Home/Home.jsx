import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom';
import DailyProducts from '../DailyProducts/DailyProducts.jsx';
import Menu from '../Menu/Menu.jsx';
import Order from '../Order/Order.jsx';
import HomeTopBar from '../HomeTopBar/HomeTopBar.jsx';
import ProductList from '../ProductList/ProductList.jsx';

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