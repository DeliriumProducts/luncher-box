import { Card, Input, Button } from 'antd';
import React, { Component } from 'react';
import styled from 'styled-components';

const { Search } = Input;

interface Props {
  title: string;
  children: React.ReactNode;
}

const StyledCard = styled(Card)`
  border-radius: 7px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.12);
  background-color: rgb(245, 245, 245);
  min-width: 100%;

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
    }

    .ant-card-extra {
      display: flex;
      flex: 1;

      .ant-input {
        max-width: 300px;
        border: none;
        box-shadow: 0 4px 4px rgba(0, 0, 0, 0.12);
      }
    }
  }
`;

const ActionButton: any = styled(Button)`
  border: none;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.12);
`;

class EntityCardContainer extends Component<Props> {
  render() {
    return (
      <StyledCard
        title={this.props.title}
        extra={
          <Search placeholder="Search" onSearch={value => console.log(value)} />
        }
        bordered={false}
      >
        {this.props.children}
      </StyledCard>
    );
  }
}

export default EntityCardContainer;
