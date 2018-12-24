import { Affix } from 'antd';
import styled from 'styled-components';
import React from 'react';
import { HandleLogin } from '../types';
import MenuBar from './MenuBar';
import CenteredDiv from './CenteredDiv';

type State = {
  isAuthenticated: boolean;
};

type Props = {
  selectedKey: string;
};

class Layout extends React.Component<Props, State> {
  state = {
    isAuthenticated: false
  };

  handleLogin: HandleLogin = success => {
    this.setState({ isAuthenticated: success });
  };

  render() {
    return (
      <>
        <Affix offsetTop={0}>
          <MenuBar selectedKey={this.props.selectedKey} />
        </Affix>
        {this.props.children}
        )}
      </>
    );
  }
}
export default Layout;
