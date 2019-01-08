import { Component, ContextType } from 'react';
import CategoryCard from '../components/CategoryCard';
import UserLayout from '../components/UserLayout';
import { EntityContext } from '../context/EntityContext';
import styled from 'styled-components';
import { Spin, Icon, message } from 'antd';
import { Category } from '../interfaces';
import { CategoryAPI } from '../api';
import Router from 'next/router';
import Spinner from '../components/Spinner';

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

interface State {
  categories: Category[];
  loading: boolean;
}

class Home extends Component<any, State> {
  static contextType = EntityContext;
  context!: React.ContextType<typeof EntityContext>;

  state: State = {
    categories: [],
    loading: true
  };

  async componentDidMount() {
    try {
      const categories = await CategoryAPI.getAll();

      if (categories) {
        this.setState({ categories });
      }
    } catch (err) {
      message.error(`${err}`, 3);
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    let data: React.ReactNode[] | React.ReactNode;
    /**
     * Check whether data is still being fetched
     * then inject the showModal func and entity's type to children's props
     */
    if (this.state.loading) {
      data = <Spinner />;
    } else {
      if (this.state.categories.length) {
        data = this.state.categories.map(category => (
          <CategoryCard
            key={category.id}
            id={category.id}
            name={category.name}
            image={category.image}
          />
        ));
      } else {
        data = <div>No categories found!</div>;
      }
    }

    return (
      <UserLayout selectedKey="home">
        <FlexContainer>{data}</FlexContainer>
      </UserLayout>
    );
  }
}

export default Home;
