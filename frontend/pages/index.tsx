import { Empty, message } from 'antd';
import Head from 'next/head';
import { Component } from 'react';
import styled from 'styled-components';
import { CategoryAPI } from '../api';
import CategoryCard from '../components/CategoryCard';
import Spinner from '../components/Spinner';
import { AdminContext } from '../context/AdminContext';
import { Category } from '../interfaces';

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  background-color: #fafafa;
  padding: 2rem;
  border-radius: 7px;

  @media (max-width: 480px) {
    border-radius: 0;
  }

  box-shadow: 0 20px 24px -18px rgba(0, 0, 0, 0.31);
`;

interface State {
  categories: Category[];
  loading: boolean;
}

class Home extends Component<any, State> {
  static contextType = AdminContext;
  context!: React.ContextType<typeof AdminContext>;

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
          <CategoryCard key={category.id} {...category} />
        ));
      } else {
        data = <Empty description="No entries found" />;
      }
    }

    return (
      <>
        <Head>
          <title>Menu | LuncherBox</title>
        </Head>
        <FlexContainer>{data}</FlexContainer>
      </>
    );
  }
}

export default Home;
