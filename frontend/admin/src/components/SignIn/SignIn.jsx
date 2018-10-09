import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import './SignIn.css';

class SignIn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirectToDashboard: false
        }

        this.handleSignIn = this.handleSignIn.bind(this);
    }

    componentDidUpdate() {
        if (this.props.isAuthenticated) {
            this.setState({
                redirectToDashboard: true
            })
        }
    }

    handleSignIn(e) {
        e.preventDefault();
        const email = e.target.elements.email.value;
        const password = e.target.elements.password.value;

        const data = {
            email: email,
            password: password,
        }

        axios.post('http://localhost:8000/login', data, { withCredentials: true })
            .then(response => {
                if (response.status === 200) {
                    this.props.handleAuthentication(true);
                    this.setState({
                        redirectToDashboard: true
                    })
                }
            })
    }

    render() {
        if (this.state.redirectToDashboard) {
            return <Redirect to='/dashboard' />
        }
        return (
            <div>
                <form className="SignIn-form-wrapper" onSubmit={this.handleSignIn}>
                    <p id="text">Sign in to create, update or delete items </p>
                    <br />
                    <label htmlFor="SignIn-email">Email</label>
                    <input type="text" name="email" id="SignIn-email" />
                    <br />
                    <label htmlFor="SignIn-password">Password</label>
                    <input type="password" name="password" id="SignIn-password" />
                    <button id="sign-in-btn">Sign in</button>
                </form>
            </div>
        )
    }
}

export default SignIn;