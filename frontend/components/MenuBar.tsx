import { Menu, Icon } from 'antd';
import Link from 'next/link';
import Router from 'next/router';
import styled from 'styled-components';
import { AuthAPI } from '../api';

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
        <span>
          <Link href="dashboard" prefetch>
            <StyledAnchor>
              <Icon type="dashboard" />
              Dashboard
            </StyledAnchor>
          </Link>
        </span>
      </Menu.Item>
      <Menu.Item key="orders">
        <span>
          <Link href="orders" prefetch>
            <StyledAnchor>
              <Icon type="table" />
              Orders
            </StyledAnchor>
          </Link>
        </span>
      </Menu.Item>
      <Menu.ItemGroup>
        <Link href="staffchat" prefetch>
          <Menu.Item key="chat">
            <Icon type="message" />
            Staff chat
          </Menu.Item>
        </Link>
      </Menu.ItemGroup>
      <Menu.Item key="load">
        <span>
          <Link href="restaurantload" prefetch>
            <StyledAnchor>
              <Icon type="pie-chart" />
              Restaurant load
            </StyledAnchor>
          </Link>
        </span>
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
        <Menu.Item key="settings">Settings</Menu.Item>
        <Menu.Item key="logout">Logout</Menu.Item>
      </Menu.SubMenu>
    </StyledMenu>
  );
};

export default MenuBar;
