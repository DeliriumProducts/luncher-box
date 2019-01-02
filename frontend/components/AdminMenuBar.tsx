import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import Link from 'next/link';
import Router from 'next/router';
import styled from 'styled-components';
import { Exit } from 'styled-icons/icomoon/Exit';
import { AuthAPI, CategoryAPI, ProductAPI } from '../api';
import { UserContext } from '../context';
import { EntityTypes } from '../types';
import { Product, Category } from '../interfaces';
import EntityModal from './EntityModal';

interface Props {
  selectedKey: string;
}

const MenuContainer = styled.div`
  @media (max-width: 768px) {
    position: fixed;
    bottom: 0;
    width: 100%;

    .menu-item-title {
      display: none;
    }
  }
`;

const StyledMenu = styled(Menu)`
  display: flex;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.12);

  .right {
    margin-left: auto;
  }
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
  static contextType = UserContext;

  state: State = {
    modalVisible: false,
    modalType: 'product',
    loading: false
  };

  private formRef: any;

  showModal = (type: EntityTypes) => {
    this.setState({ modalVisible: true, modalType: type });
  };

  handleCancel = () => {
    this.setState({ modalVisible: false });
  };

  handleCreate = () => {
    const form = this.formRef.props.form;

    form.validateFields(async (err: any, values: any) => {
      if (err) {
        return;
      }

      this.setState({ loading: true });

      switch (this.state.modalType) {
        case 'category':
          let category: Category = values;
          category = (await CategoryAPI.create(category)).data;
          this.context.actions.addCategory(category);
          break;
        case 'product':
          const product: Product = values;
          await ProductAPI.create(product);
          break;
        default:
          break;
      }

      form.resetFields();
      this.setState({ modalVisible: false, loading: false });
    });
  };

  saveFormRef = (formRef: any) => {
    this.formRef = formRef;
  };

  handleClick = async (e: any) => {
    const { key } = e;

    switch (key) {
      case 'logout':
        await AuthAPI.logout();
        Router.push('/login');
        break;
      case 'product':
        this.showModal('product');
        break;
      case 'category':
        this.showModal('category');
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
        >
          <Menu.Item key="home">
            <Link href="/admin" prefetch>
              <StyledAnchor>
                <Icon type="home" />
                <span className="menu-item-title">Home</span>
              </StyledAnchor>
            </Link>
          </Menu.Item>
          <Menu.Item key="orders">
            <Link href="/admin/orders" prefetch>
              <StyledAnchor>
                <Icon type="table" />
                <span className="menu-item-title">Orders</span>
              </StyledAnchor>
            </Link>
          </Menu.Item>
          <Menu.Item key="chat">
            <Link href="/admin/staffchat" prefetch>
              <StyledAnchor>
                <Icon type="message" />

                <span className="menu-item-title">Staff chat</span>
              </StyledAnchor>
            </Link>
          </Menu.Item>
          <Menu.Item key="load">
            <Link href="/admin/restaurantload" prefetch>
              <StyledAnchor>
                <Icon type="pie-chart" />
                <span className="menu-item-title">Restaurant load</span>
              </StyledAnchor>
            </Link>
          </Menu.Item>
          <Menu.SubMenu
            title={
              <span>
                <Icon type="plus" />
                <span className="menu-item-title">New</span>
              </span>
            }
            selectable={false}
          >
            <Menu.Item key="product">
              <StyledAnchor>
                <Icon type="file-text" />
                Product
              </StyledAnchor>
            </Menu.Item>

            <Menu.Item key="category">
              <StyledAnchor>
                <Icon type="folder-open" />
                Category
              </StyledAnchor>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu
            title={
              <span>
                <Icon type="user" />
                <span className="menu-item-title">My profile</span>
              </span>
            }
            className="right"
          >
            <Menu.Item key="settings">
              <span>
                <Icon type="setting" /> Settings
              </span>
            </Menu.Item>
            <Menu.Item key="logout">
              <span>
                <StyledLogout size={14} /> Logout
              </span>
            </Menu.Item>
          </Menu.SubMenu>
        </StyledMenu>
        <EntityModal
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.modalVisible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          type={this.state.modalType}
          loading={this.state.loading}
        />
      </MenuContainer>
    );
  }
}

export default AdminMenuBar;
