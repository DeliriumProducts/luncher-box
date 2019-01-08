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

class CategoryPage extends Component<Props> {
  static contextType = EntityContext;
  context!: React.ContextType<typeof EntityContext>;

  componentDidMount() {
    this.context.actions.update();
  }

  render() {
    let categoryIndex = -2;
    if (this.context.entities.categories.length) {
      const id = Number(this.props.query.categoryId);
      categoryIndex = this.context.entities.categories.findIndex(
        category => category.id === id
      );
    }

    return (
      <UserLayout selectedKey="daily">
        <FlexContainer>
          {this.context.loading ? (
            <Spin
              indicator={<Icon style={{ color: '#000' }} type="loading" spin />}
            />
          ) : categoryIndex === -1 ? (
            <div>Error 404 Component</div>
          ) : (
            <>
              {!!this.context.entities.categories.length &&
                this.context.entities.categories[categoryIndex].products.map(
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
          )}
        </FlexContainer>
      </UserLayout>
    );
  }
}

export default withRouter(CategoryPage);
