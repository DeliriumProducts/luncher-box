import { Card, Icon, Popconfirm, message } from 'antd';
import React, { Component } from 'react';
import styled from 'styled-components';
import ActionButton from './ActionButton';
import PriceBadge from './PriceBadge';
import { Category, Product } from '../interfaces';
import { EntityTypes, ActionTypes, EntityInstance } from '../types';
import { CategoryAPI, ProductAPI } from '../api';
import { AdminContext } from '../context';

interface Props {
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
  hoverable?: boolean;
}

interface State {
  loading: boolean;
  popConfirmVisible: boolean;
}

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

class EntityCard extends Component<Props, State> {
  static contextType = AdminContext;
  context!: React.ContextType<typeof AdminContext>;

  state = {
    loading: false,
    popConfirmVisible: false
  };

  handleEditClick = async (entity: EntityInstance) => {
    const { showModal, entityType } = this.props;
    if (entityType === 'product') {
      /**
       * Get all categories from a product
       */
      entity = await ProductAPI.getOne(entity.id);
    }

    if (showModal && entityType) {
      showModal(entityType, 'edit', entity);
    }
  };

  render() {
    const { entityType, hoverable } = this.props;

    /**
     * Define an entity based on the entityType var which will be passed to the modal
     * when action button is clicked
     */
    const entity: EntityInstance =
      entityType === 'product'
        ? ({
            id: this.props.id,
            name: this.props.name,
            description: this.props.description,
            image: this.props.image,
            price: this.props.price,
            categories: this.props.categories
          } as Product)
        : ({
            id: this.props.id,
            name: this.props.name,
            image: this.props.image
          } as Category);

    return (
      <StyledCard
        bordered={false}
        hoverable={hoverable}
        actions={[
          <ActionButton
            key="edit"
            type="default"
            icon="edit"
            onClick={() => this.handleEditClick(entity)}
          >
            Edit
          </ActionButton>,
          <Popconfirm
            title={`Are you sure you want to delete this ${entityType}?`}
            onConfirm={async () => {
              if (entityType) {
                await this.context.actions.delete(entity, entityType);
                if (entityType === 'category') {
                  await CategoryAPI.delete(entity.id);
                } else {
                  await ProductAPI.delete(entity.id);
                }

                message.success(
                  `Successfully deleted ${entityType} ${entity.name} 🎉`
                );
              }
            }}
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
      </StyledCard>
    );
  }
}

export default EntityCard;
