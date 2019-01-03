import { Skeleton, Card, Icon, Avatar } from 'antd';
import React, { Component } from 'react';
import styled from 'styled-components';

interface Props {
  id: number;
  name: string;
  description?: string;
  image: string;
  price?: number;
}

interface State {
  loading: boolean;
}

const { Meta } = Card;

const StyledCard = styled(Card)`
  border-radius: 7px;
  margin-top: 8px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.12);
  max-width: 100%;

  @media (max-width: 768px) {
    border-radius: 0;
    border-bottom: 1px solid;
    border-bottom-color: rgb(210, 210, 210);
    box-shadow: none;
    margin: 0;
    width: 100%;

    .ant-layout-content {
      background-color: green;
    }
  }
`;

const StyledImg = styled.img`
  border-radius: 7px;
  max-height: 64px;

  @media (max-width: 250px) {
    display: none;
  }
`;

const StyledMeta = styled(Meta)`
  display: flex;
  align-items: center;

  & * {
    white-space: initial;
    word-wrap: break-word;
  }
`;

export default class EntityCard extends Component<Props, State> {
  state = {
    loading: true
  };

  render() {
    const { loading } = this.state;
    return (
      <StyledCard bordered={false}>
        <Skeleton loading={false} avatar active>
          <StyledMeta
            avatar={<StyledImg src={this.props.image} />}
            title={this.props.name}
            description={this.props.description}
          />
        </Skeleton>
      </StyledCard>
    );
  }
}
