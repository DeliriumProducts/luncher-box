import { Skeleton, Card, Icon } from 'antd';
import React, { Component } from 'react';
import styled from 'styled-components';
import ActionButton from './ActionButton';
import PriceBadge from './PriceBadge';
import { Category } from '../interfaces';

interface Props {
  key: number;
  id: number;
  name: string;
  description?: string;
  image: string;
  price?: number;
  categories?: Category[];
}

interface State {
  loading: boolean;
  modalVisible: boolean;
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
  max-height: 72px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.12);
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
  state = {
    loading: false,
    modalVisible: false
  };

  render() {
    const { loading } = this.state;

    return (
      <StyledCard
        bordered={false}
        actions={[
          <ActionButton key="edit" type="default" icon="edit">
            Edit
          </ActionButton>,
          <ActionButton key="delete" type="default" icon="delete">
            Delete
          </ActionButton>
        ]}
      >
        <Skeleton loading={loading} avatar active>
          <StyledMeta
            avatar={<StyledImg src={this.props.image} />}
            title={
              <span>
                {this.props.name}
                <PriceBadge
                  offset={[10, 0]}
                  overflowCount={1000}
                  count={this.props.price && `${this.props.price} / piece`}
                />
              </span>
            }
            description={this.props.description}
          />
        </Skeleton>
      </StyledCard>
    );
  }
}

export default EntityCard;
