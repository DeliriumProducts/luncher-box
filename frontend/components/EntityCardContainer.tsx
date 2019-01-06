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

interface ChildProps {
  key: number;
  id: number;
  name: string;
  description?: string;
  image: string;
  price?: number;
  categories?: Category[];
  showModal?: (
    entityType: EntityTypes,
    actionType: ActionTypes,
    entity?: EntityInstance
  ) => void;
  entityType?: EntityTypes;
}

interface State {
  modalVisible: boolean;
  loading: boolean;
  entity?: EntityInstance;
  entityType: EntityTypes;
  actionType: ActionTypes;
  searchText: string;
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

  .ant-card-head-wrapper {
    flex-wrap: wrap;
    overflow-x: auto;
  }

  .ant-card-head {
    border: none;

    .ant-card-head-title {
      display: flex;
      flex: 1;
      text-overflow: initial;
      overflow-x: auto;
      font-size: 18px;

      @media (max-width: 380px) {
        font-size: 16px;
      }
    }

    .ant-card-extra {
      display: flex;
      flex: 1;

      #search-input {
        min-width: 100px;
        max-width: 300px;
        border: none;
        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.12);
      }

      #new-button {
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
    actionType: 'create',
    searchText: ''
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
      this.setState({ modalVisible: true, entityType });
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

    /**
     * We will need the entity from state when actionType == 'edit'
     * so we destructure it now then we have to check
     * for undefined because entity is undefined on actionType == 'create'
     */
    const { entity } = this.state;
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
            this.context.actions.pushEntity(category, 'category');
          } else {
            /**
             * Firstly we check for entity because undefined is possible
             * then inject the id of the entity manually since
             * our modal does not return it when actionType == 'edit'
             */
            if (entity) {
              category.id = entity.id;
              category = (await CategoryAPI.edit(category)).data;
              this.context.actions.editEntity(category, 'category');
            }
          }
          break;
        case 'product':
          let product: Product = values;

          if (this.state.actionType === 'create') {
            product = (await ProductAPI.create(product)).data;
            this.context.actions.pushEntity(product, 'product');
          } else {
            /**
             * Firstly we check for entity because unfenied is possible
             * then inject the id of the entity manually since
             * our modal dos not return it when actionType == 'edit'
             */
            if (entity) {
              product.id = entity.id;
              product = (await ProductAPI.edit(product)).data;
              this.context.actions.editEntity(product, 'product');
            }
          }
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

  handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ searchText: e.currentTarget.value });
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
            onChange={this.handleChange}
            id="search-input"
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
        {React.Children.map(this.props.children, (child: any) => {
          if (
            child.props.name
              .toLowerCase()
              .includes(this.state.searchText.toLowerCase())
          ) {
            return React.cloneElement(child as React.ReactElement<any>, {
              showModal: this.showModal,
              entityType: this.props.entityType
            });
          }
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
