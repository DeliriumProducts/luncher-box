import React, { Component, Fragment } from 'react';
import AdminLayout from '../../components/AdminLayout';
import FullHeightContainer from '../../components/FullHeightContainer';
import Index from './index';

class Orders extends Index {
  render() {
    return (
      <FullHeightContainer>
        <AdminLayout selectedKey="orders">Orders go here...</AdminLayout>
      </FullHeightContainer>
    );
  }
}

export default Orders;
