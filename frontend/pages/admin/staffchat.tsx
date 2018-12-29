import React, { Component, Fragment } from 'react';
import AdminLayout from '../../components/AdminLayout';
import FullHeightContainer from '../../components/FullHeightContainer';
import Index from './index';

class StaffChat extends Index {
  render() {
    return (
      <FullHeightContainer>
        <AdminLayout selectedKey="chat">kp</AdminLayout>
      </FullHeightContainer>
    );
  }
}

export default StaffChat;
