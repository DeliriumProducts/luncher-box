import { Icon, Menu } from 'antd';
import Link from 'next/link';
import React, { Component } from 'react';
import styled from 'styled-components';

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
      content: '';
    }
    .menu-item-icon {
      font-size: 25px;
    }
    .styled-menu {
      justify-content: space-between;
    }
  }
`;

const StyledMenu = styled(Menu)`
  z-index: 5000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledAnchor = styled.a`
  color: inherit;
  cursor: pointer;
`;

class UserMenuBar extends Component<Props, any> {
  render() {
    const { selectedKey } = this.props;
    return (
      <MenuContainer>
        <StyledMenu
          mode="horizontal"
          defaultSelectedKeys={[selectedKey]}
          inlineIndent={50}
          className="styled-menu"
        >
          <Menu.Item key="daily">
            <Link href="/">
              <StyledAnchor>
                <Icon type="calendar" className="menu-item-icon" />
                <span className="menu-item-title">Daily</span>
              </StyledAnchor>
            </Link>
          </Menu.Item>
          <Menu.Item key="menu">
            <Link href="menu">
              <StyledAnchor>
                <Icon type="read" className="menu-item-icon" />
                <span className="menu-item-title">Menu</span>
              </StyledAnchor>
            </Link>
          </Menu.Item>
          <Menu.Item key="cart">
            <Link href="cart">
              <StyledAnchor>
                <Icon type="shopping-cart" className="menu-item-icon" />
                <span className="menu-item-title">Cart</span>
              </StyledAnchor>
            </Link>
          </Menu.Item>
        </StyledMenu>
      </MenuContainer>
    );
  }
}

export default UserMenuBar;
