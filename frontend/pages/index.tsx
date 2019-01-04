import { Component, ContextType } from 'react';
import Category from '../components/Category';
import UserLayout from '../components/UserLayout';
import { EntityContext } from '../context/EntityContext';
import Product from '../components/Product';
import styled from 'styled-components';

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

class Home extends Component {
  static contextType = EntityContext;
  context!: React.ContextType<typeof EntityContext>;

  componentDidMount() {
    this.context.actions.updateEntities();
    console.log(this.context.entities.categories);
  }

  render() {
    return (
      <UserLayout selectedKey="daily">
        <FlexContainer>
          {this.context.entities.categories.map(category => (
            <Category
              key={category.id}
              name={category.name}
              image={category.image}
            />
          ))}
          {this.context.entities.products.map(product => (
            <Product
              key={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              image={product.image}
            />
          ))}
        </FlexContainer>
      </UserLayout>
    );
  }
}

export default Home;
