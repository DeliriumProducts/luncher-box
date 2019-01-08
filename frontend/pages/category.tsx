import { Component, ContextType } from 'react';
import UserLayout from '../components/UserLayout';
import ProductCard from '../components/ProductCard';
import styled from 'styled-components';
import { Spin, Icon, message } from 'antd';
import withRouter from '../components/withRouter';
import Router, { DefaultQuery } from 'next/router';
import { CategoryAPI } from '../api';
import { Product } from '../interfaces';
import Spinner from '../components/Spinner';

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
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
        Router.push('/')
      );
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
      if (this.state.products.length) {
        data = this.state.products.map(product => (
          <ProductCard
            key={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            image={product.image}
          />
        ));
      } else {
        data = <div>Some unexpected error occured!</div>;
      }
    }
    return (
      <UserLayout selectedKey="daily">
        <FlexContainer>{data}</FlexContainer>
      </UserLayout>
    );
  }
}

export default withRouter(CategoryPage);
