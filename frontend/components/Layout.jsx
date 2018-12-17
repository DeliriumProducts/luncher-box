import MenuBar from './MenuBar';
import LoginForm from './LoginForm';
import { Affix } from 'antd';
import styled from 'styled-components';

const CenteredDiv = styled.div`
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

class Layout extends React.Component {
  state = {
    isAuthenticated: false
  };

  handleLogin = success => {
    this.setState({ isAuthenticated: success });
  };

  render() {
    const { isAuthenticated } = this.state;
    return (
      <>
        {isAuthenticated ? (
          <>
            <Affix offsetTop="0">
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
