import React, { Component } from 'react';
import LoginForm from '../components/LoginForm';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
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
