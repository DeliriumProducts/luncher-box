import React, { Component, Fragment } from 'react';
import LoginForm from '../components/LoginForm';
import MenuBar from '../components/MenuBar';
import { Layout, Affix } from 'antd';
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

const { Header, Content, Footer } = Layout;
export default class Dashboard extends Component {
  render() {
    return (
      <Container>
        <Affix offsetTop="0">
          <MenuBar />
        </Affix>
        <CenteredDiv>
          <LoginForm />
        </CenteredDiv>
      </Container>
    );
  }
}
