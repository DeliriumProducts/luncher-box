import React, { Component } from 'react';
import AdminLayout from '../../components/AdminLayout';
import FullHeightContainer from '../../components/FullHeightContainer';
import withAuth from '../../components/withAuth';

class RestaurantLoad extends Component {
  render() {
    return (
      <FullHeightContainer>
        <AdminLayout selectedKey="load">????????</AdminLayout>
      </FullHeightContainer>
    );
  }
}

export default withAuth(RestaurantLoad);
