import React, { Component, Fragment } from 'react';
import Layout from '../../components/Layout';
import FullHeightContainer from '../../components/FullHeightContainer';
import Index from './index';

class StaffChat extends Index {
  render() {
    return (
      <FullHeightContainer>
        <Layout selectedKey="chat">kp</Layout>
      </FullHeightContainer>
    );
  }
}

export default StaffChat;
