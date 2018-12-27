import React, { Component, Fragment } from 'react';
import Layout from '../../components/Layout';
import FullHeightContainer from '../../components/FullHeightContainer';
import Index from './index';

class RestaurantLoad extends Index {
  render() {
    return (
      <FullHeightContainer>
        <Layout selectedKey="load">????????</Layout>
      </FullHeightContainer>
    );
  }
}

export default RestaurantLoad;
