import { Card, Input } from 'antd';
import React, { Component } from 'react';
import styled from 'styled-components';

const { Search } = Input;

interface Props {
  title: string;
  children: React.ReactNode;
}

const StyledCard = styled(Card)`
  overflow-y: auto;
  overflow-x: auto;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  border-radius: 7px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.12);
  background-color: rgb(245, 245, 245);

  @media (max-width: 480px) {
    .ant-card-body {
      padding-left: 0px;
      padding-right: 0px;
    }
  }

  .ant-card-head {
    font-size: 20px;
    border: none;
  }
`;

class EntityCardContainer extends Component<Props> {
  render() {
    return (
      <StyledCard
        title={this.props.title}
        extra={
          <Search
            placeholder="input search text"
            onSearch={value => console.log(value)}
            style={{ width: 200 }}
          />
        }
        bordered={false}
      >
        {this.props.children}
      </StyledCard>
    );
  }
}

export default EntityCardContainer;
