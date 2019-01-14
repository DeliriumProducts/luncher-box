import { Component } from 'react';
import { message } from 'antd';
import AdminLayout from '../../components/AdminLayout';
import withAuth from '../../components/withAuth';
import { AdminContext } from '../../context';
import EntityCard from '../../components/EntityCard';
import styled from 'styled-components';
import EntityCardContainer from '../../components/EntityCardContainer';

interface State {
  loading: boolean;
}

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
class Index extends Component<any, State> {
  static contextType = AdminContext;
  context!: React.ContextType<typeof AdminContext>;

  state = {
    loading: true
  };

  async componentDidMount() {
    try {
      await this.context.actions.update();
    } catch (err) {
      message.error(`${err}`);
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
              title={`Categories (${this.context.entities.categories.length})`}
              entityType="category"
              loading={this.state.loading}
            >
              {this.context.entities.categories &&
                this.context.entities.categories.map(category => (
                  <EntityCard
                    key={category.id}
                    id={category.id}
                    name={category.name}
                    image={category.image}
                    hoverable={true}
                  />
                ))}
            </EntityCardContainer>
          </div>
          {/* <div className="col">
            <EntityCardContainer
              title={`Products (${this.context.entities.products.length})`}
              entityType="product"
              loading={this.state.loading}
            >
              {this.context.entities.products.map(product => (
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
          </div> */}
        </FlexContainer>
      </AdminLayout>
    );
  }
}

export default withAuth(Index);
