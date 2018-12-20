import { Menu, Icon } from 'antd';
import styled from 'styled-components';

type Props = {
  selectedKey: string;
};

const StyledMenu = styled(Menu)`
  display: flex;

  & > * {
    flex: 1;
    text-align: center;
  }
`;

const MenuBar: React.FunctionComponent<Props> = ({ selectedKey }) => {
  return (
    <StyledMenu
      mode="horizontal"
      defaultSelectedKeys={[selectedKey]}
      theme="dark"
    >
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
