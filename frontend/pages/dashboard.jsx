import React, { Component } from 'react';
import LoginForm from '../components/LoginForm';
import styled from 'styled-components';

const Container = styled.div`
  padding: 0;
  height: 100%;
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
