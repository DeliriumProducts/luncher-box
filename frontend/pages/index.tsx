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
  }

  render() {
    return (
      <UserLayout selectedKey="daily">
        <FlexContainer>
          <Category
            name="pesho"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RedDot_Burger.jpg/1200px-RedDot_Burger.jpg"
          />
          <Category
            name="pesho"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RedDot_Burger.jpg/1200px-RedDot_Burger.jpg"
          />
          <Category
            name="pesho"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RedDot_Burger.jpg/1200px-RedDot_Burger.jpg"
          />
          <Category
            name="pesho"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RedDot_Burger.jpg/1200px-RedDot_Burger.jpg"
          />
          <Category
            name="pesho"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RedDot_Burger.jpg/1200px-RedDot_Burger.jpg"
          />
          <Category
            name="pesho"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RedDot_Burger.jpg/1200px-RedDot_Burger.jpg"
          />
          <Category
            name="pesho"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RedDot_Burger.jpg/1200px-RedDot_Burger.jpg"
          />
          <Category
            name="pesho"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RedDot_Burger.jpg/1200px-RedDot_Burger.jpg"
          />
        </FlexContainer>
      </UserLayout>
    );
  }
}

export default Home;
