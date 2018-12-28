import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import Link from 'next/link';
import Router from 'next/router';
import styled from 'styled-components';
import { Exit } from 'styled-icons/icomoon/Exit';
import { AuthAPI } from '../api';
import { UserContext } from '../context';
import EntityModal from './EntityModal';

interface Props {
  selectedKey: string;
}

interface State {
  modalVisible: boolean;
}

const StyledMenu = styled(Menu)`
  display: flex;
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

class MenuBar extends Component<Props, State> {
  static contextType = UserContext;

  state = {
    modalVisible: false
  };

  private formRef: any;

  showModal = () => {
    this.setState({ modalVisible: true });
  };
  handleCancel = () => {
    this.setState({ modalVisible: false });
  };

  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err: any, values: any) => {
      if (err) {
        return;
      }

      const { name, description, image, price, categories } = values;
      const categoriesId = categories.map((id: number) => ({ id }));
      const product = { name, description, image, price, categoriesId };
      console.log(product);
      form.resetFields();
      this.setState({ modalVisible: false });
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
        this.showModal();
        break;
      default:
        break;
    }
  };

  render() {
    const { selectedKey } = this.props;
    return (
      <div>
        <StyledMenu
          onClick={this.handleClick}
          mode="horizontal"
          defaultSelectedKeys={[selectedKey]}
        >
          <Menu.Item key="dashboard">
            <Link href="dashboard">
              <StyledAnchor>
                <Icon type="dashboard" />
                Dashboard
              </StyledAnchor>
            </Link>
          </Menu.Item>
          <Menu.Item key="orders">
            <Link href="orders">
              <StyledAnchor>
                <Icon type="table" />
                Orders
              </StyledAnchor>
            </Link>
          </Menu.Item>
          <Menu.Item key="chat">
            <Link href="staffchat">
              <StyledAnchor>
                <Icon type="message" />
                Staff chat
              </StyledAnchor>
            </Link>
          </Menu.Item>
          <Menu.Item key="load">
            <Link href="restaurantload">
              <StyledAnchor>
                <Icon type="pie-chart" />
                Restaurant load
              </StyledAnchor>
            </Link>
          </Menu.Item>
          <Menu.SubMenu
            title={
              <span>
                <Icon type="plus" />
                New
              </span>
            }
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
                My profile
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
        />
      </div>
    );
  }
}

export default MenuBar;
