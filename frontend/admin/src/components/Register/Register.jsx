import axios from 'axios';
import React, { Component } from 'react';
import { backend } from '../../config.js';
import { Redirect } from 'react-router-dom';

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirectToLogin: false
        }

        this.handleRegister = this.handleRegister.bind(this);
    }

    componentDidMount() {
        if (this.props.isAuthenticated) {
            this.setState({
                redirectToLogin: true
            })
        }
    }

    handleRegister(e) {
        e.preventDefault();
        const name = e.target.elements.name.value;
        const email = e.target.elements.email.value;
        const password = e.target.elements.password.value;

        const data = {
            name: name,
            email: email,
            password: password,
        }
        axios.post(`${backend}/register`, data)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        redirectToLogin: true
                    })
                }
            })
    }

    render() {
        if (this.state.redirectToLogin) {
            return <Redirect to='/login' />
        }
        return (
            <form className="Login-form-wrapper" onSubmit={this.handleRegister}>
                <p id="text">Register to create, update or delete items </p>
                <br />
                <label htmlFor="Login-email">Full name</label>
                <input type="text" name="name" id="Login-name" />
                <br />
                <label htmlFor="Login-email">Email</label>
                <input type="text" name="email" id="Login-email" />
                <br />
                <label htmlFor="Login-password">Password</label>
                <input type="password" name="password" id="Login-password" />
                <button id="login-btn">Register</button>
            </form>
        )
    }
}

export default Register;