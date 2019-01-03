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
            description="it's with chickit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenen"
            name="Chicken Soup"
            price="3.2"
          />

          <Product
            image="https://static01.nyt.com/images/2016/11/29/dining/recipelab-chick-noodle-still/recipelab-chick-noodle-still-videoSixteenByNineJumbo1600.jpg"
            description="It's with chicken ni"
            name="REALLY LONG NAMEREALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME  "
            price="3.2"
          />
          <Product
            image="https://cdn3.tmbi.com/toh/GoogleImages/Crispy-Fried-Chicken_exps6445_PSG143429D03_05_5b_RMS.jpg"
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
