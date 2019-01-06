import { Component } from 'react';
import AdminLayout from '../../components/AdminLayout';
import FullHeightContainer from '../../components/FullHeightContainer';
import withAuth from '../../components/withAuth';

class StaffChat extends Component {
  render() {
    return (
      <FullHeightContainer>
        <AdminLayout selectedKey="chat">kp</AdminLayout>
      </FullHeightContainer>
    );
  }
}

export default withAuth(StaffChat);
