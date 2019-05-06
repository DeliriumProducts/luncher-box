import { Button, Card, Empty, Input, message, Modal, Select, Tag } from 'antd';
import { NextFunctionComponent } from 'next';
import Head from 'next/head';
import React from 'react';
import styled from 'styled-components';
import { TableAPI } from '../../api';
import FlexContainer from '../../components/FlexContainer';
import ItemCard from '../../components/ItemCard';
import PageHeader from '../../components/PageHeader';
import { CustomerContext, SocketContext } from '../../context';
import { Table } from '../../interfaces';

const { Option } = Select;
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

interface Props {
  tables: Table[];
  err: string | null;
}

const Cart: NextFunctionComponent<Props> = ({ tables, err }) => {
  const socketContext = React.useContext(SocketContext);
  const cartContext = React.useContext(CustomerContext);

  /**
   * Show only on cDM
   */
  React.useEffect(() => {
    if (err) {
      message.error(`${err}`, 3);
    }
  }, []);

  const handleComment = (e: React.FormEvent<HTMLTextAreaElement>) => {
    cartContext.actions.comment(e.currentTarget.value);
  };

  const handleTable = val => {
    cartContext.actions.setTable({ name: val });
  };

  const placeOrder = () => {
    if (cartContext.order.table.name) {
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
            {cartContext.order.products.map(orderProduct => {
              totalSum +=
                orderProduct.product.price *
                (orderProduct.quantity !== undefined
                  ? orderProduct.quantity
                  : 1);
              return (
                <div
                  key={orderProduct.product.id}
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <p>{orderProduct.product.name}</p>
                  <p>
                    {orderProduct.product.price} x {orderProduct.quantity}
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
              (accumulator: any, { product, quantity }) => [
                ...accumulator,
                { id: product.id, quantity }
              ],
              []
            );

            socketContext.socket.emit('place-order', {
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
        {cartContext.order.products.map(orderProduct => {
          totalSum +=
            orderProduct.product.price *
            (orderProduct.quantity !== undefined ? orderProduct.quantity : 1);
          return (
            <ItemCard
              interactive
              id={orderProduct.product.id}
              key={orderProduct.product.id}
              name={orderProduct.product.name}
              description={orderProduct.product.description}
              image={orderProduct.product.image}
              price={orderProduct.product.price}
              quantity={orderProduct.quantity}
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
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Select
                style={{ marginTop: '2%', width: '100%' }}
                placeholder="Please select your table"
                defaultValue={cartContext.order.table.name || []}
                onChange={handleTable}
              >
                {tables.map(t => (
                  <Option value={t.name}>{t.name}</Option>
                ))}
              </Select>
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
      <FlexContainer>
        <PageHeader
          title={
            <h1>
              <strong>Cart</strong>
            </h1>
          }
          subTitle={
            <h3>
              <strong>({productsInCart})</strong>
            </h3>
          }
        >
          {data}
        </PageHeader>
      </FlexContainer>
    </>
  );
};

Cart.getInitialProps = async () => {
  try {
    let tables: Table[] = [];

    tables = await TableAPI.getAll();

    tables = tables.map(s => ({
      ...s,
      key: s.id
    }));

    if (tables) {
      return {
        tables,
        err: null
      };
    }
  } catch (err) {
    return {
      tables: [],
      err: `Network Error, Please try again later!`
    };
  }

  return {
    tables: [],
    err: null
  };
};

export default Cart;
