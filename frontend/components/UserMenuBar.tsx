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
          <Menu.Item key="home">
            <Link href="/" prefetch>
              <StyledAnchor>
                <Icon type="read" className="menu-item-icon" />
                <span className="menu-item-title">Menu</span>
              </StyledAnchor>
            </Link>
          </Menu.Item>
          <Menu.Item key="cart">
            <Link href="cart" prefetch>
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
