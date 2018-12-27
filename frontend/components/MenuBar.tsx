import { Menu, Icon } from 'antd';
import Link from 'next/link';
import Router from 'next/router';
import styled from 'styled-components';
import { AuthAPI } from '../api';
import { Exit } from 'styled-icons/icomoon/Exit';

interface Props {
  selectedKey: string;
}

const StyledMenu = styled(Menu)`
  display: flex;
  .right {
    margin-left: auto;
  }
`;

const StyledAnchor = styled.a`
  color: inherit;
  cursor: pointer;
`;

const StyledLogOut = styled(Exit)`
  margin-right: 10px;
`;

const handleClick = async (e: any) => {
  const { key } = e;

  switch (key) {
    case 'logout':
      await AuthAPI.logout();
      Router.push('/login');
      break;
    default:
      break;
  }
};

const MenuBar: React.FunctionComponent<Props> = ({ selectedKey }) => {
  return (
    <StyledMenu
      onClick={handleClick}
      mode="horizontal"
      defaultSelectedKeys={[selectedKey]}
    >
      <Menu.Item key="dashboard">
        <Link href="dashboard">
          <StyledAnchor>
            <Icon type="dashboard" />
            Dashboard
          </StyledAnchor>
        </Link>
      </Menu.Item>
      <Menu.Item key="orders">
        <Link href="orders">
          <StyledAnchor>
            <Icon type="table" />
            Orders
          </StyledAnchor>
        </Link>
      </Menu.Item>
      <Menu.Item key="chat">
        <Link href="staffchat">
          <StyledAnchor>
            <Icon type="message" />
            Staff chat
          </StyledAnchor>
        </Link>
      </Menu.Item>
      <Menu.Item key="load">
        <Link href="restaurantload">
          <StyledAnchor>
            <Icon type="pie-chart" />
            Restaurant load
          </StyledAnchor>
        </Link>
      </Menu.Item>
      <Menu.SubMenu
        title={
          <span color="inherit">
            <Icon type="user" />
            My profile
          </span>
        }
        className="right"
      >
        <Menu.Item key="settings">
          <span>
            <Icon type="setting" /> Settings
          </span>
        </Menu.Item>
        <Menu.Item key="logout">
          <span>
            <StyledLogOut size={14} /> Logout
          </span>
        </Menu.Item>
      </Menu.SubMenu>
    </StyledMenu>
  );
};

export default MenuBar;
