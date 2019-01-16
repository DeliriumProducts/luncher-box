import { Card, Icon, Popconfirm, message } from 'antd';
import React, { Component } from 'react';
import styled from 'styled-components';
import ActionButton from './ActionButton';
import PriceBadge from './PriceBadge';
import { Category, Product } from '../interfaces';
import { EntityTypes, ActionTypes, EntityInstance } from '../types';
import { CategoryAPI, ProductAPI } from '../api';
import { AdminContext } from '../context';
import Router from 'next/router';
import EntityModal from './EntityModal';

const { Meta } = Card;

const StyledCard = styled(Card)`
  border-radius: 10px;
  margin-top: 8px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.12);
  max-width: 100%;

  @media (max-width: 480px) {
    border-radius: 0;
    border-bottom: 1px solid;
    border-color: rgb(210, 210, 210);
    box-shadow: none;
    margin: 0;
    width: 100%;
  }

  .ant-card-actions {
    background-color: #fff;
    border-top-color: rgb(210, 210, 210);
    border-radius: 0 0 7px 7px;
  }
`;

const StyledImg = styled.img`
  border-radius: 7px;
  width: 88px;
  height: 88px;
  object-fit: cover;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.12);

  @media (max-width: 480px) {
    margin-left: 10px;
  }

  @media (max-width: 250px) {
    display: none;
  }
`;

const StyledMeta = styled(Meta)`
  display: flex;
  align-items: center;

  & * {
    font-size: 15px;
    white-space: initial;
    word-wrap: break-word;
  }
`;

interface Props {
  key: number;
  id: number;
  name: string;
  description?: string;
  image: string;
  price?: number;
  categories?: Category[];
  entityType: EntityTypes;
  hoverable?: boolean;
}

interface State {
  modalVisible: boolean;
  loading: boolean;
  popConfirmVisible: boolean;
  entity?: EntityInstance;
}

class EntityCard extends Component<Props, State> {
  static contextType = AdminContext;
  context!: React.ContextType<typeof AdminContext>;

  state = {
    modalVisible: false,
    loading: false,
    popConfirmVisible: false,
    entity: undefined
  };

  formRef: any;

  showModal = (entity: EntityInstance) => {
    this.setState({
      modalVisible: true,
      entity
    });
  };

  handleCancel = (e: React.FormEvent<HTMLElement>) => {
    e.stopPropagation();

    this.setState({
      modalVisible: false
    });
  };

  handleCreate = (e: React.FormEvent<HTMLElement>) => {
    e.stopPropagation();

    const form = this.formRef.props.form;

    form.validateFields(async (err: any, values: any) => {
      if (err) {
        return;
      }

      this.setState({ loading: true });

      try {
        switch (this.props.entityType) {
          case 'category':
            let category: Category = values;

            category.id = this.props.id;
            category = (await CategoryAPI.edit(category)).data;
            this.context.actions.edit(category, 'category');
            message.success(`Successfully edited category ${category.name} 🎉`);
            break;
          case 'product':
            let product: Product = values;

            product.id = this.props.id;
            product = (await ProductAPI.edit(product)).data;
            this.context.actions.edit(product, 'product');
            message.success(`Successfully edited product ${product.name} 🎉`);
            break;
          default:
            break;
        }
      } catch (err) {
        this.setState({ loading: false });
        message.error(`${err}`);
      }

      form.resetFields();
      this.setState({ modalVisible: false, loading: false });
    });
  };

  saveFormRef = (formRef: any) => {
    this.formRef = formRef;
  };

  handleEditClick = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const { entityType, id, name, image } = this.props;

    /**
     * Define an entity based on the entityType var which will be passed to the modal
     * when action button is clicked
     */
    let entity: EntityInstance;

    if (entityType === 'product') {
      /**
       * Get all categories from a product
       */
      entity = await ProductAPI.getOne(id);
    } else {
      entity = {
        id,
        name,
        image
      };
    }

    this.showModal(entity);
  };

  handleDeleteClick = async () => {
    const { entityType } = this.props;
    if (entityType) {
      await this.context.actions.delete(this.props.id, entityType);
      if (entityType === 'category') {
        await CategoryAPI.delete(this.props.id);
      } else {
        await ProductAPI.delete(this.props.id);
      }

      message.success(
        `Successfully deleted ${entityType} ${this.props.name} 🎉`
      );
    }
  };

  handleCardClick = () => {
    const { entityType, id } = this.props;
    if (entityType === 'category') {
      Router.push(
        {
          pathname: '/admin/category',
          query: { categoryId: id }
        },
        {
          pathname: `/admin/category/${id}`
        }
      );
    } else {
      return;
    }
  };

  render() {
    const { entityType, hoverable } = this.props;
    return (
      <StyledCard
        bordered={false}
        hoverable={hoverable}
        onClick={this.handleCardClick}
        actions={[
          <ActionButton
            key="edit"
            type="default"
            icon="edit"
            onClick={this.handleEditClick}
          >
            Edit
          </ActionButton>,
          <Popconfirm
            title={`Are you sure you want to delete this ${entityType}?`}
            onConfirm={this.handleDeleteClick}
            icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
            okText="Yes"
            cancelText="No"
          >
            <ActionButton key="delete" type="default" icon="delete">
              Delete
            </ActionButton>
          </Popconfirm>
        ]}
      >
        <StyledMeta
          avatar={<StyledImg src={this.props.image} />}
          title={
            <span>
              {this.props.name}
              <PriceBadge
                overflowCount={1000}
                count={this.props.price && `${this.props.price} / piece`}
                style={{ marginLeft: '10px', zIndex: 0 }}
              />
            </span>
          }
          description={this.props.description}
        />
        <EntityModal
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.modalVisible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          entityType={this.props.entityType}
          actionType={'edit'}
          entity={this.state.entity}
          loading={this.state.loading}
        />
      </StyledCard>
    );
  }
}

export default EntityCard;
