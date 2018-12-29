import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import Link from 'next/link';
import Router from 'next/router';
import styled from 'styled-components';
import { Exit } from 'styled-icons/icomoon/Exit';
import { AuthAPI, CategoryAPI, ProductAPI } from '../api';
import { UserContext } from '../context';
import { EntityTypes, Product, Category } from '../types';
import EntityModal from './EntityModal';

interface Props {
  selectedKey: string;
}

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
      <div>
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
      </div>
    );
  }
}

export default AdminMenuBar;
