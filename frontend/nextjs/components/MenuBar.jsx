import { Menu, Icon } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';

const StyledMenu = styled(Menu)`
  display: flex;

  & > * {
    flex: 1;
    text-align: center;
  }
`;

const MenuBar = ({ selectedKey }) => {
  return (
    <StyledMenu mode="horizontal" defaultSelectedKeys={selectedKey}>
      <Menu.Item key="dashboard">
        <Icon type="dashboard" />
        Dashboard
      </Menu.Item>
      <Menu.Item key="orders">
        <Icon type="table" />
        Orders
      </Menu.Item>
      <Menu.Item key="chat">
        <Icon type="message" />
        Staff chat
      </Menu.Item>
      <Menu.Item key="load">
        <Icon type="pie-chart" />
        Restaurant load
      </Menu.Item>
    </StyledMenu>
  );
};

export default MenuBar;
