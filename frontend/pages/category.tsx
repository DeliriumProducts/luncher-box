import { Empty, message } from 'antd';
import Router, { DefaultQuery } from 'next/router';
import { Component } from 'react';
import styled from 'styled-components';
import { CategoryAPI } from '../api';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import withRouter from '../components/withRouter';
import { Product } from '../interfaces';
import Head from 'next/head';

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  background-color: #fafafa;
  padding: 2rem;
  border-radius: 7px;
  box-shadow: 0 20px 24px -18px rgba(0, 0, 0, 0.31);
`;

interface CategoryQuery extends DefaultQuery {
  categoryId: string;
}

interface Props {
  query: CategoryQuery;
}

interface State {
  products: Product[];
  loading: boolean;
  categoryName: string;
}

class CategoryPage extends Component<Props, State> {
  state: State = {
    products: [],
    loading: true,
    categoryName: ''
  };

  async componentDidMount() {
    try {
      const { products, name: categoryName } = await CategoryAPI.getOne(
        Number(this.props.query.categoryId)
      );

      if (products) {
        this.setState({ products });
      }

      if (categoryName) {
        this.setState({ categoryName });
      }
    } catch (err) {
      message.error(`${err}, Redirecting you to the menu...`, 3, () =>
        Router.replace('/')
      );
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    let data: React.ReactNode[] | React.ReactNode;
    /**
     * Check whether data is still being fetched
     */
    if (this.state.loading) {
      data = <Spinner />;
    } else {
      if (this.state.products.length) {
        data = this.state.products.map(product => (
          <ProductCard key={product.id} {...product} />
        ));
      } else {
        data = <Empty description="No entries found" />;
      }
    }

    return (
      <>
        <Head>
          <title>
            {this.state.categoryName === ''
              ? 'Category'
              : this.state.categoryName}{' '}
            | LuncherBox
          </title>
        </Head>
        <FlexContainer>{data}</FlexContainer>
      </>
    );
  }
}

export default withRouter(CategoryPage);
