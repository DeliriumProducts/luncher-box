import { Empty, message } from 'antd';
import Router, { DefaultQuery } from 'next/router';
import { Component } from 'react';
import styled from 'styled-components';
import { CategoryAPI } from '../api';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import UserLayout from '../components/AdminLayout';
import withRouter from '../components/withRouter';
import { Product } from '../interfaces';

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
}

class CategoryPage extends Component<Props, State> {
  state: State = {
    products: [],
    loading: true
  };

  async componentDidMount() {
    try {
      const products = (await CategoryAPI.getOne(
        Number(this.props.query.categoryId)
      )).products;

      if (products) {
        this.setState({ products });
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

    return <FlexContainer>{data}</FlexContainer>;
  }
}

export default withRouter(CategoryPage);
