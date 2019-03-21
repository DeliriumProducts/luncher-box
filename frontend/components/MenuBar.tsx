import { Badge, Icon, Menu } from 'antd';
import Link from 'next/link';
import Router from 'next/router';
import React, { Component } from 'react';
import styled from 'styled-components';
import { Exit } from 'styled-icons/icomoon/Exit';
import { AuthAPI } from '../api';
import { THEME_VARIABLES } from '../config';
import { CustomerContext } from '../context';

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

const StyledMenu = styled(Menu)`
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.12);

  @media (max-width: 768px) {
    box-shadow: 0 -2px 2px rgba(0, 0, 0, 0.12);
  }

  background-color: #fafafa;
`;

const StyledAnchor = styled.a`
  color: inherit;
  cursor: pointer;
`;

const StyledLogout = styled(Exit)`
  margin-right: 10px;
`;

class MenuBar extends Component<Props> {
  static contextType = CustomerContext;
  context!: React.ContextType<typeof CustomerContext>;

  handleClick = async (e: any) => {
    const { key } = e;

    switch (key) {
      case 'logout':
        await AuthAPI.logout();
        Router.replace('/login');
        break;
      default:
        break;
    }
  };

  render() {
    const { selectedKey, type } = this.props;

    const selectedKeys = [];
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
              onClick={this.handleClick}
              mode="horizontal"
              defaultSelectedKeys={selectedKeys}
              inlineIndent={50}
              className="styled-menu"
            >
              <Menu.Item key="/admin">
                <Link href="/admin">
                  <StyledAnchor>
                    <Icon type="home" className="menu-item-icon" />
                    <span className="menu-item-title">Home</span>
                  </StyledAnchor>
                </Link>
              </Menu.Item>
              <Menu.Item key="/admin/orders">
                <Link href="/admin/orders">
                  <StyledAnchor>
                    <Icon type="table" className="menu-item-icon" />
                    <span className="menu-item-title">Orders</span>
                  </StyledAnchor>
                </Link>
              </Menu.Item>
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
                    <Icon type="user" className="menu-item-icon" />
                    <span className="menu-item-title">My profile</span>
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
              onClick={this.handleClick}
              mode="horizontal"
              defaultSelectedKeys={selectedKeys}
              inlineIndent={50}
              className="styled-menu"
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
                      offset={[10, 0]}
                      count={this.context.totalAmount}
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
  }
}

export default MenuBar;
