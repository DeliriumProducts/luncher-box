import { Avatar, Badge, Button, Card, Icon } from 'antd';
import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { THEME_VARIABLES } from '../config';
import { Order, Product } from '../interfaces';
import { DeepPartial } from '../types';

const StyledCard = styled(Card)`
  margin-top: 8px;
  border-radius: 7px;
  width: 100%;
  border: none;
  text-align: center;
  display: flex;
  flex-direction: row;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.12);

  h1 {
    font-size: 2rem;
  }

  @media (max-width: 768px) {
    .ant-card-body {
      flex-direction: column;
    }

    width: 100%;
    flex-basis: 100%;
  }

  .ant-card-body {
    width: 100%;
    display: flex;
    padding-top: 8px;
    padding-bottom: 8px;
    align-items: center;
    padding-left: 0;
    padding-right: 0;
    justify-content: center;
  }

  .ant-btn-group {
    min-width: 8rem;
  }

  .ant-avatar > img {
    object-fit: cover;
    border: 4px solid #fff;
    border-radius: 45px;
  }

  .ant-avatar {
    left: 10px;
    margin-left: -23px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }

  .products {
    flex: 1;
  }

  .description {
    text-align: center;
    align-self: center;
    flex: 1;
  }

  .info {
    flex: 1;
  }

  padding: 1rem;
`;

interface ProductListProps {
  products: Partial<Product>[];
}

const ProductList: FunctionComponent<ProductListProps> = ({ products }) => {
  return (
    <div className="product-list">
      {products.map((product, index) => {
        if (product.quantity! > 1) {
          return (
            <Badge
              count={product.quantity}
              key={index}
              offset={[-3, 3]}
              style={{
                backgroundColor: THEME_VARIABLES['@primary-color']
              }}
            >
              <Avatar src={product.image} size={45} className="avatar" />
            </Badge>
          );
        }

        return (
          <Avatar
            src={product.image}
            size={45}
            key={index}
            className="avatar"
          />
        );
      })}
    </div>
  );
};

interface OrderProps {
  order: DeepPartial<Order>;
}

const OrderCard: FunctionComponent<OrderProps> = ({
  order: { products, state }
}) => {
  const SIZE = 5;
  const slicedProducts = products!.slice(0, SIZE);

  if (slicedProducts.length === 5) {
    slicedProducts.push({ image: '/static/placeholder.png' });
  }

  return (
    <StyledCard>
      <div className="products">
        <ProductList products={slicedProducts} />
      </div>
      <div className="description">asdfasdfasdfasdfasdf | asdfasdf</div>
      <div className="info">
        <Button shape="circle">
          <Icon type="info" />
        </Button>
      </div>
    </StyledCard>
  );
};

export default OrderCard;
