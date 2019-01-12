import { Icon, Menu } from 'antd';
import Link from 'next/link';
import Router from 'next/router';
import React, { Component } from 'react';
import styled from 'styled-components';
import { Exit } from 'styled-icons/icomoon/Exit';
import { AuthAPI, CategoryAPI, ProductAPI } from '../api';
import { AdminContext } from '../context';
import { Category, Product } from '../interfaces';
import { EntityTypes } from '../types';
import EntityModal from './EntityModal';

interface Props {
  selectedKey: string;
}

const MenuContainer = styled.div`
  z-index: 5000;
  @media (max-width: 768px) {
    position: fixed;
    bottom: 0;
    width: 100%;

    .menu-item-title {
      display: none;
    }

    .menu-item-icon {
      font-size: 25px;
      margin-right: 0;
    }

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
`;

const StyledAnchor = styled.a`
  color: inherit;
  cursor: pointer;
`;

const StyledLogout = styled(Exit)`
  margin-right: 10px;
`;
interface State {
  modalVisible: boolean;
  modalType: EntityTypes;
  loading: boolean;
}

class AdminMenuBar extends Component<Props, State> {
  static contextType = AdminContext;
  context!: React.ContextType<typeof AdminContext>;

  state: State = {
    modalVisible: false,
    modalType: 'product',
    loading: false
  };

  handleClick = async (e: any) => {
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

  render() {
    const { selectedKey } = this.props;

    return (
      <MenuContainer>
        <StyledMenu
          onClick={this.handleClick}
          mode="horizontal"
          defaultSelectedKeys={[selectedKey]}
          inlineIndent={50}
          className="styled-menu"
        >
          <Menu.Item key="home">
            <Link href="/admin" prefetch>
              <StyledAnchor>
                <Icon type="home" className="menu-item-icon" />
                <span className="menu-item-title">Home</span>
              </StyledAnchor>
            </Link>
          </Menu.Item>
          <Menu.Item key="orders">
            <Link href="/admin/orders" prefetch>
              <StyledAnchor>
                <Icon type="table" className="menu-item-icon" />
                <span className="menu-item-title">Orders</span>
              </StyledAnchor>
            </Link>
          </Menu.Item>
          <Menu.Item key="chat" disabled>
            <Link href="/admin/staffchat" prefetch>
              <StyledAnchor>
                <Icon type="message" className="menu-item-icon" />
                <span className="menu-item-title">Staff chat</span>
              </StyledAnchor>
            </Link>
          </Menu.Item>
          <Menu.Item key="load" disabled>
            <Link href="/admin/restaurantload" prefetch>
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
      </MenuContainer>
    );
  }
}

export default AdminMenuBar;
