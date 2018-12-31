import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';

interface Props {
  selectedKey: string;
}

const MenuContainer = styled.div`
  @media (max-width: 768px) {
    position: fixed;
    bottom: 0;
    width: 100%;
  }
`;

const StyledMenu = styled(Menu)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledAnchor = styled.a`
  color: inherit;
  cursor: pointer;
`;

class AdminMenuBar extends Component<Props, any> {
  private formRef: any;

  render() {
    const { selectedKey } = this.props;
    return (
      <MenuContainer>
        <StyledMenu mode="horizontal" defaultSelectedKeys={[selectedKey]}>
          <Menu.Item key="dashboard">
            <Link href="dashboard">
              <StyledAnchor>
                <Icon type="dashboard" />
              </StyledAnchor>
            </Link>
          </Menu.Item>
          <Menu.Item key="orders">
            <Link href="orders">
              <StyledAnchor>
                <Icon type="table" />
              </StyledAnchor>
            </Link>
          </Menu.Item>
          <Menu.Item key="chat">
            <Link href="staffchat">
              <StyledAnchor>
                <Icon type="message" />
              </StyledAnchor>
            </Link>
          </Menu.Item>
          <Menu.Item key="load">
            <Link href="restaurantload">
              <StyledAnchor>
                <Icon type="pie-chart" />
              </StyledAnchor>
            </Link>
          </Menu.Item>
        </StyledMenu>
      </MenuContainer>
    );
  }
}

export default AdminMenuBar;
