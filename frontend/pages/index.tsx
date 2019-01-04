import { Component, ContextType } from 'react';
import Category from '../components/Category';
import UserLayout from '../components/UserLayout';
import { EntityContext } from '../context/EntityContext';
import Product from '../components/Product';
import styled from 'styled-components';
import { Skeleton } from 'antd';

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
          <Product
            image="https://static01.nyt.com/images/2016/11/29/dining/recipelab-chick-noodle-still/recipelab-chick-noodle-still-videoSixteenByNineJumbo1600.jpg"
            description="it'iit'it's with chickit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenenit's with chickit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenenit's with chickit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenens with chickit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenenit'it's with chickit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenenit's with chickit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenenit's with chickit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenens with chickit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenenit'it's with chickit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenenit's with chickit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenenit's with chickit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenens with chickit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenent's with chickit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenenit's with chickit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenenit's with chickit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenens with chickit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenit's with chickenen"
            name="Пилешки крилца с гарнитура"
            price="3.2324234234234124"
          />
          <Product
            image="https://static01.nyt.com/images/2016/11/29/dining/recipelab-chick-noodle-still/recipelab-chick-noodle-still-videoSixteenByNineJumbo1600.jpg"
            description="It's It's with chicken niIt's with chicken niIt's with chicken niIt's with chicken niwith chicken ni"
            name="REALLY LONG NAMEREALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME REALLY LONG NAME  "
            price="3.2"
          />
          <Product
            image="https://upload.wikimedia.org/wikipedia/commons/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg"
            description="PIZZA NIGGEPIZZA NIGGEPIZZA NIGGE"
            name="pizza"
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
            description="It's with chicken"
            price="3.2"
          />
        </FlexContainer>
      </UserLayout>
    );
  }
}

export default Home;
