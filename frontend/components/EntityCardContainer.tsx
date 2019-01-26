import { Card, Empty, Input } from 'antd';
import React, { Component } from 'react';
import styled from 'styled-components';
import ActionButton from './ActionButton';
import { EntityTypes, EntityInstance } from '../types';
import { AdminContext } from '../context';
import Spinner from './Spinner';

const { Search } = Input;

const StyledCard = styled(Card)`
  border-radius: 7px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.12);
  background-color: rgb(245, 245, 245);

  @media (max-width: 480px) {
    & .ant-card-body {
      padding-left: 0px;
      padding-right: 0px;
    }
  }

  .ant-card-head-wrapper {
    flex-wrap: wrap;
  }

  .ant-card-head {
    border: none;

    .ant-card-head-title {
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
        border: none;
        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.12);
      }

      #new-button {
        margin-left: 10px;
      }
    }
  }
`;

interface Props {
  title: string;
  entityType: EntityTypes;
  children: React.ReactNode[];
  loading: boolean;
  handleNewClick: (entityType: EntityTypes) => void;
}

interface State {
  modalVisible: boolean;
  loading: boolean;
  entity?: EntityInstance;
  searchText: string;
}

class EntityCardContainer extends Component<Props, State> {
  static contextType = AdminContext;
  context!: React.ContextType<typeof AdminContext>;

  state: State = {
    modalVisible: false,
    loading: false,
    entity: undefined,
    searchText: ''
  };

  handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ searchText: e.currentTarget.value });
  };

  render() {
    const { children, title, handleNewClick, loading, entityType } = this.props;

    let data: React.ReactNode[] | React.ReactNode;

    /**
     * Check whether data is still being fetched (show loading spinner)
     * then inject the showModal func and entity's type to children's props
     */
    if (loading) {
      data = <Spinner />;
    } else {
      if (children.length) {
        data = React.Children.map(children, (child: any) => {
          if (
            child.props.name
              .toLowerCase()
              .includes(this.state.searchText.toLowerCase())
          ) {
            return child;
          } else {
            return;
          }
        });
      } else {
        data = <Empty description="No entries found" />;
      }
    }

    return (
      <StyledCard
        title={title}
        extra={[
          <Search
            key="search"
            placeholder="Search"
            onChange={this.handleChange}
            id="search-input"
          />,
          <ActionButton
            key="new"
            type="primary"
            id="new-button"
            icon="plus"
            onClick={() => handleNewClick(entityType)}
          >
            New
          </ActionButton>
        ]}
        bordered={false}
      >
        {data}
      </StyledCard>
    );
  }
}

export default EntityCardContainer;
