import React, { Component } from 'react'
import LoginForm from '../components/Login';
import styled from 'styled-components';

const MyLoginForm = styled(LoginForm)`
  background-color: red;
`
export default class Dashboard extends Component {
  render() {
    return (
      <div>
        <MyLoginForm/>
      </div>
    )
  }
}
