import UserLayout from '../components/UserLayout';
import ItemCard from '../components/ItemCard';
import styled from 'styled-components';

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

export default () => (
  <UserLayout selectedKey="cart">
    <FlexContainer>
      <ItemCard name="Chicken Salad" price={5.4} quantity={5} interactive />
      <ItemCard name="Chicken Soup" price={5.4} quantity={5} interactive />
      <ItemCard name="Chicken Nuggers" price={5.4} quantity={5} interactive />
      <ItemCard name="Pizza Margharitta" price={5.4} quantity={5} interactive />
      <ItemCard
        name="Soups with chicken negger"
        image="https://i.imgur.com/adTaN7u.jpg"
        price={5.4}
        quantity="5 times"
      />
    </FlexContainer>
  </UserLayout>
);
