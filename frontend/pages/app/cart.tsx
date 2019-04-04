import { Button, Card, Empty, Input, message, Modal, Tag } from 'antd';
import Head from 'next/head';
import React from 'react';
import styled from 'styled-components';
import ItemCard from '../../components/ItemCard';
import { CustomerContext, SocketContext } from '../../context';
import { Product } from '../../interfaces';

const { TextArea } = Input;

const StyledCard = styled(Card)`
  margin-top: 8px;
  border-radius: 7px;
  border: none;
  display: flex;

  .ant-card-body {
    padding-bottom: 0;
    padding-top: 0;
  }

  flex-direction: column;
  text-align: center;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.12);
`;

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
  background-color: #fafafa;
  border-radius: 7px;
  box-shadow: 0 20px 24px -18px rgba(0, 0, 0, 0.31);

  @media (min-width: 768px) {
    margin: auto;
    width: 70%;
  }

  @media (max-width: 480px) {
    border-radius: 0;
  }
`;

export default () => {
  const socketContext = React.useContext(SocketContext);
  const cartContext = React.useContext(CustomerContext);

  const handleComment = (e: React.FormEvent<HTMLTextAreaElement>) => {
    cartContext.actions.comment(e.currentTarget.value);
  };

  const handleTable = (e: React.FormEvent<HTMLInputElement>) => {
    cartContext.actions.setTable(e.currentTarget.value);
  };

  const placeOrder = () => {
    if (cartContext.order.table) {
      /**
       * Remove the actions and the totalAmount before sending to the backend
       */
      const { order } = cartContext;

      let totalSum = 0;
      Modal.warn({
        title: (
          <h2
            style={{
              color: '#000000a6',
              margin: 0,
              marginBottom: 12,
              fontSize: '1.2rem',
              fontWeight: 525
            }}
          >
            Are you sure you want to place this order?
          </h2>
        ),
        centered: true,
        content: (
          <div>
            {cartContext.order.products.map((product: Product) => {
              totalSum +=
                product.price *
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
          </div>
        ),
        onOk: () => {
          if (socketContext.socket) {
            /**
             * Instead of sending every product, send only the product id
             */
            const productsIdsAndQuantities = order.products.reduce(
              (accumulator: any, { id, quantity }: Product) => [
                ...accumulator,
                { id, quantity }
              ],
              []
            );

            socketContext.socket.emit('place_order', {
              ...order,
              products: productsIdsAndQuantities
            });

            cartContext.actions.clear();
          }
        },
        maskClosable: true
      });
    } else {
      message.error('Please, enter your table! 🤚');
    }
  };

  let data: React.ReactNode[] | React.ReactNode;
  /**
   * Check whether orders are still being fetched from localStorage
   */
  if (cartContext.order && cartContext.order.products.length) {
    let totalSum = 0;
    data = (
      <>
        {cartContext.order.products.map((product: Product) => {
          totalSum +=
            product.price *
            (product.quantity !== undefined ? product.quantity : 1);
          return (
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
          );
        })}
        <div style={{ width: '100%' }}>
          <StyledCard>
            <TextArea
              // tslint:disable-next-line
              placeholder="Write comments in case you are allergic to ingredients or want to exclude some. e.g. no onions, no mayo. "
              onChange={handleComment}
              rows={6}
              defaultValue={cartContext.order.comment}
              style={{ width: '100%', marginTop: '2%' }}
            />
            <div style={{ display: 'flex' }}>
              <Input
                defaultValue={cartContext.table}
                placeholder="Enter table e.g. A1, A2 etc."
                onChange={handleTable}
                style={{ marignLeft: '1%', marginTop: '2%' }}
                size="large"
              />
            </div>
            <Button
              type="primary"
              style={{ marginBottom: '2%', marginTop: '2%' }}
              onClick={placeOrder}
            >
              Place order!
            </Button>
            <Tag style={{ marginLeft: '2%' }} color="green">
              Total price: $ {totalSum.toFixed(2)}
            </Tag>
          </StyledCard>
        </div>
      </>
    );
  } else {
    data = (
      <Empty description="No products">
        No items added to the cart yet. Go and add some!
      </Empty>
    );
  }

  const { totalAmount: productsInCart } = cartContext;

  return (
    <>
      <Head>
        <title>
          {productsInCart > 0
            ? `(${productsInCart}) ${
                productsInCart === 1 ? 'Item' : 'Items'
              } in`
            : ''}{' '}
          Cart • LuncherBox
        </title>
      </Head>
      <FlexContainer>{data}</FlexContainer>
    </>
  );
};
