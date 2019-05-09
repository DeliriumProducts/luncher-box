import { Badge, Icon, Menu } from 'antd';
import Link from 'next/link';
import Router from 'next/router';
import React from 'react';
import styled from 'styled-components';
import { Exit } from 'styled-icons/icomoon/Exit';
import { SpoonKnife } from 'styled-icons/icomoon/SpoonKnife';
import { StaffAPI } from '../api';
import { THEME_VARIABLES } from '../config';
import { AdminContext, CustomerContext } from '../context';
import { Role } from '../types';

interface Props {
  selectedKey: string;
  type: 'admin' | 'customer';
}

const MenuContainer = styled.div`
  z-index: 5000;

  .menu-item-icon {
    font-size: 20px;
  }

  @media (max-width: 768px) {
    width: 100%;

    .styled-menu {
      justify-content: space-between;
    }
  }
`;

const StyledMenu: any = styled(Menu)`
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.12);
  background-color: #fafafa;

  .ant-menu-item {
    border-bottom: none;
  }

  .ant-menu-item:hover {
    border-bottom: none;
  }

  .ant-menu-submenu {
    border-bottom: none;
  }

  .ant-menu-submenu:hover {
    border-bottom: none;
  }

  .menu-item-title {
    font-weight: 600;
  }

  @media (max-width: 360px) {
    .styled-menu {
      background: red;
      li:nth-of-type(6) {
        & .menu-item-title {
          font-size: 4px;
        }
        padding: 0;
        background: red;
      }
    }
  }

  @media (max-width: 480px) {
    box-shadow: 0 -2px 2px rgba(0, 0, 0, 0.12);
  }
`;

const StyledAnchor = styled.a`
  color: inherit;
  cursor: pointer;
`;

const StyledLogout = styled(Exit)`
  margin-right: 10px;
`;

const StyledSpoonKnife = styled(SpoonKnife)`
  margin-right: 10px;
`;

const MenuBar: React.FunctionComponent<Props> = ({ selectedKey, type }) => {
  const customerContext = React.useContext(CustomerContext);
  const adminContext = React.useContext(AdminContext);

  let role: Role = 'Waiter';
  let icon: any = null;

  if (adminContext) {
    role = adminContext.state.user.role!;
    if (role === 'Admin') {
      icon = <Icon type="user" className="menu-item-icon" />;
    } else if (role === 'Cook') {
      icon = <StyledSpoonKnife size={14} />;
    } else if (role === 'Waiter') {
      icon = <Icon type="rest" className="menu-item-icon" />;
    }
  }

  const handleClick = async (e: any) => {
    const { key } = e;

    switch (key) {
      case 'logout':
        await StaffAPI.logout();
        Router.replace('/login');
        break;
      default:
        break;
    }
  };

  const selectedKeys: string[] = [];
  if (selectedKey.includes('/category')) {
    if (selectedKey.startsWith('/admin')) {
      selectedKeys.push('/admin');
    } else {
      selectedKeys.push('/app');
    }
  } else {
    selectedKeys.push(selectedKey);
  }

  return (
    <MenuContainer>
      {type === 'admin' ? (
        <>
          <StyledMenu
            onClick={handleClick}
            mode="horizontal"
            defaultSelectedKeys={selectedKeys}
            inlineIndent={50}
            className="styled-menu"
            overflowedIndicator={
              <Icon
                type="menu"
                style={{
                  cursor: 'pointer'
                }}
              />
            }
          >
            <Menu.Item key="/admin">
              <Link href="/admin">
                <StyledAnchor>
                  <Icon type="home" className="menu-item-icon" />
                  <span className="menu-item-title">Home</span>
                </StyledAnchor>
              </Link>
            </Menu.Item>
            {role === 'Admin' || role === 'Cook' ? (
              <Menu.Item key="/admin/orders">
                <Link href="/admin/orders">
                  <StyledAnchor>
                    <Icon type="database" className="menu-item-icon" />
                    <span className="menu-item-title">Orders</span>
                  </StyledAnchor>
                </Link>
              </Menu.Item>
            ) : null}
            {role === 'Admin' ? (
              <Menu.Item key="/admin/staff-members">
                <Link href="/admin/staff-members">
                  <StyledAnchor>
                    <Icon type="idcard" className="menu-item-icon" />
                    <span className="menu-item-title">Staff Members</span>
                  </StyledAnchor>
                </Link>
              </Menu.Item>
            ) : null}
            {role === 'Admin' || role === 'Waiter' ? (
              <Menu.Item key="/admin/tables">
                <Link href="/admin/tables">
                  <StyledAnchor>
                    <Icon type="table" className="menu-item-icon" />
                    <span className="menu-item-title">Tables</span>
                  </StyledAnchor>
                </Link>
              </Menu.Item>
            ) : null}
            <Menu.Item key="/admin/staffchat" disabled>
              <Link href="/admin/staffchat">
                <StyledAnchor>
                  <Icon type="message" className="menu-item-icon" />
                  <span className="menu-item-title">Staff chat</span>
                </StyledAnchor>
              </Link>
            </Menu.Item>
            <Menu.Item key="/admin/restaurantload" disabled>
              <Link href="/admin/restaurantload">
                <StyledAnchor>
                  <Icon type="pie-chart" className="menu-item-icon" />
                  <span className="menu-item-title">Restaurant load</span>
                </StyledAnchor>
              </Link>
            </Menu.Item>
            <Menu.SubMenu
              title={
                <span>
                  {icon}
                  <span className="menu-item-title">
                    {adminContext.state.user.name &&
                      `Hello, ${adminContext.state.user.name}!`}
                  </span>
                </span>
              }
            >
              <Menu.Item key="settings">
                <span>
                  <Icon type="setting" className="menu-item-icon" /> Settings
                </span>
              </Menu.Item>
              <Menu.Item key="logout">
                <span>
                  <StyledLogout size={14} /> Logout
                </span>
              </Menu.Item>
            </Menu.SubMenu>
          </StyledMenu>
        </>
      ) : (
        <>
          <StyledMenu
            onClick={handleClick}
            mode="horizontal"
            defaultSelectedKeys={selectedKeys}
            inlineIndent={50}
            className="styled-menu"
            overflowedIndicator={
              <Icon
                type="menu"
                style={{
                  cursor: 'pointer'
                }}
              />
            }
          >
            <Menu.Item key="/app">
              <Link href="/app">
                <StyledAnchor>
                  <Icon type="read" className="menu-item-icon" />
                  <span className="menu-item-title">Menu</span>
                </StyledAnchor>
              </Link>
            </Menu.Item>
            <Menu.Item key="/app/orders">
              <Link href="/app/orders">
                <StyledAnchor>
                  <Icon type="profile" className="menu-item-icon" />
                  <span className="menu-item-title">My Orders</span>
                </StyledAnchor>
              </Link>
            </Menu.Item>
            <Menu.Item key="/app/cart">
              <Link href="/app/cart">
                <StyledAnchor>
                  <Badge
                    offset={[12, 2]}
                    count={customerContext.totalAmount}
                    style={{
                      backgroundColor: THEME_VARIABLES['@primary-color']
                    }}
                  >
                    <Icon type="shopping-cart" className="menu-item-icon" />
                    <span className="menu-item-title">Cart</span>
                  </Badge>
                </StyledAnchor>
              </Link>
            </Menu.Item>
          </StyledMenu>
        </>
      )}
    </MenuContainer>
  );
};

export default MenuBar;
