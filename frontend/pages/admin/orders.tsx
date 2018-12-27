import React, { Component, Fragment } from 'react';
import Layout from '../../components/Layout';
import FullHeightContainer from '../../components/FullHeightContainer';
import Index from './index';

class Orders extends Index {
  render() {
    return (
      <FullHeightContainer>
        <Layout selectedKey="orders">Orders go here...</Layout>
      </FullHeightContainer>
    );
  }
}

export default Orders;
