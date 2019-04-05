import { Alert, Avatar, Button, Card, Modal, Steps } from 'antd';
import distanceInWords from 'date-fns/distance_in_words';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { THEME_VARIABLES } from '../config';
import { Order, Product } from '../interfaces';

const Step = Steps.Step;

const StyledAlert = styled(Alert)`
  border-radius: 7px;
  border: 0;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.12);
`;

const StyledCard: any = styled(Card)`
  margin-top: 8px;
  border-radius: 7px;
  width: 100%;
  border: none;
  text-align: center;
  display: flex;
  flex-direction: row;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.12);
  padding: 0.5rem;

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
    flex: 1;
    display: flex;
    flex-wrap: wrap;

    justify-content: center;
    flex-direction: column;
    align-items: center;

    h2 {
      text-align: center;
      margin: 0;
      color: #000000a6;
      font-size: 1.5rem;
    }

    .date {
      color: #00000088;
      font-size: 1.25rem;
    }
  }

  .price {
    margin: 0;
  }

  .info {
    flex: 1;

    button {
      color: ${THEME_VARIABLES['@primary-color']};
      border: 0;
      box-shadow: 0 2px 2px rgba(0, 0, 0, 0.12);
    }
  }
`;

interface ProductListProps {
  products: Partial<Product>[];
}

const ProductList: FunctionComponent<ProductListProps> = ({ products }) => {
  return (
    <div className="product-list">
      {products.map((product, index) => {
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
  order: Order;
}

const OrderCard: FunctionComponent<OrderProps> = ({ order }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  React.useEffect(() => {
    const timerID = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => {
      clearInterval(timerID);
    };
  });

  const orderState: {
    msg: string;
    date: Date;
    modalType: 'info' | 'error' | 'success' | 'warning';
  } = {
    msg: 'Error',
    date: new Date(),
    modalType: 'info'
  };

  if (order.state === 0) {
    orderState.msg = 'Placed';
    orderState.modalType = 'info';

    if (order.placed) {
      orderState.date = order.placed;
    }
  } else if (order.state === 1) {
    orderState.msg = 'Accepted';
    orderState.modalType = 'warning';

    if (order.accepted) {
      orderState.date = order.accepted;
    }
  } else if (order.state === 2) {
    orderState.msg = 'Finished';
    orderState.modalType = 'success';

    if (order.finished) {
      orderState.date = order.finished;
    }
  } else {
    orderState.msg = 'Declined';
    orderState.modalType = 'error';

    if (order.declined) {
      orderState.date = order.declined;
    }
  }

  const SIZE = 5;
  const slicedProducts = order.products!.slice(0, SIZE);

  if (slicedProducts.length === 4) {
    // @ts-ignore
    slicedProducts.push({ image: '/static/placeholder.png' });
  }

  const handleClick = () => {
    const title = `Order Info - ${orderState.msg}`;
    let totalSum = 0;

    Modal[orderState.modalType]({
      title,
      content: (
        <div>
          {order.products!.map(product => {
            totalSum +=
              product.price! *
              (product.quantity !== undefined ? product.quantity : 1);
            return (
              <div
                key={product.id}
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <p>{product.name}</p>
                <p>
                  {product.price} x {product.quantity}
                </p>
              </div>
            );
          })}
          <strong>Total price: $ {totalSum.toFixed(2)}</strong>
          <div style={{ marginTop: 8 }}>
            {order.state !== undefined && order.state !== 3 ? (
              <Steps progressDot current={order.state} direction="vertical">
                <Step
                  title="Placed"
                  description={
                    order.placed &&
                    distanceInWords(order.placed, currentDate) + ' ago'
                  }
                />
                <Step
                  title="Accepted"
                  description={
                    order.accepted &&
                    distanceInWords(order.accepted, currentDate) + ' ago'
                  }
                />
                <Step
                  title="Finished"
                  description={
                    order.finished &&
                    distanceInWords(order.finished, currentDate) + ' ago'
                  }
                />
              </Steps>
            ) : (
              <Steps progressDot current={1} direction="vertical">
                <Step
                  title="Placed"
                  description={
                    order.placed &&
                    distanceInWords(order.placed, currentDate) + ' ago'
                  }
                />
                <Step
                  title="Declined"
                  description={
                    order.declined &&
                    distanceInWords(order.declined, currentDate) + ' ago'
                  }
                />
              </Steps>
            )}
            {/* {orderState.msg} on{' '}
              {orderState.date &&
                new Date(orderState.date).toLocaleDateString()} */}
          </div>
          <div>
            {order.comment && (
              <StyledAlert
                message="Comment"
                description={order.comment}
                type={orderState.modalType}
                showIcon
                style={{ marginTop: 8 }}
              />
            )}
          </div>
        </div>
      ),
      centered: true,
      // tslint:disable-next-line
      onOk: () => {},
      maskClosable: true
    });
  };

  return (
    <StyledCard>
      <div className="products">
        <ProductList products={slicedProducts} />
      </div>
      <div className="description">
        <h2 className="state">{orderState.msg}</h2>
        <h2 className="date">
          {orderState.date !== undefined &&
            distanceInWords(orderState.date, currentDate)}{' '}
          ago
        </h2>
      </div>
      <div className="info">
        <Button shape="circle" icon="info" size="large" onClick={handleClick} />
      </div>
    </StyledCard>
  );
};

export default OrderCard;
