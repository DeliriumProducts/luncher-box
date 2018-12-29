import React, { Component, Fragment } from 'react';
import AdminLayout from '../../components/AdminLayout';
import FullHeightContainer from '../../components/FullHeightContainer';
import Index from './index';

class RestaurantLoad extends Index {
  render() {
    return (
      <FullHeightContainer>
        <AdminLayout selectedKey="load">????????</AdminLayout>
      </FullHeightContainer>
    );
  }
}

export default RestaurantLoad;
