import React, { Component, Fragment } from 'react';
import Layout from '../components/Layout';
import styled from 'styled-components';

const Container = styled.div`
  height: 100%;
`;

export default class Dashboard extends Component {
  render() {
    return (
      <Container>
        <Layout selectedKey="orders" />
      </Container>
    );
  }
}
