import UserLayout from '../components/UserLayout';
import ItemCard from '../components/ItemCard';
import styled from 'styled-components';
import { CartContext } from '../context';
import { Empty } from 'antd';
import React from 'react';
import { Product } from '../interfaces';

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

export default class extends React.Component {
  static contextType = CartContext;
  context!: React.ContextType<typeof CartContext>;

  render() {
    return (
      <UserLayout selectedKey="cart">
        <FlexContainer>
          {this.context.products.length ? (
            this.context.products.map((product: Product) => (
              <ItemCard
                interactive
                id={product.id}
                key={product.id}
                name={product.name}
                description={product.description}
                image={product.image}
                price={product.price}
                quantity={product.quantity}
              />
            ))
          ) : (
            <Empty description="No products">
              No items added to the cart yet. Go and add some!
            </Empty>
          )}
        </FlexContainer>
      </UserLayout>
    );
  }
}
