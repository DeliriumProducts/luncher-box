import { Component, ContextType } from 'react';
import Category from '../components/Category';
import UserLayout from '../components/UserLayout';
import { EntityContext } from '../context/EntityContext';
import Product from '../components/Product';
import styled from 'styled-components';
import { Spin, Icon } from 'antd';

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

class Home extends Component {
  static contextType = EntityContext;
  context!: React.ContextType<typeof EntityContext>;

  async componentDidMount() {
    await this.context.actions.updateEntities();
  }

  render() {
    return (
      <UserLayout selectedKey="home">
        <FlexContainer>
          {this.context.loading ? (
            <Spin
              indicator={<Icon style={{ color: '#fff' }} type="loading" spin />}
            />
          ) : (
            <>
              {this.context.entities.categories.map(category => (
                <Category
                  key={category.id}
                  id={category.id}
                  name={category.name}
                  image={category.image}
                />
              ))}
            </>
          )}
        </FlexContainer>
      </UserLayout>
    );
  }
}

export default Home;
