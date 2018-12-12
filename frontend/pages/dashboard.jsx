import React, { Component } from 'react';
import LoginForm from '../components/LoginForm';
import styled from 'styled-components';

const Container = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export default class Dashboard extends Component {
  render() {
    return (
      <Container>
        <LoginForm />
      </Container>
    );
  }
}
