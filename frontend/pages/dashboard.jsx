import React, { Component, Fragment } from 'react';
import LoginForm from '../components/LoginForm';
import MenuBar from '../components/MenuBar';
import { Affix } from 'antd';
import styled from 'styled-components';

const Container = styled.div`
  height: 100%;
`;
const CenteredDiv = styled.div`
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default class Dashboard extends Component {
  state = {
    isAuthenticated: false
  };

  handleLogin = success => {
    this.setState({ isAuthenticated: success });
  };

  render() {
    const { isAuthenticated } = this.state;
    return (
      <Container>
        {isAuthenticated ? (
          <Affix offsetTop="0">
            <MenuBar />
          </Affix>
        ) : (
          <CenteredDiv>
            <LoginForm handleLogin={this.handleLogin} />
          </CenteredDiv>
        )}
      </Container>
    );
  }
}
