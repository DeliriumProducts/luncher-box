import { Menu, Icon } from 'antd';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const MenuBar = () => {
  return (
    <Menu mode="horizontal" defaultSelectedKeys="dashboard">
      <Menu.Item key="dashboard">
        <Icon type="dashboard" />
        Dashboard
      </Menu.Item>
      <Menu.Item key="Orders">
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
    </Menu>
  );
};

export default MenuBar;
