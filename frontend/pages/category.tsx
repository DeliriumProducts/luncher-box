import { Component, ContextType } from 'react';
import UserLayout from '../components/UserLayout';
import ProductCard from '../components/ProductCard';
import styled from 'styled-components';
import { Spin, Icon, message } from 'antd';
import withRouter from '../components/withRouter';
import { DefaultQuery } from 'next/router';
import { CategoryAPI } from '../api';
import { Product } from '../interfaces';

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
  products: Product[] | undefined;
  loading: boolean;
}

class CategoryPage extends Component<Props, State> {
  state: State = {
    products: undefined,
    loading: true
  };

  async componentDidMount() {
    try {
      this.setState({ loading: true });

      const products = (await CategoryAPI.getOne(
        Number(this.props.query.categoryId)
      )).products;

      this.setState({ products });
    } catch (err) {
      message.error(err);
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    return (
      <UserLayout selectedKey="daily">
        <FlexContainer>
          {this.state.loading ? (
            <Spin
              indicator={<Icon style={{ color: '#000' }} type="loading" spin />}
            />
          ) : (
            <>
              {this.state.products &&
                this.state.products.map(product => (
                  <ProductCard
                    key={product.id}
                    name={product.name}
                    description={product.description}
                    price={product.price}
                    image={product.image}
                  />
                ))}
            </>
          )}
        </FlexContainer>
      </UserLayout>
    );
  }
}

export default withRouter(CategoryPage);
