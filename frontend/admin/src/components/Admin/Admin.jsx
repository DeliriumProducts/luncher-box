import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom';
import AdminTopBar from '../AdminTopBar/AdminTopBar.jsx';
import SignIn from '../SignIn/SignIn.jsx';
import SignUp from '../SignUp/SignUp.jsx';
import Dashboard from '../Dashboard/Dashboard.jsx';
import AddItems from '../AddItems/AddItems.jsx';
import EditProduct from '../EditProduct/EditProduct.jsx';
import EditCategory from '../EditCategory/EditCategory.jsx';
import ProductList from '../ProductList/ProductList.jsx';
import axios from 'axios';

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false
        }
        this.handleAuthentication = this.handleAuthentication.bind(this);
    }
    componentDidMount() {
        axios.get('http://localhost:8000/login', { withCredentials: true })
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
                <Redirect to='/signin' />
                <Route path='/category/:id' component={ProductList} />
                <Route path='/additems' render={() => <AddItems isAuthenticated={this.state.isAuthenticated} />} />
                <Route path='/editproduct/:id' render={({ match }) => <EditProduct match={match} isAuthenticated={this.state.isAuthenticated} />} />
                <Route path='/editcategory/:id' render={({ match }) => <EditCategory match={match} isAuthenticated={this.state.isAuthenticated} />} />
                <Route path='/signin' render={() => <SignIn isAuthenticated={this.state.isAuthenticated} handleAuthentication={this.handleAuthentication} />} />
                <Route path='/signup' render={() => <SignUp isAuthenticated={this.state.isAuthenticated} handleAuthentication={this.handleAuthentication} />} />
                <Route path='/dashboard' render={() => <Dashboard isAuthenticated={this.state.isAuthenticated} />} />
            </div>
        );
    }
}

export default Admin;