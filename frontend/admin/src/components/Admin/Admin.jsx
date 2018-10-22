import axios from 'axios';
import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import AddItems from '../AddItems/AddItems.jsx';
import AdminTopBar from '../AdminTopBar/AdminTopBar.jsx';
import Dashboard from '../Dashboard/Dashboard.jsx';
import EditCategory from '../EditCategory/EditCategory.jsx';
import { backend } from '../../config.js';
import EditProduct from '../EditProduct/EditProduct.jsx';
import ProductList from '../ProductList/ProductList.jsx';
import Login from '../Login/Login.jsx';
import Register from '../Register/Register.jsx';

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false
        }
        this.handleAuthentication = this.handleAuthentication.bind(this);
    }
    componentDidMount() {
        axios.get(`${backend}/login`, { withCredentials: true })
            .then(response => {
                this.setState({
                    isAuthenticated: response.data.isAuthenticated
                })
            })
    }

    handleAuthentication(isAuthenticated) {
        this.setState({
            isAuthenticated: isAuthenticated
        })
    }

    render() {
        return (
            <div>
                <AdminTopBar isAuthenticated={this.state.isAuthenticated} />
                <Redirect to='/login' />
                <Route path='/category/:id' component={ProductList} />
                <Route path='/additems' render={() => <AddItems isAuthenticated={this.state.isAuthenticated} />} />
                <Route path='/editproduct/:id' render={({ match }) => <EditProduct match={match} isAuthenticated={this.state.isAuthenticated} />} />
                <Route path='/editcategory/:id' render={({ match }) => <EditCategory match={match} isAuthenticated={this.state.isAuthenticated} />} />
                <Route path='/login' render={() => <Login isAuthenticated={this.state.isAuthenticated} handleAuthentication={this.handleAuthentication} />} />
                <Route path='/register' render={() => <Register isAuthenticated={this.state.isAuthenticated} handleAuthentication={this.handleAuthentication} />} />
                <Route path='/dashboard' render={() => <Dashboard isAuthenticated={this.state.isAuthenticated} />} />
            </div>
        );
    }
}

export default Admin;