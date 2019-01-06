import { Component, ContextType } from 'react';
import Category from '../components/Category';
import UserLayout from '../components/UserLayout';
import { EntityContext } from '../context/EntityContext';
import Product from '../components/Product';
import styled from 'styled-components';
import { Spin, Icon } from 'antd';
import withRouter from '../components/withRouter';
import { DefaultQuery } from 'next/router';

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
  categoryIndex: number;
}

class CategoryPage extends Component<Props, State> {
  static contextType = EntityContext;
  context!: React.ContextType<typeof EntityContext>;

  state: State = {
    categoryIndex: 0
  };

  async componentDidMount() {
    const id = Number(this.props.query.categoryId);
    await this.context.actions.updateEntities();

    const categoryIndex = this.context.entities.categories.findIndex(
      category => category.id === id
    );

    this.setState({ categoryIndex });
  }

  render() {
    const { categoryIndex } = this.state;

    return (
      <UserLayout selectedKey="daily">
        <FlexContainer>
          {this.context.loading ? (
            <Spin
              indicator={<Icon style={{ color: '#fff' }} type="loading" spin />}
            />
          ) : categoryIndex !== -1 ? (
            <>
              {this.context.entities.categories[categoryIndex].products.map(
                product => (
                  <Product
                    key={product.id}
                    name={product.name}
                    description={product.description}
                    price={product.price}
                    image={product.image}
                  />
                )
              )}
            </>
          ) : (
            <div>Error 404 Component</div>
          )}
        </FlexContainer>
      </UserLayout>
    );
  }
}

export default withRouter(CategoryPage);
