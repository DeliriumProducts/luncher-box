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
      <UserLayout selectedKey="home">
        <FlexContainer>
          <Product
            image="https://static01.nyt.com/images/2016/11/29/dining/recipelab-chick-noodle-still/recipelab-chick-noodle-still-videoSixteenByNineJumbo1600.jpg"
            description="It's with chickenIt'sIt's with chickenIt's with chicken niggerIt's with chicken niggerIt's with chicken nigger niggerIt's with chickenIt's with chicken niggerIt's with chicken niggerIt's with chicken nigger niggerIt's with chickenIt's with chicken niggerIt's with chicken niggerIt's with chicken nigger niggerIt's with chickenIt's with chicken niggerIt's with chicken niggerIt's with chicken nigger niggerIt's with chickenIt's with chicken niggerIt's with chicken niggerIt's with chicken nigger niggerIt's with chickenIt's with chicken niggerIt's with chicken niggerIt's with chicken nigger nigger with chicken niggerIt's with chicken niggerIt's with chicken nigger nigger"
            name="Chicken Soup"
            price="3.2"
          />

          <Product
            image="https://static01.nyt.com/images/2016/11/29/dining/recipelab-chick-noodle-still/recipelab-chick-noodle-still-videoSixteenByNineJumbo1600.jpg"
            description="It's with chicken nigger"
            name="REALLY LONG TITLE NIGGERREALLY LONG TITLE NIGGERREALLY LONG TITLE NIGGERREALLY LONG TITLE NIGGERREALLY LONG TITLE NIGGERREALLY LONG TITLE NIGGERREALLY LONG TITLE NIGGERREALLY LONG TITLE NIGGERREALLY LONG TITLE NIGGER"
            price="3.2"
          />
          <Product
            image="https://static01.nyt.com/images/2016/11/29/dining/recipelab-chick-noodle-still/recipelab-chick-noodle-still-videoSixteenByNineJumbo1600.jpg"
            description="It's with chicken nigger"
            name="Chicken Soup"
            price="3.2"
          />
          <Product
            image="https://static01.nyt.com/images/2016/11/29/dining/recipelab-chick-noodle-still/recipelab-chick-noodle-still-videoSixteenByNineJumbo1600.jpg"
            description="It's with chicken nigger"
            name="Chicken Soup"
            price="3.2"
          />
          <Product
            image="https://static01.nyt.com/images/2016/11/29/dining/recipelab-chick-noodle-still/recipelab-chick-noodle-still-videoSixteenByNineJumbo1600.jpg"
            description="It's with chicken nigger"
            name="Chicken Soup"
            price="3.2"
          />
          <Product
            image="https://static01.nyt.com/images/2016/11/29/dining/recipelab-chick-noodle-still/recipelab-chick-noodle-still-videoSixteenByNineJumbo1600.jpg"
            description="It's with chicken nigger"
            name="Chicken Soup"
            price="3.2"
          />
          <Product
            image="https://static01.nyt.com/images/2016/11/29/dining/recipelab-chick-noodle-still/recipelab-chick-noodle-still-videoSixteenByNineJumbo1600.jpg"
            name="Chicken Soup"
            description="It's with chicken nigger"
            price="3.2"
          />
          <Product
            image="https://static01.nyt.com/images/2016/11/29/dining/recipelab-chick-noodle-still/recipelab-chick-noodle-still-videoSixteenByNineJumbo1600.jpg"
            name="Chicken Soup"
            description="It's with chicken nigger"
            price="3.2"
          />
          <Product
            image="https://static01.nyt.com/images/2016/11/29/dining/recipelab-chick-noodle-still/recipelab-chick-noodle-still-videoSixteenByNineJumbo1600.jpg"
            name="Chicken Soup"
            description="It's with chicken nigger"
            price="3.2"
          />
          <Product
            image="https://static01.nyt.com/images/2016/11/29/dining/recipelab-chick-noodle-still/recipelab-chick-noodle-still-videoSixteenByNineJumbo1600.jpg"
            name="Chicken Soup"
            description="It's with chicken nigger"
            price="3.2"
          />
        </FlexContainer>
      </UserLayout>
    );
  }
}

export default Home;
