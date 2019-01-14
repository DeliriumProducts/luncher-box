import { Component } from 'react';
import styled from 'styled-components';
import { message } from 'antd';
import withRouter from '../../components/withRouter';
import Router, { DefaultQuery } from 'next/router';
import { CategoryAPI } from '../../api';
import { Product } from '../../interfaces';
import withAuth from '../../components/withAuth';
import AdminLayout from '../../components/AdminLayout';
import EntityCardContainer from '../../components/EntityCardContainer';
import EntityCard from '../../components/EntityCard';
import { AdminContext } from '../../context';

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;

  .col {
    flex: 1;
    max-width: 50%;
    height: 100%;
    margin: auto;
  }

  @media (max-width: 768px) {
    .col {
      max-width: 100%;
      margin-top: 3%;
    }

    flex-direction: column;
  }
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
  static contextType = AdminContext;
  context!: React.ContextType<typeof AdminContext>;

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
      message.error(`${err}, Redirecting you to the home page...`, 3, () =>
        Router.push('/admin')
      );
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    return (
      <AdminLayout selectedKey="home">
        <FlexContainer>
          <div className="col">
            <EntityCardContainer
              title={`Products (${this.state.products.length})`}
              entityType="product"
              loading={this.state.loading}
            >
              {this.state.products.map(product => (
                <EntityCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  image={product.image}
                  description={product.description}
                  price={product.price}
                />
              ))}
            </EntityCardContainer>
          </div>
        </FlexContainer>
      </AdminLayout>
    );
  }
}

export default withRouter(withAuth(CategoryPage));
