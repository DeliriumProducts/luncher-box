import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class SignUp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirectToDashboard: false
        }

        this.handleSignUp = this.handleSignUp.bind(this);
    }

    componentDidMount() {
        if (this.props.isAuthenticated) {
            this.setState({
                redirectToDashboard: true
            })
        }
    }

    handleSignUp(e) {
        e.preventDefault();
        const name = e.target.elements.name.value;
        const email = e.target.elements.email.value;
        const password = e.target.elements.password.value;

        const data = {
            name: name,
            email: email,
            password: password,
        }
        fetch('http://localhost:8000/register', {
            method: "POST", // 
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                console.log(response);
                if (response.status === 200) {
                    this.props.handleAuthentication(true);
                    this.setSextendstate({
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
            <form className="SignIn-form-wrapper" onSubmit={this.handleSignUp}>
                <p id="text">Sign up to create, update or delete items </p>
                <br />
                <label htmlFor="SignIn-email">Full name</label>
                <input type="text" name="name" id="SignIn-name" />
                <br />
                <label htmlFor="SignIn-email">Email</label>
                <input type="text" name="email" id="SignIn-email" />
                <br />
                <label htmlFor="SignIn-password">Password</label>
                <input type="password" name="password" id="SignIn-password" />
                <button id="sign-in-btn">Sign in</button>
            </form>
        )
    }
}

export default SignUp;