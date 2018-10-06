import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom';
import AdminTopBar from '../AdminTopBar/AdminTopBar.jsx';
import SignIn from '../SignIn/SignIn.jsx';
import SignUp from '../SignUp/SignUp.jsx';
import Dashboard from '../Dashboard/Dashboard.jsx';
import AddItems from '../AddItems/AddItems.jsx';
import ProductList from '../ProductList/ProductList.jsx';

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false
        }
        this.handleAuthentication = this.handleAuthentication.bind(this);
    }
    componentDidMount() {

        fetch('http://localhost:8000/login')
            .then(response => response.json())
            .then(data => this.setState({
                isAuthenticated: data.isAuthenticated
            }))
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
                <Redirect to='/signin' />
                <Route path='/category/:id' component={ProductList} />
                <Route path='/addItems' render={() => <AddItems isAuthenticated={this.state.isAuthenticated} />} />
                <Route path='/signin' render={() => <SignIn isAuthenticated={this.state.isAuthenticated} handleAuthentication={this.handleAuthentication} />} />
                <Route path='/signup' render={() => <SignUp isAuthenticated={this.state.isAuthenticated} handleAuthentication={this.handleAuthentication} />} />
                <Route path='/dashboard' render={() => <Dashboard isAuthenticated={this.state.isAuthenticated} />} />
            </div>
        );
    }
}

export default Admin;