import { Card, Input } from 'antd';
import React, { Component } from 'react';
import styled from 'styled-components';
import ActionButton from './ActionButton';
import { EntityTypes, ActionTypes, EntityInstance } from '../types';
import { Category, Product } from '../interfaces';
import { ProductAPI, CategoryAPI } from '../api';
import EntityModal from './EntityModal';
import { EntityContext } from '../context';

const { Search } = Input;

interface Props {
  title: string;
  entityType: EntityTypes;
  children: React.ReactNode[];
}

interface State {
  modalVisible: boolean;
  loading: boolean;
  entity?: EntityInstance;
  entityType: EntityTypes;
  actionType: ActionTypes;
}

const StyledCard = styled(Card)`
  border-radius: 7px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.12);
  background-color: rgb(245, 245, 245);
  max-width: 100%;
  @media (max-width: 480px) {
    .ant-card-body {
      padding-left: 0px;
      padding-right: 0px;
    }
  }

  .ant-card-head {
    border: none;

    .ant-card-head-title {
      flex: 1;
      font-size: 18px;
    }

    .ant-card-extra {
      display: flex;
      flex: 1;

      .ant-input {
        max-width: 300px;
        border: none;
        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.12);
      }
      & > #new-button {
        margin-left: 10px;
      }
    }
  }
`;

class EntityCardContainer extends Component<Props, State> {
  static contextType = EntityContext;

  state: State = {
    modalVisible: false,
    loading: false,
    entity: undefined,
    entityType: 'product',
    actionType: 'create'
  };
  formRef: any;

  showModal = async (
    entityType: EntityTypes,
    actionType: 'create' | 'edit',
    entity?: EntityInstance
  ) => {
    if (entity) {
      this.setState({
        modalVisible: true,
        entityType,
        actionType,
        entity
      });
    } else {
      this.setState({ modalVisible: true, actionType });
    }

    /**
     * Update context every time the modal is shown
     */
    await this.context.actions.updateEntities();
  };
  handleCancel = () => {
    this.setState({
      modalVisible: false
    });
  };

  handleCreate = () => {
    const form = this.formRef.props.form;

    form.validateFields(async (err: any, values: any) => {
      if (err) {
        return;
      }

      this.setState({ loading: true });

      switch (this.state.entityType) {
        case 'category':
          let category: Category = values;

          if (this.state.actionType === 'create') {
            category = (await CategoryAPI.create(category)).data;
          } else {
            category = (await CategoryAPI.edit(category)).data;
          }
          this.context.actions.pushEntity(category, 'category');
          break;
        case 'product':
          let product: Product = values;

          if (this.state.actionType === 'create') {
            product = (await ProductAPI.create(product)).data;
          } else {
            product = (await ProductAPI.edit(product)).data;
          }
          this.context.actions.pushEntity(product, 'product');
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

  render() {
    return (
      <StyledCard
        title={this.props.title}
        extra={[
          <Search
            key="search"
            placeholder="Search"
            onSearch={value => console.log(value)}
          />,
          <ActionButton
            key="new"
            type="default"
            id="new-button"
            icon="plus"
            onClick={async () =>
              await this.showModal(this.props.entityType, 'create')
            }
          >
            New
          </ActionButton>
        ]}
        bordered={false}
      >
        {/**
          We have to inject the showModal func and entity's type to children's props
         */}

        {this.props.children.map(child => {
          return React.cloneElement(child as React.ReactElement<any>, {
            showModal: this.showModal,
            entityType: this.props.entityType
          });
        })}

        <EntityModal
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.modalVisible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          entityType={this.state.entityType}
          actionType={this.state.actionType}
          entity={this.state.entity}
          loading={this.state.loading}
        />
      </StyledCard>
    );
  }
}

export default EntityCardContainer;
