import { Alert, Button, Collapse, message, Tag } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { OrderAPI } from '../api';
import { THEME_VARIABLES } from '../config';
import { Order } from '../interfaces';
import ItemCard from './ItemCard';

const customPanelStyle = {
  background: '#fff',
  borderRadius: 7,
  marginBottom: 8,
  border: 0,
  boxShadow: '0 2px 2px rgba(0,0,0,0.12)'
};

const StyledAlert = styled(Alert)`
  border-radius: 7px;
  border: 0;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.12);
`;

export const FlexSpan = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding-top: 8px;
  padding-bottom: 8px;

  .title {
    word-break: break-all;
  }

  .right {
    margin-left: auto;

    & > * {
      margin-right: 20px;
      color: ${THEME_VARIABLES['@primary-color']};
      border: 0;
      box-shadow: 0 2px 2px rgba(0, 0, 0, 0.12);
    }
  }
`;

interface ItemCardHeaderProps {
  orderId: number;
  orderTable: string;
  orderState?: number;
}

const ItemCardHeader: React.FunctionComponent<ItemCardHeaderProps> = ({
  orderId,
  orderState,
  orderTable
}) => {
  const handleAccept = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    await OrderAPI.accept(orderId);
    message.success(`Successfully accepted order ${orderId + 1} 🎉`);
  };

  const handleDecline = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    await OrderAPI.decline(orderId);
    message.success(`Successfully declined order ${orderId + 1} 🎉`);
  };

  const handleFinish = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    await OrderAPI.finish(orderId);
    message.success(`Successfully finished order ${orderId + 1} 🎉`);
  };

  let data: React.ReactNode;

  if (orderState === 0) {
    data = (
      <>
        <span className="title">Table № {orderTable}</span>
        <span className="right">
          <Button
            onClick={handleAccept}
            shape="circle"
            type="default"
            icon="check"
            size="large"
          />
          <Button
            onClick={handleDecline}
            shape="circle"
            type="default"
            icon="close"
            size="large"
          />
        </span>
      </>
    );
  } else if (orderState === 1) {
    data = (
      <>
        <span className="title">Table № {orderTable} </span>
        <span className="right">
          <Button
            shape="circle"
            onClick={handleFinish}
            type="default"
            icon="flag"
            size="large"
          />
        </span>
      </>
    );
  } else {
    data = <span className="title">Order finished!</span>;
  }

  return <FlexSpan>{data}</FlexSpan>;
};

interface OrderContainerProps {
  orders: Order[];
}

const OrderContainer: React.FunctionComponent<OrderContainerProps> = ({
  orders
}) => {
  return (
    <Collapse bordered={false} style={{ background: '#fafafa' }}>
      {orders.length > 0 &&
        orders.map(order => {
          let totalSum = 0;
          return (
            <Collapse.Panel
              key={order.id!.toString()}
              header={
                <ItemCardHeader
                  orderId={order.id!}
                  orderTable={order.table}
                  orderState={order.state && order.state}
                />
              }
              style={customPanelStyle}
            >
              {orders.length &&
                order.products.map(product => {
                  totalSum +=
                    product.price *
                    (product.quantity !== undefined ? product.quantity : 1);
                  return (
                    <ItemCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      description={product.description}
                      image={product.image}
                      price={product.price}
                      quantity={product.quantity}
                      interactive={false}
                    />
                  );
                })}
              {order.comment && (
                <StyledAlert
                  message="Comment"
                  description={order.comment}
                  type="info"
                  showIcon
                  style={{ marginTop: '8px' }}
                />
              )}
              {order.state === 2 && (
                <StyledAlert
                  message="Success!"
                  type="success"
                  showIcon
                  description={
                    totalSum > 0 && (
                      <Tag color="green">
                        Total price: $ {totalSum.toFixed(2)}
                      </Tag>
                    )
                  }
                  style={{ marginTop: '8px' }}
                />
              )}
            </Collapse.Panel>
          );
        })}
    </Collapse>
  );
};

export default OrderContainer;
