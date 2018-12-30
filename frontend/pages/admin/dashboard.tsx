import { Component } from 'react';
import AdminLayout from '../../components/AdminLayout';
import FullHeightContainer from '../../components/FullHeightContainer';
import withAuth from '../../components/withAuth';

class Dashboard extends Component {
  render() {
    return (
      <FullHeightContainer>
        <AdminLayout selectedKey="dashboard">this is the dashboard</AdminLayout>
      </FullHeightContainer>
    );
  }
}

export default withAuth(Dashboard);
