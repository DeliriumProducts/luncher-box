import { Component, Fragment } from 'react';
import AdminLayout from '../../components/AdminLayout';
import FullHeightContainer from '../../components/FullHeightContainer';
import withAuth from '../../components/withAuth';

class Orders extends Component {
  render() {
    return (
      <FullHeightContainer>
        <AdminLayout selectedKey="orders">Orders go here...</AdminLayout>
      </FullHeightContainer>
    );
  }
}

export default withAuth(Orders);
