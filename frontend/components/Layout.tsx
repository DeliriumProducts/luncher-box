import { Affix } from 'antd';
import styled from 'styled-components';
import React from 'react';
import { HandleLogin } from '../types';
import MenuBar from './MenuBar';
import LoginForm from './LoginForm';

const CenteredDiv = styled.div`
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

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
    const { isAuthenticated } = this.state;
    return (
      <>
        {isAuthenticated ? (
          <>
            <Affix offsetTop={0}>
              <MenuBar selectedKey={this.props.selectedKey} />
            </Affix>
            {this.props.children}
          </>
        ) : (
          <CenteredDiv>
            <LoginForm handleLogin={this.handleLogin} />
          </CenteredDiv>
        )}
      </>
    );
  }
}
export default Layout;
